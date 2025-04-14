# Moveable（拖拽交互）的实现原理与关键代码

Moveable 是 Studio 低代码平台中负责组件拖拽交互的核心模块，它基于开源的 Moveable 库进行了二次封装和扩展，实现了组件精确定位、拖拽、缩放等功能。下面从实现原理和核心代码两方面进行详细解析：

## 1. 实现原理

### 1.1 核心设计思想

Moveable 采用了以下设计思想：

- 组件化封装：将拖拽功能封装为独立的 MoveableManager 类
- 事件驱动模式：通过事件监听和回调机制实现交互逻辑
- 状态管理：维护拖拽目标和状态信息
- DOM 操作抽象：封装底层 DOM 操作，提供简洁的 API

### 1.2 关键技术点

- CSS 样式控制：通过直接操作 DOM 元素的 style 属性实现位置和大小的动态调整
- 使用 CSS 类名和选择器识别可拖拽元素
- 事件处理机制：监听鼠标事件，如 mousedown, mousemove, mouseup
- 使用事件委托模式减少事件监听器数量
- 元素选择与标识：使用自定义属性（如 instanceId）标识拖拽元素
- 通过 CSS 选择器快速定位目标元素
- 位置计算：使用 getBoundingClientRect()获取元素位置信息
- 计算拖拽偏移量并应用到元素样式

## 2. 核心代码解析

### 2.1 MoveableManager 类的实现

MoveableManager 是整个拖拽交互的核心类，它封装了 Moveable 库的功能，并添加了特定于 Studio 的逻辑：

```typescript
export class MoveableManager {
  private readonly rootClassName: string;
  private readonly groupClassName: string;
  private readonly targetClassName: string;
  private readonly moveableIdName: string;
  private readonly fixedClassName: string;
  public currentMoveable: any;
  private onUpdateCallback: Function;
  private onSelectCallback: Function;
  private onScrollEndCallback: Function;
  private rootTarget: Element;
  public onCancelCallback: Function;

  constructor({
    rootClassName,
    groupClassName,
    targetClassName,
    moveableIdName,
    fixedClassName,
  }) {
    this.rootClassName = getClassName(rootClassName);
    this.groupClassName = getClassName(groupClassName);
    this.targetClassName = getClassName(targetClassName);
    this.fixedClassName = getClassName(fixedClassName);
    this.moveableIdName = moveableIdName;
    this.currentMoveable = null;
  }

  // 注册回调函数
  onUpdate(onUpdateCallback: Function) {
    this.onUpdateCallback = onUpdateCallback;
  }

  onSelect(onSelectCallback: Function) {
    this.onSelectCallback = onSelectCallback;
  }

  onCancel(onCancelCallback: Function) {
    this.onCancelCallback = onCancelCallback;
  }

  onScrollEnd(onScrollEndCallback: Function) {
    this.onScrollEndCallback = onScrollEndCallback;
  }
}
```

### 2.2 初始化和组件查找

```typescript
function init() {
  this.rootTarget = this.getRootTarget();
  if (this.rootTarget) {
    const groupTargets = document.querySelectorAll<HMTLElementWithMoveable>(
      `${this.groupClassName}`
    );
    groupTargets.forEach((group) => {
      group.isBindMoveEvent = false;
      if (!group.isBindMoveEvent) {
        group.isBindMoveEvent = true;
      }

      let targets: NodeListOf<HTMLDivElement>;
      // 判断如果是根组件，则直接获取子元素
      if (group.classList.contains(`${this.rootClassName.substring(1)}`)) {
        targets = group.querySelectorAll(`:scope > ${this.targetClassName}`);
      } else {
        // 如果是容器组件，则去下面第三层去查找
        targets = group.querySelectorAll(
          `:scope > * > * > ${this.targetClassName}`
        );
      }

      const movableTargets = Array.from(targets);
      this.initializeMoveableElements(group, movableTargets);
    });
  }
}
```

### 2.3 Moveable 实例配置与事件绑定

```typescript
initializeMoveableElements(container: HMTLElementWithMoveable, targets: HTMLDivElement[]) {
  container.moveable = new Moveable(container, {
    draggable: true, // 是否允许元素拖拽
    resizable: true, // 是否允许元素调整大小
    snappable: true, // 是否启用吸附功能
    elementGuidelines: targets, // 元素对齐辅助线的目标数组
    horizontalGuidelines: [0, container.offsetHeight / 2, container.offsetHeight], // 水平辅助线
    verticalGuidelines: [0, container.offsetWidth / 2, container.offsetWidth], // 垂直辅助线
    keepRatio: false, // 调整大小时是否保持宽高比
    snapThreshold: 5, // 吸附的阈值（像素）
    scalable: false, // 是否允许元素缩放
    rotatable: false, // 是否允许元素旋转
    origin: false, // 是否使用原点作为移动和旋转的参考点
    snapDirections: { // 吸附方向
      top: true, left: true, bottom: true, right: true, center: true, middle: true,
    },
    elementSnapDirections: { // 元素吸附方向
      top: true, left: true, bottom: true, right: true, center: true, middle: true,
    },
  })
}

// 为每个目标元素绑定鼠标事件
targets.forEach((target) => {
  if (!target['isBindMoveEvent']) {
    target['isBindMoveEvent'] = true
    target.addEventListener('mousedown', (e) => {
      window.focus()
      e.stopPropagation()
      this.clearAllSelections()
      container.moveable.target = target
      this.currentMoveable = container.moveable
      this.handleSelectTarget?.(target, container.moveable)
      container.moveable.dragStart(e)
    })
  }
})

// 处理大小调整
container.moveable.on('resize', ({ target, width, height, drag }) => {
  target.style.width = `${width}px`
  target.style.height = `${height}px`
  target.style.left = `${drag.left}px`
  target.style.top = `${drag.top}px`
  const child = target.firstChild as HTMLDivElement
  child.style.width = `${width}px`
  child.style.height = `${height}px`
  child.style.left = `${drag.left}px`
  child.style.top = `${drag.top}px`
})

// 大小调整结束
container.moveable.on('resizeEnd', ({ target }) => {
  this.updateOriginalData('resize', target)
})

// 拖拽开始
container.moveable.on('dragStart', (event) => {
  const { target } = event
  recordOffsetStart(target as HTMLDivElement)
})

// 拖拽过程
container.moveable.on('drag', (event) => {
  const { target, left, top } = event
  // 浮动元素不允许拖拽
  if (target.classList.contains('fixed-container')) {
    return
  }
  target.style.left = `${left}px`
  target.style.top = `${top}px`
  target.\_hasMoved = true
})

// 拖拽结束
container.moveable.on('dragEnd', (event) => {
  const { target } = event
  if (target.\_hasMoved) {
    target.\_hasMoved = false
    this.updateOriginalData('drag', target as HTMLDivElement)
  }
})
```

### 2.5 位置偏移量计算

位置偏移量的计算是实现精确拖拽的关键：

```typescript
// 记录拖拽开始时的位置
export const recordOffsetStart = (target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  target.$offsetStart = {
    left: rect.left,
    top: rect.top,
  };
};

// 计算拖拽的偏移量
export const getTargetOffset = (target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  const offsetStart = target.$offsetStart;
  return {
    left: rect.left - offsetStart.left,
    top: rect.top - offsetStart.top,
  };
};
```

### 2.6 根容器样式计算

根容器的高度根据内部元素自动调整：

```typescript
export const getAbsoluteRootStyle = (options: {
  targetClassName: string;
  rootClassName: string;
  fixedClassName: string;
}) => {
  const { targetClassName, rootClassName } = options;
  let rootHeight = 0;
  const root = document.querySelector<HTMLDivElement>(`${rootClassName}`);

  if (!root) return null;

  const allElements = document.querySelectorAll<HTMLDivElement>(
    `${targetClassName}`
  );

  let rootPaddingBottom = root.style.paddingBottom
    ? Number.parseFloat(root.style.paddingBottom)
    : 0;
  let rootPaddingTop = root.style.paddingTop
    ? Number.parseFloat(root.style.paddingTop)
    : 0;

  if (allElements.length > 0) {
    allElements.forEach((element) => {
      const { height } = element.getBoundingClientRect();
      const elementTop = element.style.top
        ? Number.parseFloat(element.style.top)
        : 0;
      if (elementTop + height > rootHeight) {
        rootHeight = Math.max(
          elementTop + height,
          document.documentElement.clientHeight -
            rootPaddingBottom -
            rootPaddingTop
        );
      }
    });
  }

  root.style.height = `${rootHeight}px`;

  return {
    height: rootHeight + "px",
  };
};
```

## 3 关键技术细节

### 3.1 选择器策略

Moveable 使用精细的 CSS 选择器策略来识别和操作元素：

- 使用:scope 选择器：限定查询范围
- 分层选择：根据元素层级关系精确查找目标元素
- 类名标识：通过类名区分不同功能的元素

### 3.2 性能优化

- 事件委托：减少事件监听器数量
- 防抖处理：对滚动事件进行防抖处理
- 按需初始化：只对可见元素初始化 Moveable 实例

```typescript
debouncedScrollEnd = \_debounce(this.handleScrollEnd, 100).bind(this)
```

### 3.3 组件通信机制

Moveable 通过回调函数向上传递交互事件：

```typescript
updateOriginalData(type: string, target: HTMLDivElement) {
  let result = { type }
  switch (type) {
    case 'resize':
    case 'drag':
      const targetStyle = getTargetStyle(target)
      const moveableTargetId = this.getTargetId(target)
      const offset = getTargetOffset(target)

      Object.assign(result, {
        targetId: moveableTargetId,
        offset,
        style: targetStyle,
        rootStyle: this.getRootStyle(),
      })
      break;
  }
  // 通过回调函数向上传递事件
  this.onUpdateCallback?.({
    ...result,
})
}
```

## 4 交互体验优化

### 4.1 对齐辅助线

Moveable 提供了丰富的对齐辅助线功能：

- 水平和垂直辅助线
- 元素对齐辅助线
- 吸附功能

```typescript
container.moveable = new Moveable(container, {
  // 其他配置...
  snappable: true, // 启用吸附
  elementGuidelines: targets, // 元素对齐辅助线
  horizontalGuidelines: [0, container.offsetHeight / 2, container.offsetHeight],
  verticalGuidelines: [0, container.offsetWidth / 2, container.offsetWidth],
  snapThreshold: 5, // 吸附阈值
});
```

### 4.2 尺寸显示

添加了 rpx 单位的显示，便于开发者了解实际尺寸：

```typescript
container.moveable.snapDistFormat = (v, type) => `${v * 2}rpx`;
```

## 总结

Moveable 模块通过对开源 Moveable 库的封装和扩展，结合 Studio 平台特性，实现了一个功能强大、易于集成的拖拽交互系统，为低代码平台提供了核心的可视化编辑能力。

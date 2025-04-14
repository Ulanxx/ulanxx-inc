# React Reconciler 原理

React Reconciler 是 React 的核心调和引擎，负责实现虚拟 DOM 的 diff 算法和更新机制。本文将深入探讨 Reconciler 的工作原理和实现细节。

## 1. Reconciler 概述

### 1.1 什么是 Reconciler

Reconciler 是 React 的核心模块之一，主要负责：

- 维护组件树的内部状态
- 计算状态变化后的最小更新操作
- 调度和执行更新

```jsx
// Reconciler 工作流程示例
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
// 当 setCount 被调用时：
// 1. 创建新的虚拟 DOM 树
// 2. Reconciler 对比新旧树的差异
// 3. 生成更新计划
// 4. 提交更新到渲染器
```

### 1.2 Reconciler 的演进

1. **Stack Reconciler (React 15)**

   - 同步递归处理虚拟 DOM 树
   - 一旦开始无法中断
   - 可能阻塞主线程

2. **Fiber Reconciler (React 16+)**
   - 异步可中断的更新处理
   - 更新任务的优先级管理
   - 更好的性能和用户体验

## 2. Fiber 架构

### 2.1 Fiber 节点结构

```typescript
interface Fiber {
  // 节点类型信息
  type: any;
  key: null | string;

  // 链接其他 Fiber 节点
  return: Fiber | null; // 父节点
  child: Fiber | null; // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟节点

  // 工作单元
  pendingProps: any;
  memoizedProps: any;
  memoizedState: any;

  // 副作用
  flags: Flags;
  subtreeFlags: Flags;
  updateQueue: UpdateQueue<any> | null;

  // 替代
  alternate: Fiber | null;
}
```

### 2.2 双缓冲技术

Fiber 使用双缓冲技术来构建和更新树：

```jsx
// 1. current 树：当前显示的树
// 2. workInProgress 树：正在构建的新树

function reconcile(current: Fiber | null, workInProgress: Fiber) {
  // 构建新的 workInProgress 树
  while (workInProgress !== null) {
    // 处理当前 fiber 节点
    workInProgress = performUnitOfWork(workInProgress);
  }

  // 完成后切换 current 指针
  root.current = workInProgress;
}
```

## 3. 调和过程

### 3.1 Diff 算法

React 的 diff 算法基于三个假设：

1. **同层比较**：不同层级的节点直接替换
2. **类型比较**：不同类型的节点重建整个子树
3. **Key 属性**：同级节点通过 key 进行复用

```jsx
// Diff 算法示例
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<any>
): Fiber | null {
  let oldFiber = currentFirstChild;
  let newFiber = null;

  // 第一轮：处理更新的节点
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (oldFiber && sameNode(oldFiber, newChild)) {
      // 更新现有节点
      newFiber = updateFiber(oldFiber, newChild);
    } else {
      break;
    }
    oldFiber = oldFiber.sibling;
  }

  // 第二轮：处理新增和删除的节点
  // ...

  return newFiber;
}
```

### 3.2 更新优先级

React 使用 lanes 模型来表示更新的优先级：

```typescript
type Lanes = number;
type Lane = number;

const SyncLane: Lane = 0b0001;
const InputContinuousLane: Lane = 0b0010;
const DefaultLane: Lane = 0b0100;
const IdleLane: Lane = 0b1000;

function schedulerUpdateOnFiber(fiber: Fiber, lane: Lane) {
  // 根据优先级调度更新
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  ensureRootIsScheduled(root);
}
```

## 4. 渲染阶段

### 4.1 Render 阶段

Render 阶段是可中断的，包含两个主要步骤：

1. **beginWork**：向下遍历，创建 Fiber 节点
2. **completeWork**：向上回溯，收集副作用

```jsx
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // 根据 fiber.tag 处理不同类型的节点
  switch (workInProgress.tag) {
    case FunctionComponent: {
      return updateFunctionComponent(/*...*/);
    }
    case ClassComponent: {
      return updateClassComponent(/*...*/);
    }
    case HostComponent: {
      return updateHostComponent(/*...*/);
    }
    // ...其他类型
  }
}
```

**Q: Fiber 是如何实现可中断的？**

- **答**：Fiber 通过在 render 阶段将工作分解成多个小任务（如 beginWork、completeWork），并在每个任务之间判断是否需要让出主线程来实现可中断的。

**Q: 如何判断是否需要让出主线程？**

- **答**：React 使用 `shouldYield` 函数来判断是否需要让出主线程，该函数会根据当前时间与 deadline 的比较来决定是否需要让出主线程。开始时间和 deadline 是在调度器中设置的，一般是 5ms。

**Q: 调度器如何管理不同优先级的任务？**

- **答**：调度器通过 lanes 模型来管理不同优先级的任务，每个任务都有一个优先级（lane），React 会根据优先级来调度任务的执行顺序。

**Q: 调度器如何处理高优先级任务？**

- **答**：调度器在处理高优先级任务时，会立即执行任务，不进行中断。高优先级任务包括用户交互（如点击、输入）等。

**Q: 调度器如何处理低优先级任务？**

- **答**：调度器在处理低优先级任务时，会进行中断。低优先级任务包括周期性更新（如动画）等。

**Q: Render 阶段主要做了什么？**

- **答**：Render 阶段主要做了两件事：
  1. **beginWork**：向下遍历，创建 Fiber 节点
  2. **completeWork**：向上回溯，收集副作用

### 4.2 Commit 阶段

Commit 阶段是同步且不可中断的，分为三个子阶段：

1. **Before mutation**：DOM 变更前
2. **Mutation**：DOM 变更
3. **Layout**：DOM 变更后

```jsx
function commitRoot(root: FiberRoot) {
  // 1. Before mutation 阶段
  commitBeforeMutationEffects(root);

  // 2. Mutation 阶段
  commitMutationEffects(root);

  // 切换 current 树
  root.current = finishedWork;

  // 3. Layout 阶段
  commitLayoutEffects(root);
}
```

## 5. 并发特性

### 5.1 时间切片

React 使用时间切片来避免长时间占用主线程：

```typescript
const YIELD_INTERVAL = 5; // 5ms

function shouldYield(): boolean {
  const currentTime = getCurrentTime();
  if (currentTime >= deadline) {
    // 检查是否需要让出主线程
    return true;
  }
  return false;
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

### 5.2 优先级调度

React 使用调度器来管理不同优先级的任务：

```typescript
function ensureRootIsScheduled(root: FiberRoot) {
  const nextLanes = getNextLanes(root, NoLanes);

  // 根据优先级获取回调超时时间
  const timeout = getTimeout(nextLanes);

  // 调度新的更新
  scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

## 总结

React Reconciler 是 React 的核心引擎，通过 Fiber 架构实现了：

1. **增量渲染**：将渲染工作分解成小单元
2. **优先级调度**：处理不同优先级的更新
3. **并发更新**：支持可中断的更新处理
4. **双缓存**：提供更流畅的更新体验

这些特性使 React 能够提供出色的性能和用户体验，同时保持代码的可维护性。

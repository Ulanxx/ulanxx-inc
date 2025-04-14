# React Fiber 架构 - 面试指南

## 核心概念

### React15 vs React16 架构对比

🤔 **面试题：React15 和 React16 架构有什么区别？为什么要进行架构重构？**

✅ **答案：**

1. **架构层面的区别：**

   - React15：双层架构

     - Reconciler（协调器）—— 找出变化的组件
     - Renderer（渲染器）—— 渲染变化的组件

   - React16：三层架构
     - Scheduler（调度器）—— 调度任务优先级
     - Reconciler（协调器）—— 找出变化的组件
     - Renderer（渲染器）—— 渲染变化的组件

2. **重构原因：**

   - React15 的问题：递归更新，无法中断
   - React16 的改进：可中断的更新

   ```js
   // React15 的问题：递归更新，无法中断
   function RecursiveUpdate(fiber) {
     updateComponent(fiber);
     if (fiber.child) {
       RecursiveUpdate(fiber.child);
     }
   }

   // React16 的改进：可中断的更新
   function FiberUpdate(fiber) {
     while (fiber) {
       if (shouldYield()) {
         // 判断是否需要让出主线程
         return fiber; // 返回未完成的fiber节点
       }
       fiber = performUnitOfWork(fiber);
     }
   }
   ```

3. **React15 的主要问题：**
   - 递归更新，无法中断
   - 掉帧，导致页面卡顿
   - 无法调度任务优先级

🤔 **面试题：Scheduler（调度器）的作用是什么？**

✅ **答案：**

1. 调度任务优先级
2. 控制任务执行时机
3. 实现时间切片
4. 保证高优先级任务优先执行

````js
// 示例：Scheduler 如何区分优先级
const priorities = {
  ImmediatePriority: 1,  // 最高优先级，需要同步执行
  UserBlockingPriority: 2,  // 用户交互
  NormalPriority: 3,  // 普通优先级
  LowPriority: 4,  // 低优先级
  IdlePriority: 5,  // 空闲优先级
};

// 任务调度示例
scheduleCallback(UserBlockingPriority, () => {
  // 用户输入、动画等交互任务
});

## React Fiber 架构

在 React15 及以前，Reconciler 采用递归的方式创建虚拟 DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，React16 将递归的无法中断的更新重构为异步的可中断更新，由于曾经用于递归的虚拟 DOM 数据结构已经无法满足需要。于是，全新的 Fiber 架构应运而生。

### Fiber 包含三层含义：

[React 官方 reconcilers 解释](https://zh-hans.legacy.reactjs.org/docs/codebase-overview.html#reconcilers)

作为架构来说，之前 React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 stack Reconciler。React16 的 Reconciler 基于 Fiber 节点实现，被称为 Fiber Reconciler。

作为静态的数据结构来说，每个 Fiber 节点对应一个 React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息。

作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

### Fiber Reconciler

它的主要目标是：

- 能够把可中断的任务切片处理。
- 能够调整优先级，重置并复用任务。
- 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
- 能够在 render() 中返回多个元素。
- 更好地支持错误边界。

### Fiber 的结构

[Fiber Node 的属性定义](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)，虽然属性很多，但我们可以按三层含义将他们分类来看。

```js
class FiberNode {
  // 作为静态数据结构的属性，
  // 保存了组件相关的信息
  type: any; // React element
  key: null | string;
  elementType: any; // React element
  tag: WorkTag; // 节点类型
  stateNode: any; // DOM 节点

  // 用于连接其他Fiber节点形成Fiber树
  return: Fiber | null; // 父节点
  child: Fiber | null;  // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟节点
  index: number; // 兄弟节点的索引

  // 作为动态的工作单元的属性
  pendingProps: any; // 未来的props
  memoizedProps: any; // 本次更新的props
  memoizedState: any; // 本次更新的state
  updateQueue: UpdateQueue<any> | null; // 本次更新的队列

  // 副作用
  flags: Flags; // 副作用标识
  subtreeFlags: Flags; // 子树副作用标识
  deletions: Array<Fiber> | null; // 需要删除的fiber节点

  // 调度优先级相关
  lanes: Lanes; // 调度优先级
  childLanes: Lanes; // 子树调度优先级

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  alternate: Fiber | null;

  // 调试相关的信息
  actualDuration?: number; // 实际执行的时间
  actualStartTime?: number; // 实际开始的时间
  selfBaseDuration?: number; // 自身基准时间
  treeBaseDuration?: number; // 树基准时间
}
````

## Fiber 的生命周期

Fiber 节点的生命周期可以分为三个阶段：

- mounting: 挂载阶段
- updating: 更新阶段
- unmounting: 卸载阶段

### 挂载阶段

Fiber 节点在挂载阶段会执行以下操作：

1. 创建 DOM 节点
2. 将 DOM 节点插入到父 DOM 节点中
3. 设置 DOM 节点的属性
4. 返回 Fiber 节点

### 更新阶段

Fiber 节点在更新阶段会执行以下操作：

1. 更新 DOM 节点的属性
2. 返回 Fiber 节点

### 卸载阶段

Fiber 节点在卸载阶段会执行以下操作：

1. 移除 DOM 节点
2. 返回 Fiber 节点

## Fiber 的工作流程

### 双缓存与 Fiber 树

双缓存（double buffering）是一种优化策略，它在两个不同的渲染中重用 DOM 树。React 利用这一策略来完成 Fiber 树的构建与替换，从而实现 DOM 树的创建与更新。

在 React 中，我们可以将 Fiber 树分为两种：

1. current 树：当前屏幕上显示内容对应的 Fiber 树。
2. workInProgress 树：正在内存中构建的 Fiber 树。

这两棵树通过 alternate 属性相连。React 在 workInProgress 树上进行更新操作，完成后会将 workInProgress 树替换为 current 树，这个过程就是双缓存。

### Fiber 的工作流程

Fiber 的工作流程主要包含两个阶段：

1. 构建阶段（Render Phase）：

   - 创建 workInProgress 树
   - 对比 current 树和新的 React element，找出需要更新的部分
   - 为需要更新的 Fiber 节点打上标记

2. 提交阶段（Commit Phase）：
   - 将构建阶段的结果应用到 DOM 上
   - 调用生命周期方法和钩子函数
   - 将 workInProgress 树变为 current 树

这种分阶段的方式使得 React 能够实现可中断的渲染，提高应用的响应性和性能。

## 面试题

以下是针对 React Fiber 机制的 **10 个高频面试问题**，涵盖核心概念、设计原理和实际应用场景，帮助开发者快速掌握重点：

---

### **1. 什么是 Fiber？它的核心目标是什么？**

**思考方向**：从 React 旧架构的问题（性能瓶颈）出发，解释 Fiber 的诞生背景和核心目标。  
**参考答案**：  
Fiber 是 React 16 引入的新的协调算法和调度架构，核心目标是实现**增量渲染**和**优先级调度**，解决传统递归渲染不可中断导致的阻塞主线程问题，提升复杂应用的流畅性和用户体验。

---

### **2. Fiber 如何解决传统递归渲染的性能问题？**

**思考方向**：对比旧版 Stack Reconciler 与 Fiber 的区别。  
**参考答案**：

- **传统方式**：递归遍历组件树，一次性同步处理所有更新，无法中断，导致主线程长时间阻塞。
- **Fiber 方案**：将组件树转换为 Fiber 链表结构，拆分为可中断的“小任务”，利用浏览器的空闲时间分片执行（通过 `requestIdleCallback` 或调度器），避免阻塞主线程。

---

### **3. 什么是 Fiber 树？它的数据结构有什么特点？**

**思考方向**：Fiber 树的链表结构、节点属性和双缓冲机制。  
**参考答案**：  
Fiber 树是 React 内部表示组件树的数据结构，每个组件对应一个 Fiber 节点，包含以下关键字段：

- `child`、`sibling`、`return`：构成链式结构，支持可中断遍历。
- `alternate`：指向另一棵树的镜像节点，用于双缓冲（Current Tree 和 WorkInProgress Tree）。
- `effectTag`：标记副作用（如 DOM 操作）。
- `memoizedState`：保存组件状态（如 Hooks 链表）。

---

### **4. Fiber 的双缓冲机制是什么？有什么作用？**

**思考方向**：解释双缓冲如何减少内存分配和保证渲染连续性。  
**参考答案**：  
React 同时维护两棵 Fiber 树：

- **Current Tree**：当前屏幕上显示的树。
- **WorkInProgress Tree**：正在后台构建的新树。  
  通过 `alternate` 指针复用节点，完成构建后直接替换 Current Tree，避免界面闪烁并减少内存分配开销。

---

### **5. React 的渲染流程分为哪两个阶段？各自做了什么？**

**思考方向**：协调（Reconciliation）和提交（Commit）阶段的分工。  
**参考答案**：

1. **协调阶段**（可中断）：
   - 深度优先遍历 Fiber 树，对比新旧节点，标记变更（Diff 算法）。
   - 生成副作用链表（Effect List）。
2. **提交阶段**（不可中断）：
   - 遍历副作用链表，批量执行 DOM 操作和生命周期方法。
   - 切换 Current Tree 为新树，完成渲染。

---

### **6. Fiber 如何实现优先级调度？**

**思考方向**：任务优先级划分和中断机制。  
**参考答案**：  
React 将任务分为多个优先级（如：Immediate、UserBlocking、Normal、Low），通过调度器动态管理任务队列。高优先级任务（如用户输入）可以中断低优先级任务（如数据渲染），确保关键操作快速响应。

---

### **7. 什么是时间分片（Time Slicing）？如何实现？**

**思考方向**：增量渲染与浏览器空闲时间利用。  
**参考答案**：  
时间分片是将渲染任务拆分为多个小任务，在浏览器的空闲时间段执行（通过 `requestIdleCallback` 或 React 调度器），每帧预留时间给浏览器处理绘制和交互，避免长时间占用主线程。

---

### **8. Fiber 如何支持错误边界（Error Boundaries）？**

**思考方向**：错误捕获与局部渲染失败处理。  
**参考答案**：  
Fiber 的链表结构允许在任意节点捕获错误（通过 `componentDidCatch` 或 `static getDerivedStateFromError`），仅卸载出错的子树并显示备用 UI，而非崩溃整个应用。

---

### **9. Fiber 架构如何实现并发模式（Concurrent Mode）？**

**思考方向**：后台渲染与交互响应性的平衡。  
**参考答案**：

- 在 WorkInProgress Tree 中异步准备新 UI，不阻塞当前交互。
- 使用 `startTransition` 或 `useTransition` 标记低优先级更新，允许用户中断旧渲染并优先处理交互。

---

### **10. Fiber 对 React 开发者的实际影响是什么？**

**思考方向**：性能优化与新特性的支持。  
**参考答案**：

- **性能提升**：大数据量渲染更流畅（如虚拟列表）。
- **新功能支持**：Suspense 流式加载、服务端组件、并发渲染等。
- **优化手段**：可通过 `useDeferredValue` 或 `memo` 控制渲染优先级，减少不必要的更新。

---

### **总结技巧**

1. **理解核心矛盾**：Fiber 本质是为了解决同步渲染阻塞主线程的问题。
2. **关联特性**：将 Fiber 与 React 18 的并发特性（如 Transition、Suspense）结合理解。
3. **实际场景**：举例说明 Fiber 如何优化长列表渲染、高频交互等场景。
4. **对比旧版**：强调可中断、优先级调度和增量渲染的优势。

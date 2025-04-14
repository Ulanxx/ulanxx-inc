# React 的 Concurrent 模式

React 的 **Concurrent 模式** 是 React 18 引入的一项重要特性，旨在提升应用的响应性和用户体验。它通过 **可中断渲染** 和 **优先级调度** 实现了更高效的渲染机制。

---

### 一、Concurrent 模式的基础概念

#### 1. **什么是 Concurrent 模式？**

- **目标**：提升应用的响应性，避免长时间任务阻塞用户交互。
- **核心特性**：
  - **可中断渲染**：React 可以在渲染过程中中断并处理更高优先级的任务。
  - **优先级调度**：根据任务的紧急程度动态调整渲染顺序。

#### 2. **Concurrent 模式的优势**

- **更流畅的用户体验**：避免页面卡顿，提升交互响应速度。
- **更好的资源利用**：充分利用浏览器的空闲时间执行任务。
- **更智能的更新策略**：根据用户交互动态调整渲染优先级。

---

### 二、Concurrent 模式的底层原理

#### 1. **Fiber 架构**

- **Fiber 节点**：React 将组件树中的每个组件抽象为一个 Fiber 节点，包含组件的类型、Props、State 等信息。
- **链表结构**：Fiber 节点通过链表连接，React 可以按需遍历和更新节点。

#### 2. **可中断渲染**

- **时间切片（Time Slicing）**：  
  React 将渲染任务拆分为多个小任务，在每个时间片（通常 5ms）内执行部分任务，剩余时间交给浏览器处理用户交互。
- **中断与恢复**：  
  如果浏览器需要处理更高优先级的任务（如用户输入），React 会中断当前渲染，待空闲时再恢复。

#### 3. **优先级调度**

- **任务优先级**：  
  React 根据任务的紧急程度分配优先级（如用户交互 > 数据加载 > 动画）。
- **调度器（Scheduler）**：  
  React 使用调度器管理任务的执行顺序，确保高优先级任务优先执行。

#### 4. **双缓冲机制**

- **Current 树与 WorkInProgress 树**：  
  React 在更新时同时维护两棵 Fiber 树，一棵是当前显示的树（Current），另一棵是正在构建的树（WorkInProgress）。
- **无缝切换**：  
  当 WorkInProgress 树构建完成后，React 会将其切换为 Current 树，实现无缝更新。

---

### 三、Concurrent 模式的实现方式

#### 1. **启用 Concurrent 模式**

- 在 React 18 中，默认启用 Concurrent 模式。
- 使用 `createRoot` API 渲染应用：

  ```jsx
  import { createRoot } from "react-dom/client";

  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
  ```

#### 2. **使用并发特性**

- **startTransition**：  
  将非紧急任务标记为过渡任务，避免阻塞用户交互。

  ```jsx
  import { startTransition, useState } from "react";

  function App() {
    const [input, setInput] = useState("");
    const [list, setList] = useState([]);

    const handleInput = (e) => {
      setInput(e.target.value);
      startTransition(() => {
        setList(new Array(10000).fill(e.target.value));
      });
    };

    return (
      <div>
        <input value={input} onChange={handleInput} />
        {list.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  }
  ```

- **useDeferredValue**：  
  延迟更新某个值，避免阻塞高优先级任务。

  ```jsx
  import { useDeferredValue, useState } from "react";

  function App() {
    const [input, setInput] = useState("");
    const deferredInput = useDeferredValue(input);

    return (
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <List input={deferredInput} />
      </div>
    );
  }
  ```

- **Suspense**：  
  配合数据加载，实现更流畅的加载体验。

  ```jsx
  import { Suspense } from "react";

  function App() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    );
  }
  ```

---

### 四、Concurrent 模式的性能优化

#### 1. **减少不必要的渲染**

- 使用 `React.memo` 或 `useMemo` 缓存组件和计算结果。
- 使用 `useCallback` 缓存回调函数。

#### 2. **优化数据加载**

- 使用 `Suspense` 实现数据加载的优雅降级。
- 使用 `startTransition` 避免数据加载阻塞用户交互。

#### 3. **合理使用优先级**

- 将用户交互任务标记为高优先级，确保即时响应。
- 将数据加载和动画任务标记为低优先级，避免阻塞主线程。

---

### 五、常见面试问题与解答

#### 1. **Concurrent 模式解决了什么问题？**

- **答**：解决了长时间任务阻塞用户交互的问题，提升了应用的响应性和流畅度。

#### 2. **Fiber 架构如何支持 Concurrent 模式？**

- **答**：Fiber 架构通过链表结构和时间切片实现了可中断渲染，同时通过双缓冲机制实现了无缝更新。

#### 3. **startTransition 的作用是什么？**

- **答**：将非紧急任务标记为过渡任务，避免阻塞用户交互。

#### 4. **如何优化 Concurrent 模式下的性能？**

- **答**：减少不必要的渲染、优化数据加载、合理使用优先级。

---

### 六、总结

React 的 Concurrent 模式通过 **可中断渲染** 和 **优先级调度** 实现了更高效的渲染机制，显著提升了应用的响应性和用户体验。

# Hooks 原理

以下是关于 React Hooks 的 **设计优势、核心原理及高频面试题** 的深度解析，结合底层实现机制说明，助你彻底掌握该考点：

---

### 一、Hooks 的设计优势（回答思路：对比 Class 组件的痛点）

#### 1. **逻辑复用能力升级**

- **Class 组件问题**：  
  逻辑复用依赖 HOC（高阶组件）或 Render Props，导致 **嵌套地狱** 和 **Wrapper Hell**
- **Hooks 方案**：  
  通过自定义 Hook（如 `useRequest`）实现 **逻辑抽离与复用**，保持组件树扁平化

#### 2. **解决生命周期碎片化**

- **Class 组件问题**：  
  相关逻辑分散在 `componentDidMount`/`componentDidUpdate`/`componentWillUnmount` 中
- **Hooks 方案**：  
  用 `useEffect` **统一处理副作用**，通过依赖数组控制执行时机

#### 3. **this 绑定问题消失**

- **Class 组件问题**：  
  需要手动处理 `this` 指向（如 `bind` 或箭头函数），增加心智负担
- **函数组件优势**：  
  函数式组件没有 `this`，闭包环境自动捕获渲染时的状态

#### 4. **代码更简洁紧凑**

- **对比示例**：  
  Class 组件需要编写大量模板代码（如 `constructor`），Hooks 通过 `useState` 一行代码即可管理状态

#### 5. **TypeScript 支持友好**

- **Class 组件问题**：  
  `this.props`/`this.state` 需要显式声明类型
- **Hooks 优势**：  
  函数参数天然支持类型推导

---

### 二、Hooks 核心原理（高频追问点）

#### 1. **底层数据结构**

React 通过 **单向链表** 存储 Hooks 状态，每个 Hook 节点包含：

```typescript
type Hook = {
  memoizedState: any; // 当前状态值（如useState的value）
  baseState: any; // 基础状态（更新时的基准值）
  queue: UpdateQueue<any> | null; // 更新队列（存放setState动作）
  next: Hook | null; // 指向下一个Hook的指针
};
```

#### 2. **执行流程关键点**

- **渲染阶段**：  
  函数组件执行时，按声明顺序将 Hooks **依次挂载到链表**，通过 `currentRenderingFiber` 关联到当前 Fiber 节点
- **更新阶段**：  
  通过 `dispatcher`（如 `HooksDispatcherOnUpdate`）读取链表中的 Hook 节点

#### 3. **为什么必须保证调用顺序**

```jsx
// ❌ 错误示例：条件语句中使用Hook
if (condition) {
  const [value] = useState(1); // 破坏链表顺序一致性
}
```

- **根本原因**：  
  Hooks 依赖 **调用顺序与链表节点一一对应**，顺序变化会导致状态错乱

#### 4. **状态存储位置**

- Hooks 状态实际存储在 **Fiber 节点的 memoizedState 属性** 中
- 每个 Hook 通过 `currentRenderingFiber.memoizedState` 链表访问自身状态

---

### 三、高频原理面试题

#### 1. **为什么 useState 能保留状态？**

**答**：函数组件本身无状态，但 React 通过 **Fiber 架构** 在内存中维护组件树。每次渲染时，Hooks 从对应 Fiber 节点的链表中读取状态，更新时修改链表节点值并触发重渲染。

#### 2. **useEffect 如何模拟生命周期？**

**答**：

- `useEffect(() => {}, [])` → `componentDidMount`
- `useEffect(() => () => {}, [])` → `componentWillUnmount`
- `useEffect(() => {}, [deps])` → `componentDidUpdate`

#### 3. **Hooks 闭包陷阱如何产生？**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 始终输出0
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // ...
}
```

**答**：Effect 闭包捕获了**初始渲染时的 `count` 值**，依赖数组为空导致不会更新闭包。解决方案：使用 `setCount(c => c + 1)` 或添加依赖项。

#### 4. **自定义 Hook 的本质是什么？**

**答**：自定义 Hook 是 **逻辑聚合的语法糖**，本质上是一个函数，其内部可以调用其他 Hook，通过组合现有 Hook 实现复杂逻辑复用（如 `useFetch` = `useState` + `useEffect`）。

---

### 四、原理图示辅助记忆

#### Hooks 链表结构

```
Fiber Node
│
├─ memoizedState (Hooks链表头)
   │
   ├─ Hook1（useState）
   │  ├─ memoizedState: 0
   │  └─ next: → Hook2
   │
   └─ Hook2（useEffect）
      ├─ memoizedState: effect对象
      └─ next: null
```

#### 更新流程

```
1. 函数组件执行 → 2. 按顺序访问Hooks链表 → 3. 读取/更新状态 → 4. React调度渲染
```

**Q**：Hooks 的更新流程是什么？

**答**：

1. React 在渲染组件时，会顺序执行 Hooks 链表中的每个 Hook。
2. 在执行每个 Hook 时，React 会检查当前 Hook 的依赖项是否发生变化，如果变化了，React 会对当前 Hook 进行 **重新计算**，包括状态的更新和 Effect 的处理。
3. 如果当前 Hook 的依赖项没有变化，React 则跳过当前 Hook，继续执行下一个 Hook。

比如

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count]);
  // ...
}
```

当 `count` 发生变化时，React 会重新执行 `Counter` 组件，Hooks 链表中的每个 Hook 也会被重新执行。在执行 `useEffect` 时，React 会检查 `count` 是否发生变化，如果变化了，React 会重新执行 `useEffect`，包括状态的更新和 Effect 的处理。

---

### 五、终极面试题

**Q**：如果让你实现一个简易版的 `useState`，核心逻辑怎么写？  
**参考答案**：

```javascript
let hooks = [];
let currentHook = 0;

function useState(initial) {
  const index = currentHook++;
  if (hooks[index] === undefined) {
    hooks[index] = initial;
  }

  const setState = (newValue) => {
    hooks[index] = newValue;
    render(); // 触发重新渲染
  };

  return [hooks[index], setState];
}

// 组件渲染前重置指针
function render() {
  currentHook = 0;
  MyComponent();
}
```

**Q**：为什么需要 `useMemo` 和 `useCallback`？

**答**：

1. **性能优化**：避免不必要的重新计算
2. **依赖项管理**：确保依赖项一致
3. **避免重复创建**：避免创建不必要的函数
4. **避免重复渲染**：避免不必要的组件重新渲染

**Q**：`useMemo` 和 `useCallback` 的区别是什么？

**答**：

1. **`useMemo`**：用于缓存计算结果
2. **`useCallback`**：用于缓存函数引用

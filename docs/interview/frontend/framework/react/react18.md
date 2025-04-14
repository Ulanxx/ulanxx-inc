# React18 有哪些更新？

## 1. 新的 JSX 转换器

React18 引入了新的 JSX 转换器，称为 `jsx-runtime`。这个转换器是 React 18 中的默认转换器，用于处理 JSX 语法。

### 1.1 jsx-runtime

`jsx-runtime` 是 React 18 中的默认转换器，用于处理 JSX 语法。

#### 旧版转换方式

在 React 17 之前，JSX 会被编译成 `React.createElement` 调用：

```jsx
// 源代码
function App() {
  return <h1>Hello World</h1>;
}

// 编译后
function App() {
  return React.createElement("h1", null, "Hello World");
}
```

这就是为什么我们总是需要在文件顶部引入 `import React from 'react'`。

#### 新版转换方式

React 18 的 `jsx-runtime` 采用自动导入的方式：

```jsx
// 源代码
function App() {
  return <h1>Hello World</h1>;
}

// 编译后
import { jsx as _jsx } from "react/jsx-runtime";

function App() {
  return _jsx("h1", { children: "Hello World" });
}
```

主要区别：

1. **无需手动导入**：不再需要在每个文件中显式地 `import React from 'react'`
2. **更高性能**：新转换器生成的代码更少，运行时性能更好
3. **更好的开发体验**：减少了样板代码，简化了开发流程
4. **更小的包体积**：由于无需在每个文件中导入 React，最终打包体积会更小

## 2. 新的并发渲染模式

### 2.1 什么是并发渲染？

并发模式不是一个单独的功能，而是一个底层设计。它通过渲染可中断来修复阻塞渲染机制，帮助应用保持响应，并根据用户的设备性能和网速进行调整。在并发模式中，React 可以同时更新多个状态。**其主要区别在于将同步不可中断更新变成了异步可中断更新**。useDeferredValue 和 startTransition 用于标记非紧急更新。

并发渲染（Concurrent Rendering）是 React 18 引入的一个革命性特性。它允许 React 同时准备多个版本的 UI，具体特点如下：

1. **可中断的渲染**：

startTransition

```jsx
// 使用 startTransition 包裹低优先级更新
import { startTransition } from "react";

function handleChange(e) {
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
}
```

useDeferredValue

```jsx
import { useDeferredValue } from "react";

function MyComponent({ value }) {
  const deferredValue = useDeferredValue(value);

  return (
    <div>
      <p>原始值: {value}</p>
      <p>延迟值: {deferredValue}</p>
    </div>
  );
}
```

2. **优先级排序**：

- 高优先级：用户输入、点击、动画等
- 低优先级：数据获取、大列表渲染等

### 2.2 如何启用并发特性？

1. **使用 createRoot**：

```jsx
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

2. **新的并发特性 API**：

```jsx
// useTransition Hook
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  function handleClick() {
    startTransition(() => {
      setCount((c) => c + 1);
    });
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>点击</button>
      <SlowComponent count={count} />
    </div>
  );
}
```

### 2.3 并发模式的主要优势

1. **更好的用户体验**：

- 不会阻塞用户输入
- 可以立即响应用户交互
- 平滑的页面过渡

2. **性能优化**：

- 避免渲染卡顿
- 更智能的调度更新
- 可中断的渲染过程

3. **新的使用模式**：

- Suspense 组件的增强
- 自动批处理
- 服务端渲染改进

### 2.4 flushSync

并发模式是一个破坏性更新，这意味着它可能会破坏现有的代码。

`flushSync` 是 React 18 中的一个新 API，用于强制同步更新。

```jsx
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1);
  });
}
```

## 3. Suspense 组件的增强

### 3.1 基本概念

Suspense 允许您在等待组件加载时声明加载状态：

```jsx
import { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
```

### 3.2 React 18 中的新特性

1. **支持服务端渲染**：

```jsx
// 服务端支持
import { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <SomeComponent />
      <Suspense fallback={<PostsGlobalLoading />}>
        <Posts />
      </Suspense>
    </Suspense>
  );
}
```

2. **流式 SSR**：

```jsx
// 服务端
import { renderToPipeableStream } from "react-dom/server";

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ["/client.js"],
  onShellReady() {
    // 流式传输 HTML
    pipe(res);
  },
});
```

### 3.3 主要改进

1. **选择性注水（Selective Hydration）**：

- 允许页面部分交互
- 优先级注水
- 不阻塞用户交互

2. **并发特性集成**：

```jsx
function ProfilePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProfileDetails />
      <Suspense fallback={<PostsGlobalLoading />}>
        <Posts />
      </Suspense>
    </Suspense>
  );
}
```

3. **更好的加载状态处理**：

- 防止加载状态闪烁
- 智能的加载状态展示
- 可以设置延迟展示时间

```jsx
// 使用 startTransition 配合 Suspense
function App() {
  const [tab, setTab] = useState("about");

  return (
    <div>
      <TabButton
        onClick={() => {
          startTransition(() => {
            setTab("posts");
          });
        }}
      >
        Posts
      </TabButton>
      <Suspense fallback={<Spinner />}>
        {tab === "posts" ? <Posts /> : <About />}
      </Suspense>
    </div>
  );
}
```

### 3.4 使用场景

1. **数据获取**：

- 异步数据加载
- API 调用
- 大量数据处理

2. **代码分割**：

```jsx
const OtherComponent = lazy(() => import("./OtherComponent"));

function MyComponent() {
  return (
    <Suspense fallback={<Spinner />}>
      <OtherComponent />
    </Suspense>
  );
}
```

3. **图片加载**：

```jsx
function App() {
  return (
    <Suspense fallback={<ImagePlaceholder />}>
      <Image src="large-image.jpg" />
    </Suspense>
  );
}
```

## 4. 去掉了对 IE 浏览器的支持

React 18 去掉了对 IE 浏览器的支持，这意味着 React 18 不再支持 IE 浏览器。如果需要支持 IE 浏览器，可以使用 React 17。

## 5. useSyncExternalStore

### 5.1 基本概念

`useSyncExternalStore` 是 React 18 引入的一个新 Hook，主要用于订阅外部数据源，解决外部数据的并发读取问题。

### 5.1.1 useSyncExternalStore 各参数的意义

`useSyncExternalStore` 接受三个参数：

1. **subscribe**：订阅函数，用于订阅外部数据源的变化。当数据源发生变化时，调用传入的回调函数以通知 React 进行更新。
2. **getSnapshot**：获取当前值的函数，用于返回外部数据源的当前状态。React 会在渲染过程中调用此函数，以确保读取到一致的数据状态。
3. **getServerSnapshot**：服务端渲染时的初始值函数（可选），用于在服务端渲染时提供初始值。此函数在客户端渲染时不会被调用。

示例：

```jsx
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe, // 订阅函数
    () => navigator.onLine, // 获取当前值的函数
    () => true // 服务端渲染时的初始值（可选）
  );

  return isOnline;
}
```

### 5.2 主要特点

1. **解决数据撕裂问题**：
   数据撕裂是指在并发渲染过程中，组件读取到不一致的数据状态。具体来说，当组件在渲染时，数据源发生了变化，导致组件在同一次渲染中读取到了不同的状态值，从而引发潜在的错误和不一致的 UI 表现。React 18 引入的 `useSyncExternalStore` Hook 通过确保在渲染过程中读取到一致的数据状态，有效地解决了数据撕裂问题。

```jsx
// 自定义 store 示例
const store = {
  state: { count: 0 },
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  getSnapshot() {
    return this.state;
  },

  increment() {
    this.state = { count: this.state.count + 1 };
    this.listeners.forEach((listener) => listener());
  },
};

function Counter() {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store)
  );

  return <h1>Count: {state.count}</h1>;
}
```

1. **支持服务端渲染**：

```jsx
function TodoList() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
    todosStore.getServerSnapshot // 服务端渲染时使用
  );

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 5.3 适用场景

1. **集成第三方状态管理库**：

```jsx
// Redux 集成示例
function useSelector(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}
```

2. **浏览器 API 订阅**：

```jsx
function useWindowSize() {
  const size = useSyncExternalStore(
    // 订阅函数
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    // 获取当前值
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  );

  return size;
}
```

3. **WebSocket 实时数据**：

```jsx
function useWebSocket(url) {
  const data = useSyncExternalStore(
    callback => {
      const ws = new WebSocket(url);
      ws.onmessage = callback;
      return () => ws.close();
    },
    () => /* 获取最新数据 */,
    () => /* 服务端初始数据 */
  );

  return data;
}
```

### 5.4 注意事项

1. **性能考虑**：

- 确保 `getSnapshot` 返回一致的引用
- 避免在每次渲染时创建新的订阅函数

2. **调试建议**：

```jsx
// 添加调试信息
const state = useSyncExternalStore(
  (...args) => {
    console.log("Subscribe:", args);
    return store.subscribe(...args);
  },
  () => {
    console.log("Get snapshot");
    return store.getSnapshot();
  }
);
```

3. **错误处理**：

```jsx
function useExternalStore(store) {
  const state = useSyncExternalStore(store.subscribe, () => {
    try {
      return store.getSnapshot();
    } catch (error) {
      console.error("Failed to get snapshot:", error);
      return null;
    }
  });

  return state;
}
```

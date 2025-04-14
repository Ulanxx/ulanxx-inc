# React 严格模式（Strict Mode）

## 1. 概述

严格模式是 React 的一个开发工具，用于突出显示应用程序中潜在的问题。它通过故意进行双重渲染来帮助发现副作用。

```jsx
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Component />
    </StrictMode>
  );
}
```

## 2. 主要检查项

### 2.1 组件双重渲染

在开发模式下，严格模式会对每个组件进行两次渲染：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 在严格模式下，这个 console.log 会打印两次
  console.log("render");

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2.2 检测意外的副作用

```jsx
function Example() {
  const [count, setCount] = useState(0);

  // ❌ 不好的做法：直接在组件中进行副作用操作
  document.title = `Count: ${count}`;

  // ✅ 好的做法：使用 useEffect 管理副作用
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <div>{count}</div>;
}
```

### 2.3 检测过时的 API 使用

```jsx
// ❌ 过时的 API
componentWillMount() {
  // 这将触发警告
}

// ✅ 推荐的替代方案
componentDidMount() {
  // 这是安全的
}
```

## 3. 严格模式的特性

1. **自动检测副作用**：

   - 双重调用 constructor
   - 双重调用 render 方法
   - 双重调用 useState 的初始化函数

2. **识别不安全的生命周期**：

   - 标记废弃的生命周期方法
   - 提供迁移建议

3. **检查旧的 Context API**：

   - 警告使用过时的 context API
   - 建议使用新的 Context API

4. **确保可重用的状态**：

```jsx
function App() {
  // 在严格模式下，初始化函数会被调用两次
  const [state] = useState(() => {
    // 应该保持幂等性
    return expensiveComputation();
  });

  return <div>{state}</div>;
}
```

## 4. 最佳实践

1. **在开发环境中启用**：

```jsx
if (process.env.NODE_ENV === "development") {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  root.render(<App />);
}
```

2. **处理副作用**：

```jsx
function UserProfile() {
  useEffect(() => {
    // ✅ 在 useEffect 中处理副作用
    const subscription = api.subscribe();

    return () => {
      // 清理副作用
      subscription.unsubscribe();
    };
  }, []);

  return <div>User Profile</div>;
}
```

3. **避免副作用依赖**：

```jsx
// ❌ 不好的做法
function Component() {
  const [data, setData] = useState();

  data.someMethod(); // 直接访问可能为 undefined 的数据

  // ✅ 好的做法
  useEffect(() => {
    if (data) {
      data.someMethod();
    }
  }, [data]);
}
```

## 5. React Native 中的严格模式

### 5.1 基本支持

React Native 完全支持严格模式，使用方式与 React Web 相同：

```jsx
import { StrictMode } from "react";

export default function App() {
  return (
    <StrictMode>
      <RootComponent />
    </StrictMode>
  );
}
```

### 5.2 特殊注意事项

1. **原生模块交互**：

```jsx
function NativeComponent() {
  useEffect(() => {
    // ✅ 原生模块的调用应该放在 useEffect 中
    NativeModules.SomeModule.doSomething();

    return () => {
      // 清理原生模块的资源
      NativeModules.SomeModule.cleanup();
    };
  }, []);

  // ❌ 不要在组件主体中直接调用原生模块
  // NativeModules.SomeModule.doSomething();
}
```

2. **动画处理**：

```jsx
function AnimatedComponent() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✅ 在 useEffect 中启动动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text>Fade In</Text>
    </Animated.View>
  );
}
```

### 5.3 性能考虑

由于 React Native 运行在移动设备上，需要特别注意严格模式带来的双重渲染：

```jsx
function ExpensiveComponent() {
  // ✅ 使用 useMemo 缓存计算结果
  const expensiveValue = useMemo(() => {
    return heavyComputation();
  }, []);

  // ❌ 避免在每次渲染时进行昂贵计算
  // const expensiveValue = heavyComputation();

  return <Text>{expensiveValue}</Text>;
}
```

### 5.4 调试建议

```jsx
function DebugComponent() {
  useEffect(() => {
    // 使用 React Native 的专用调试工具
    if (__DEV__) {
      console.log("Component mounted");
    }

    return () => {
      if (__DEV__) {
        console.log("Component will unmount");
      }
    };
  }, []);
}
```

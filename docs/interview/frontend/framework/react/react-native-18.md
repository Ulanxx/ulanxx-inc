# React Native 中使用 React 18

## 1. 基本配置

### 1.1 版本要求

要在 React Native 中使用 React 18 的特性，需要：

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.69.0" // 最低支持 React 18 的版本
  }
}
```

### 1.2 启用新的 Root API

```jsx
// index.js
import { AppRegistry } from "react-native";
import App from "./App";

// React Native 自动使用新的 root API
AppRegistry.registerComponent("AppName", () => App);
```

## 2. 主要特性支持

### 2.1 并发特性

1. **useTransition**：

```jsx
import { useTransition, useState } from "react";
import { View, Text, Pressable } from "react-native";

function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  return (
    <View>
      <Pressable
        onPress={() => {
          startTransition(() => {
            setCount((c) => c + 1);
          });
        }}
      >
        <Text>更新 ({isPending ? "加载中..." : count})</Text>
      </Pressable>
    </View>
  );
}
```

2. **useDeferredValue**：

```jsx
import { useDeferredValue } from "react";
import { TextInput, FlatList } from "react-native";

function SearchList({ query }) {
  const deferredQuery = useDeferredValue(query);

  return (
    <FlatList
      data={filterList(deferredQuery)}
      renderItem={({ item }) => <ListItem item={item} />}
    />
  );
}
```

### 2.2 Suspense 支持

```jsx
import { Suspense } from "react";
import { View, ActivityIndicator } from "react-native";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2.3 自动批处理

```jsx
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handlePress = () => {
    // React 18 会自动批处理这些更新
    setCount((c) => c + 1);
    setFlag((f) => !f);
  };

  return (
    <Pressable onPress={handlePress}>
      <Text>更新</Text>
    </Pressable>
  );
}
```

## 3. 性能优化

### 3.1 使用 memo 和 useMemo

```jsx
import { memo, useMemo } from "react";
import { View, Text } from "react-native";

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return (
    <View>
      <Text>{processedData}</Text>
    </View>
  );
});
```

### 3.2 异步渲染优化

```jsx
function LargeList({ items }) {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      // 大量数据更新
      refreshItems();
    });
  };

  return (
    <View>
      {isPending && <ActivityIndicator />}
      <FlatList
        data={items}
        renderItem={({ item }) => <ListItem item={item} />}
        onRefresh={handleRefresh}
      />
    </View>
  );
}
```

## 4. 注意事项

### 4.1 平台特定的限制

```jsx
// 某些 React 18 特性可能在不同平台上有不同表现
function PlatformSpecific() {
  useEffect(() => {
    if (Platform.OS === "android") {
      // Android 特定逻辑
    } else if (Platform.OS === "ios") {
      // iOS 特定逻辑
    }
  }, []);
}
```

### 4.2 性能监控

```jsx
import { PerformanceObserver } from "react-native";

function MonitorPerformance() {
  useEffect(() => {
    if (__DEV__) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log(`${entry.name}: ${entry.duration}ms`);
        });
      });

      observer.observe({ entryTypes: ["measure"] });

      return () => observer.disconnect();
    }
  }, []);
}
```

### 4.3 调试模式

```jsx
if (__DEV__) {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

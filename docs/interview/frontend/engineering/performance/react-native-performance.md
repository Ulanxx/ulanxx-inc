# React Native 性能优化

### 一、渲染性能优化

#### 1. **减少 Re-Render**

- **使用 `React.memo`**：  
  避免函数组件不必要的重新渲染。
  ```javascript
  const MyComponent = React.memo(({ data }) => {
    return <Text>{data}</Text>;
  });
  ```
- **使用 `PureComponent`**：  
  类组件中使用 `PureComponent` 替代 `Component`，自动实现浅比较。
  ```javascript
  class MyComponent extends React.PureComponent {
    render() {
      return <Text>{this.props.data}</Text>;
    }
  }
  ```

#### 2. **优化列表渲染**

- **使用 `FlatList` 或 `SectionList`**：  
  替代 `ScrollView`，实现列表项的高效渲染。
  ```javascript
  <FlatList
    data={data}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    keyExtractor={(item) => item.id}
  />
  ```
- **优化 `renderItem`**：  
  避免在 `renderItem` 中定义匿名函数或复杂逻辑。
  ```javascript
  const renderItem = ({ item }) => <Text>{item.title}</Text>;
  <FlatList data={data} renderItem={renderItem} />;
  ```

#### 3. **避免复杂 UI 嵌套**

- **减少视图层级**：  
  避免过深的视图嵌套，使用 `View` 替代不必要的 `ScrollView`。
- **使用 `Fragment`**：  
  减少不必要的容器组件。
  ```javascript
  <>
    <Text>Hello</Text>
    <Text>World</Text>
  </>
  ```

---

### 二、内存与资源管理

#### 1. **图片优化**

- **使用合适的分辨率**：  
  根据设备分辨率加载不同尺寸的图片。
  ```javascript
  const imageUrl = isHighDensity ? "image@2x.png" : "image.png";
  ```
- **使用缓存**：  
  使用 `react-native-fast-image` 缓存图片。
  ```javascript
  import FastImage from "react-native-fast-image";
  <FastImage source={{ uri: "https://example.com/image.png" }} />;
  ```

#### 2. **避免内存泄漏**

- **清理定时器与监听器**：  
  在组件卸载时清理定时器和事件监听器。
  ```javascript
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    return () => clearInterval(timer);
  }, []);
  ```

#### 3. **优化动画性能**

- **使用 `useNativeDriver`**：  
  将动画逻辑转移到原生线程执行。
  ```javascript
  Animated.timing(this.state.animatedValue, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
  ```

---

### 三、网络请求优化

#### 1. **减少请求数量**

- **合并请求**：  
  将多个接口合并为一个，减少网络开销。
- **使用缓存**：  
  缓存接口数据，避免重复请求。
  ```javascript
  const cachedData = await AsyncStorage.getItem("cachedData");
  if (!cachedData) {
    const data = await fetchData();
    await AsyncStorage.setItem("cachedData", JSON.stringify(data));
  }
  ```

#### 2. **优化请求时机**

- **延迟加载**：  
  在用户交互时再发起请求（如点击按钮）。
- **预加载**：  
  提前加载下一页数据，提升用户体验。

---

### 四、工具与调试

#### 1. **性能监控**

- **使用 Flipper**：  
  监控 React Native 应用的性能指标（如 FPS、内存占用）。
- **使用 `Performance` API**：  
  测量关键代码的执行时间。
  ```javascript
  const start = performance.now();
  // 执行代码
  const end = performance.now();
  console.log(`耗时：${end - start}ms`);
  ```

#### 2. **代码拆分与懒加载**

- **动态加载组件**：  
  使用 `React.lazy` 和 `Suspense` 实现组件懒加载。
  ```javascript
  const LazyComponent = React.lazy(() => import("./LazyComponent"));
  <Suspense fallback={<Text>Loading...</Text>}>
    <LazyComponent />
  </Suspense>;
  ```

#### 3. **减少 Bridge 通信**

- **批量更新状态**：  
  避免频繁调用 `setState`，减少 JavaScript 与原生层的通信。
- **使用原生模块**：  
  将复杂逻辑封装为原生模块，减少 Bridge 开销。

---

### 五、平台特有优化

#### 1. **Android 优化**

- **开启 Hermes 引擎**：  
  在 `android/app/build.gradle` 中启用 Hermes。
  ```
  project.ext.react = [
    enableHermes: true,
  ]
  ```
- **优化启动时间**：  
  使用 `SplashScreen` 避免白屏。

#### 2. **iOS 优化**

- **使用 WKWebView**：  
  替代 `UIWebView`，提升 WebView 性能。
- **优化图片加载**：  
  使用 `SDWebImage` 缓存图片。

---

### 六、性能优化示例

以下是一个完整的性能优化示例：

```javascript
import React, { useState, useEffect, useMemo } from "react";
import { FlatList, Text, View, Animated } from "react-native";
import FastImage from "react-native-fast-image";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    fetchData();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchData = async () => {
    const cachedData = await AsyncStorage.getItem("cachedData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    } else {
      const response = await fetch("https://example.com/data");
      const result = await response.json();
      await AsyncStorage.setItem("cachedData", JSON.stringify(result));
      setData(result);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <FastImage source={{ uri: item.image }} />
      <Text>{item.title}</Text>
    </View>
  );

  const memoizedData = useMemo(() => data, [data]);

  return (
    <FlatList
      data={memoizedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default React.memo(MyComponent);
```

---

### 七、总结

React Native 性能优化的核心思路包括：

1. **减少 Re-Render**：使用 `React.memo` 和 `PureComponent`
2. **优化列表渲染**：使用 `FlatList` 和 `SectionList`
3. **管理内存与资源**：优化图片加载，避免内存泄漏
4. **优化网络请求**：减少请求数量，使用缓存
5. **使用工具监控性能**：Flipper、Performance API
6. **平台特有优化**：Android 启用 Hermes，iOS 使用 WKWebView

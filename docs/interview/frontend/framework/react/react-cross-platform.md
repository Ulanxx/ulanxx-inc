# React 跨端原理

React Native（RN）和 React Native Web（RNW）都是基于 **React** 的跨端 UI 解决方案，它们的核心思想是 **声明式 UI** 和 **桥接不同平台的渲染逻辑**。下面分别讲解它们的原理。

---

# **1. React Native（RN）原理**

### **React Native 是如何运行的？**

RN 主要由三个线程组成：

1. **JS 线程**：运行 React 代码，处理组件逻辑、状态管理等。
2. **Native UI 线程**：负责渲染原生 UI（iOS/Android）。
3. **Bridge（桥接）**：JS 线程和 Native 线程之间的通信通道。

### **核心流程**

1. **JS 线程** 运行 React 代码，构建 Virtual DOM（VDOM）。
2. **JS 线程** 通过 Bridge 发送指令（JSON 数据）到 Native 线程。
3. **Native 线程** 解析指令，调用对应的 **iOS/Android 原生组件** 进行 UI 渲染。
4. **用户交互事件** 传回 JS 线程，触发 React 组件的 `setState` 重新渲染。

📌 **示例**

```tsx
import { View, Text, Button } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Hello React Native!</Text>
      <Button title="Click Me" onPress={() => alert("Clicked!")} />
    </View>
  );
}
```

📌 **渲染逻辑**

- `View` → 映射到 `UIView（iOS）` 或 `AndroidView（Android）`
- `Text` → 映射到 `UILabel（iOS）` 或 `TextView（Android）`
- `Button` → 映射到 `UIButton（iOS）` 或 `AndroidButton（Android）`

### **React Native 优势**

✅ **可复用 React 生态**，但 UI 组件基于原生实现。  
✅ **性能接近原生**（比 WebView 方案快）。  
✅ **支持 iOS/Android 端共享代码**。

### **React Native 缺点**

❌ **Bridge 可能导致性能瓶颈**（通信延迟）。  
❌ **部分原生 API 需要手动封装**（如摄像头、蓝牙）。

---

# **2. React Native Web（RNW）原理**

### **RNW 解决了什么问题？**

RN 只能运行在 iOS/Android 端，**不能直接运行在 Web 端**。  
RNW 的目标是 **让 React Native 代码在 Web 端复用**，**不依赖 WebView**。

### **React Native Web 是如何工作的？**

1. **使用相同的 React 组件（View、Text、Button）**，但映射成 Web 的 HTML 标签。
2. **在 Web 端转换 RN 组件**：
   - `View` → `<div>`
   - `Text` → `<span>` 或 `<p>`
   - `Button` → `<button>`
3. **在 Web 端使用 CSS-in-JS**（类似 `StyleSheet.create`）。
4. **保持 React Native 事件系统**（`onPress` 转换为 `onClick`）。

📌 **示例**

```tsx
import { View, Text, Button } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Hello React Native Web!</Text>
      <Button title="Click Me" onPress={() => alert("Clicked!")} />
    </View>
  );
}
```

**RNW 转换后，相当于：**

```tsx
import React from "react";

export default function App() {
  return (
    <div>
      <span>Hello React Native Web!</span>
      <button onClick={() => alert("Clicked!")}>Click Me</button>
    </div>
  );
}
```

### **React Native Web 组件映射**

| React Native 组件    | Web 对应组件                 |
| -------------------- | ---------------------------- |
| `<View>`             | `<div>`                      |
| `<Text>`             | `<span>` or `<p>`            |
| `<Button>`           | `<button>`                   |
| `<Image>`            | `<img>`                      |
| `<ScrollView>`       | `<div>` + `overflow: scroll` |
| `<TouchableOpacity>` | `<button>` + `opacity: 0.8`  |

### **React Native Web 优势**

✅ **Web 和 RN 共享代码**，降低开发成本。  
✅ **比 WebView 方案更高效**（不依赖 iframe）。  
✅ **支持 SSR（Next.js）**，SEO 友好。

### **React Native Web 缺点**

❌ **部分 RN 组件不适用于 Web**（如 `TouchableWithoutFeedback`）。  
❌ **样式转换可能导致 CSS 兼容性问题**。

---

# **3. React Native 和 RNW 的对比**

| 对比项   | React Native               | React Native Web             |
| -------- | -------------------------- | ---------------------------- |
| 运行环境 | iOS/Android                | Web 浏览器                   |
| UI 组件  | 原生 UI（UIView/TextView） | HTML（div/span/button）      |
| 性能     | 近似原生                   | 受限于浏览器渲染             |
| 代码复用 | RN 代码可直接运行          | 需要 `react-native-web` 适配 |
| 样式     | Flexbox + RN StyleSheet    | CSS-in-JS                    |

---

# **4. 什么时候用 React Native Web？**

✅ **如果你的项目已经使用 RN，并想同时支持 Web**，RNW 是一个不错的选择。  
✅ **如果你的 Web 项目想兼容移动端**，可以考虑 RNW。  
❌ **如果你主要做 Web 开发，没有 iOS/Android 需求，直接用 React 即可。**

---

# **5. React Native Web 项目实战**

### **如何在 Next.js 中使用 React Native Web？**

```bash
npx create-next-app my-app
cd my-app
npm install react-native-web react-native-svg
```

### **配置 Web 适配**

修改 `next.config.js`：

```js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    return config;
  },
};
```

### **写 React Native 代码**

```tsx
import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View>
      <Text>Hello, React Native Web!</Text>
      <Button title="Click Me" onPress={() => alert("Clicked!")} />
    </View>
  );
}
```

📌 **在 Web 端，React Native 代码会被转换成：**

```tsx
<div>
  <span>Hello, React Native Web!</span>
  <button onClick={() => alert("Clicked!")}>Click Me</button>
</div>
```

---

# **6. 总结**

| 方案                 | 适用端        | 适用场景                    |
| -------------------- | ------------- | --------------------------- |
| **React Native**     | iOS / Android | 需要高性能原生 App          |
| **React Native Web** | Web + RN      | 代码复用，H5 + App 一起开发 |
| **纯 React**         | Web           | 传统 Web 开发               |

如果你的项目涉及 **Web + App**，推荐 **React Native Web**。  
如果你的项目主要是 **App**，直接用 **React Native**。

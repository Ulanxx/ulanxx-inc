# 前端监控

## **基础概念**

### **1. 什么是前端监控？它主要包含哪些类别？**

✅ **考察点**：对前端监控的整体认知。

✅ **示例回答**：
前端监控是**监测前端应用的运行情况**，帮助开发者**发现和修复问题**，主要包含：

1. **错误监控**：JS 错误、Promise 错误、资源加载失败（如 `img`、`script`）。
2. **性能监控**：页面加载速度、交互响应时间、白屏时间（TTFB、FCP、LCP）。
3. **行为监控（埋点）**：用户点击、表单提交、PV/UV 等。
4. **网络请求监控**：接口成功率、超时、错误率。
5. **用户体验监控**：卡顿、页面崩溃率、CLS、FID。

📌 **示例场景**：

> “我们可以使用前端监控系统（如 Sentry、Datadog）来监测 JS 错误，并结合 Performance API 监控用户体验。”

---

### **2. 如何捕获 JavaScript 运行时错误？**

✅ **考察点**：错误上报机制，是否熟悉 JS 错误处理。

✅ **示例回答**：
JS 运行时错误可通过以下方式捕获：

1. **`window.onerror` 监听全局错误**
   ```js
   window.onerror = function (message, source, lineno, colno, error) {
     console.log("捕获到错误：", message, source, lineno, colno, error);
   };
   ```
2. **监听 `unhandledrejection` 处理 Promise 异常**
   ```js
   window.addEventListener("unhandledrejection", (event) => {
     console.log("未捕获的 Promise 错误：", event.reason);
   });
   ```
3. **使用 try-catch 捕获同步代码错误**
   ```js
   try {
     throw new Error("测试错误");
   } catch (error) {
     console.log("捕获到错误：", error.message);
   }
   ```

📌 **最佳实践**：

> 结合 Sentry、LogRocket 等工具，将错误上报到服务器，进行错误统计分析。

---

## **埋点 & 行为监控**

### **3. 你对埋点的理解？常见埋点方式有哪些？**

✅ **考察点**：埋点的基本概念、应用场景。

✅ **示例回答**：
埋点是一种**用户行为数据收集方式**，用于分析用户操作、优化产品体验。

📌 **常见埋点方式**：

1. **手动埋点**：开发者在关键事件手动插入埋点代码。
   ```js
   document.querySelector("#btn").addEventListener("click", () => {
     report({ event: "button_click", label: "购买按钮" });
   });
   ```
2. **无埋点（全埋点）**：监听 DOM 事件，自动上报用户行为（如热图分析）。
   ```js
   document.addEventListener("click", (event) => {
     console.log("用户点击了", event.target);
   });
   ```
3. **可视化埋点**：在管理后台配置埋点，无需改代码（如 GrowingIO）。
4. **Hybrid/WebView 埋点**：前端与 App 交互，埋点数据从 H5 传递到 Native。

📌 **最佳实践**：

> “推荐结合埋点日志与 BI 分析，避免埋点代码污染业务代码。”

---

### **4. 如何设计前端埋点 SDK？**

✅ **考察点**：埋点 SDK 设计，是否有架构思维。

✅ **示例回答**：
一个完整的埋点 SDK 需要包含：

1. **事件采集**（点击、曝光、输入）
2. **数据格式**（统一数据结构，如 JSON）
3. **上报机制**（`beacon API`、`fetch`、`image`）
4. **数据存储**（本地缓存、批量上报）
5. **异常处理**（防止死循环、异常日志）

📌 **示例 SDK**

```js
class Tracker {
  constructor(url) {
    this.url = url;
  }
  report(data) {
    navigator.sendBeacon(this.url, JSON.stringify(data));
  }
  trackClick(element, eventName) {
    element.addEventListener("click", () =>
      this.report({ event: eventName, time: Date.now() })
    );
  }
}
```

> “一个好的埋点 SDK 应该**支持异步上报、批量存储、降级处理**，并且不影响页面性能。”

---

## **错误上报**

### **5. 如何上报前端错误？**

✅ **考察点**：错误上报的机制、方法。

✅ **示例回答**：
前端错误上报通常使用 **fetch、image、sendBeacon**：

1. **XHR/Fetch 上报**
   ```js
   fetch("/log/error", { method: "POST", body: JSON.stringify(error) });
   ```
2. **`navigator.sendBeacon`**（更可靠，适合页面关闭时）
   ```js
   navigator.sendBeacon("/log/error", JSON.stringify(error));
   ```
3. **利用 `img` 上报**
   ```js
   new Image().src = `/log/error.gif?msg=${encodeURIComponent(error)}`;
   ```

📌 **最佳实践**：

> “结合 Sentry，可视化监控错误日志，支持告警通知。”

---

## **性能监控**

### **6. 你如何监控前端页面性能？**

✅ **考察点**：是否了解 Performance API。

✅ **示例回答**：
前端性能监控可使用 Performance API：

1. **白屏时间（FP）**
   ```js
   console.log(
     performance.timing.responseStart - performance.timing.navigationStart
   );
   ```
2. **首屏渲染（FCP）**
   ```js
   new PerformanceObserver((entryList) => {
     console.log(
       entryList.getEntriesByName("first-contentful-paint")[0].startTime
     );
   }).observe({ type: "paint", buffered: true });
   ```
3. **TBT（阻塞时间）**
   ```js
   let tbt = performance
     .getEntriesByType("longtask")
     .reduce((sum, task) => sum + task.duration, 0);
   console.log("总阻塞时间：", tbt);
   ```

> “使用 WebVitals（LCP、FID、CLS）监控页面加载体验。”

---

### **7. 如何监测页面卡顿（FPS 掉帧）？**

✅ **考察点**：页面流畅度监测。

✅ **示例回答**：

1. **`requestAnimationFrame` 检测 FPS**
   ```js
   let lastTime = performance.now();
   function checkFPS() {
     let now = performance.now();
     let fps = 1000 / (now - lastTime);
     lastTime = now;
     requestAnimationFrame(checkFPS);
   }
   requestAnimationFrame(checkFPS);
   ```
2. **监听 `longtask`**
   ```js
   new PerformanceObserver((entryList) => {
     entryList
       .getEntries()
       .forEach((entry) => console.log("长任务", entry.duration));
   }).observe({ type: "longtask", buffered: true });
   ```

> “结合 `requestIdleCallback` 进行优化，避免主线程阻塞。”

---

### **8. 如何衡量用户体验（Web Vitals）？**

✅ **考察点**：Web Vitals 指标（LCP、FID、CLS）。

✅ **示例回答**：

- **LCP（最大内容渲染）**：衡量主内容加载时间
- **FID（交互延迟）**：首次交互响应时间
- **CLS（布局偏移）**：页面抖动程度

```js
import { getLCP, getFID, getCLS } from "web-vitals";
getLCP(console.log);
getFID(console.log);
getCLS(console.log);
```

# 前端性能优化

### 一、性能优化目标

1. **响应到绘制时间控制**：
   - 首次内容渲染时间（FCP）控制在 1.8 秒以内
   - 最大内容渲染时间（LCP）控制在 2.5 秒以内
2. **帧率控制**：
   - 确保页面动画和交互的帧率稳定在 60 FPS
3. **工具辅助**：
   - 使用 Google PageSpeed Insights 或 Lighthouse 生成性能报告
   - 根据优化建议针对性改进（如未使用的 JavaScript、图片格式、阻塞渲染的资源等）

---

### 二、请求前的优化

#### 1. **代码优化**

- **减少不必要的 re-render**：
  - 使用 `React.memo` 或 `PureComponent` 避免无效渲染
  - 使用 `useMemo` 和 `useCallback` 缓存计算结果和函数引用
- **组件懒加载**：
  ```javascript
  const LazyComponent = React.lazy(() => import("./LazyComponent"));
  ```
- **离屏渲染优化**：
  - 使用 Intersection Observer 实现图片懒加载
  ```javascript
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  images.forEach((img) => observer.observe(img));
  ```

#### 2. **资源体积优化**

- **打包优化**：
  - Tree Shaking：移除未使用的代码
  - Scope Hoisting：提升模块作用域，减少闭包
  - 代码压缩：使用 Terser 压缩 JavaScript
- **图片优化**：
  - 使用 WebP 格式替代 PNG/JPG
  - 使用 `image-webpack-loader` 压缩图片
- **CDN 加速**：
  - 将静态资源部署到 CDN，减少网络延迟

#### 3. **DNS 预解析**

```html
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

#### 4. **用户体验优化**

- **Loading 页与骨架屏**：
  - 在数据加载完成前展示骨架屏，提升用户感知
  ```html
  <div class="skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-content"></div>
  </div>
  ```

---

### 三、请求中的优化

#### 1. **HTML 解析优化**

- **减少 DOM 规模**：
  - 避免嵌套过深的 DOM 结构
  - 使用虚拟列表优化长列表渲染
- **关键资源预加载**：
  ```html
  <link rel="preload" href="critical.css" as="style" />
  <link rel="preload" href="main.js" as="script" />
  ```

#### 2. **脚本加载优化**

- **异步加载脚本**：
  - 使用 `defer` 或 `async` 避免阻塞渲染
  ```html
  <script src="main.js" defer></script>
  <script src="analytics.js" async></script>
  ```
- **下一页预加载**：
  ```html
  <link rel="prefetch" href="next-page.html" />
  ```

#### 3. **CSS 优化**

- **内联关键 CSS**：
  - 将首屏所需的关键 CSS 内联到 HTML 中
- **避免 CSS 阻塞渲染**：
  ```html
  <link
    rel="stylesheet"
    href="styles.css"
    media="print"
    onload="this.media='all'"
  />
  ```

---

### 四、请求后的优化

#### 1. **HTTP 缓存策略**

- **强缓存**：
  - 设置 `Cache-Control` 和 `Expires`
  ```http
  Cache-Control: public, max-age=31536000
  Expires: Wed, 21 Oct 2025 07:28:00 GMT
  ```
- **协商缓存**：
  - 使用 `ETag` 或 `Last-Modified`
  ```http
  ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
  Last-Modified: Wed, 21 Oct 2020 07:28:00 GMT
  ```

**强缓存和协商缓存的应用**

服务器端会给每个资源设置 `cache-control` 和 `expires` 字段，如果命中在有效期内，就不会像服务器发起资源请求，浏览器直接使用本地缓存，否则浏览器会携带资源的版本号 (Etag 或者 last-modified)像服务端询问资源是否可以使用，如果服务器检查没有变化，就返回 304，依然使用本地资源。

#### 2. **Service Worker 缓存**

- **实现离线缓存**：
  ```javascript
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("v1").then((cache) => {
        return cache.addAll(["/", "/index.html", "/styles.css"]);
      })
    );
  });
  ```

#### 3. **数据缓存**

- **本地存储**：
  - 使用 `localStorage` 或 `IndexedDB` 缓存数据
  ```javascript
  localStorage.setItem("key", JSON.stringify(data));
  const data = JSON.parse(localStorage.getItem("key"));
  ```

---

### 五、性能监控与持续优化

1. **性能指标监控**：
   - 使用 `Performance API` 获取 FCP、LCP 等指标
   ```javascript
   const observer = new PerformanceObserver((list) => {
     for (const entry of list.getEntries()) {
       console.log(entry.name, entry.startTime);
     }
   });
   observer.observe({ type: "paint", buffered: true });
   ```
2. **错误监控**：
   - 使用 `Sentry` 或 `Bugsnag` 捕获前端错误
3. **A/B 测试**：
   - 通过对比实验持续优化性能

---

### 高频考点解析

1. **请求前**：
   - 代码优化（减少 re-render、懒加载）
   - 资源优化（Tree Shaking、图片压缩）
2. **请求中**：
   - 解析优化（减少 DOM 规模、关键资源预加载）
   - 脚本优化（defer/async）
3. **请求后**：
   - 缓存策略（强缓存、协商缓存）
   - 数据缓存（Service Worker、localStorage）

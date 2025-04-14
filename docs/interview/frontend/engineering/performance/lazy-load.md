# 懒加载

### 一、懒加载的应用场景

1. **图片懒加载**：延迟加载首屏外的图片
2. **组件懒加载**：延迟加载非首屏的 React/Vue 组件
3. **数据懒加载**：延迟加载非关键数据（如分页数据）

---

### 二、图片懒加载

#### 1. **原生实现**

使用 `Intersection Observer` 监听图片是否进入视口，动态加载图片。

```html
<img data-src="image.jpg" alt="Lazy Image" class="lazyload" />
```

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll(".lazyload");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // 加载图片
        img.classList.remove("lazyload");
        observer.unobserve(img); // 停止监听
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
});
```

#### 2. **使用第三方库**

- 使用 `loading="lazy"`（原生支持，但兼容性有限）
  ```html
  <img src="image.jpg" alt="Lazy Image" loading="lazy" />
  ```
- 使用 `lozad.js` 等库
  ```javascript
  const observer = lozad(".lazyload");
  observer.observe();
  ```

---

### 三、组件懒加载

#### 1. **React 实现**

使用 `React.lazy` 和 `Suspense` 实现组件懒加载。

```javascript
import React, { Suspense } from "react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

#### 2. **Vue 实现**

使用 `defineAsyncComponent` 实现组件懒加载。

```javascript
import { defineAsyncComponent } from "vue";

const LazyComponent = defineAsyncComponent(() => import("./LazyComponent.vue"));

export default {
  components: {
    LazyComponent,
  },
};
```

---

### 四、数据懒加载

#### 1. **分页加载**

监听滚动事件，加载更多数据。

```javascript
window.addEventListener("scroll", () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreData(); // 加载更多数据
  }
});
```

#### 2. **虚拟列表**

使用 `react-window` 或 `vue-virtual-scroller` 实现长列表优化。

```javascript
import { FixedSizeList as List } from "react-window";

const Row = ({ index, style }) => <div style={style}>Row {index}</div>;

function App() {
  return (
    <List height={500} width={300} itemSize={50} itemCount={1000}>
      {Row}
    </List>
  );
}
```

---

### 五、懒加载的性能收益

1. **减少首屏资源加载量**：
   - 仅加载首屏可见内容，减少初始请求数量
2. **降低带宽消耗**：
   - 延迟加载非关键资源，节省用户流量
3. **提升用户体验**：
   - 加快首屏渲染速度，减少白屏时间

---

### 六、注意事项

1. **兼容性**：
   - `Intersection Observer` 不支持 IE，需使用 Polyfill
2. **占位符**：
   - 使用骨架屏或占位图避免布局抖动
3. **预加载关键资源**：
   - 确保首屏内容优先加载，避免影响用户体验

---

### 七、结合性能工具验证

1. **Lighthouse 检测**：
   - 检查未使用的 JavaScript 和图片
   - 查看首屏加载时间（FCP、LCP）
2. **Chrome DevTools**：
   - 使用 Network 面板分析资源加载顺序
   - 使用 Performance 面板检查渲染性能

---

### 示例项目

以下是一个完整的图片懒加载示例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lazy Loading Example</title>
    <style>
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <div>
      <img data-src="image1.jpg" alt="Image 1" class="lazyload" />
      <img data-src="image2.jpg" alt="Image 2" class="lazyload" />
      <img data-src="image3.jpg" alt="Image 3" class="lazyload" />
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const lazyImages = document.querySelectorAll(".lazyload");
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove("lazyload");
              observer.unobserve(img);
            }
          });
        });
        lazyImages.forEach((img) => observer.observe(img));
      });
    </script>
  </body>
</html>
```

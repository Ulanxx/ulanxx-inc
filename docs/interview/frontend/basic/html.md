# HTML

### 一、HTML5 新特性

1. **HTML5 新增的语义化标签有哪些？**  
   **答**：

- 结构标签：`<header>`、`<footer>`、`<nav>`、`<article>`、`<section>`
- 媒体标签：`<audio>`、`<video>`
- 图形标签：`<canvas>`、`<svg>`
- 表单控件：`<input type="date">`、`<input type="email">`

2. **如何理解 HTML 语义化？**  
   **答**：

- 使用合适的标签表达内容含义（如 `<nav>` 表示导航）
- 优点：
  - 提升可读性（开发者友好）
  - 利于 SEO（搜索引擎友好）
  - 增强可访问性（屏幕阅读器友好）

---

### 二、表单与输入

3. **如何实现一个文件上传功能？**

```html
<input type="file" accept="image/*" />
```

**追问**：如何限制文件大小？  
**答**：通过 JavaScript 监听`change`事件，检查`files[0].size`

4. **HTML5 表单验证有哪些方式？**

```html
<input type="email" required /> <input type="number" min="1" max="100" />
```

**追问**：如何自定义验证提示？  
**答**：使用 `setCustomValidity()` 方法

---

### 三、多媒体与图形

5. **如何在网页中嵌入视频？**

```html
<video controls width="600">
  <source src="video.mp4" type="video/mp4" />
  <source src="video.ogg" type="video/ogg" />
  您的浏览器不支持视频播放
</video>
```

6. **Canvas 与 SVG 的区别？**  
   **答**：

- Canvas：基于像素，适合游戏、图表
- SVG：基于矢量，适合图标、地图

---

### 四、SEO 与可访问性

7. **如何优化网页的 SEO？**  
   **答**：

- 使用语义化标签
- 添加 `<meta>` 描述和关键词
- 设置 `<title>` 标题
- 使用 `<img alt>` 描述图片内容

8. **如何提升网页的可访问性？**  
   **答**：

- 使用 `aria-*` 属性（如 `aria-label`）
- 为表单控件添加 `<label>`
- 确保键盘可操作（如 `tabindex`）

---

### 五、性能优化

9. **如何减少页面加载时间？**  
   **答**：

- 压缩 HTML/CSS/JS 文件
- 使用 `<link rel="preload">` 预加载关键资源
- 延迟加载非关键资源（如 `<img loading="lazy">`）

10. **如何实现图片懒加载？**

```html
<img data-src="image.jpg" alt="..." class="lazyload" />
<script>
  const images = document.querySelectorAll(".lazyload");
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
</script>
```

---

### 六、综合应用题

11. **如何实现一个响应式表格？**

```html
<div style="overflow-x: auto;">
  <table>
    <thead>
      ...
    </thead>
    <tbody>
      ...
    </tbody>
  </table>
</div>
```

12. **如何实现一个下拉菜单？**

```html
<details>
  <summary>菜单</summary>
  <ul>
    <li><a href="#">选项1</a></li>
    <li><a href="#">选项2</a></li>
  </ul>
</details>
```

13. **如何实现一个模态框？**

```html
<dialog open>
  <p>这是一个模态框</p>
  <button onclick="this.parentElement.close()">关闭</button>
</dialog>
```

14. **如何实现一个进度条？**

```html
<progress value="70" max="100"></progress>
```

15. **如何实现一个折叠面板？**

```html
<details>
  <summary>点击展开</summary>
  <p>这里是隐藏的内容</p>
</details>
```

---

### 高频考点解析

1. **语义化标签**：理解每个标签的适用场景（如 `<article>` 用于独立内容块）
2. **表单验证**：掌握原生验证规则及自定义验证方法
3. **SEO 优化**：熟悉 `<meta>` 标签的使用及页面结构优化技巧
4. **可访问性**：了解 ARIA 属性及键盘操作支持
5. **性能优化**：掌握懒加载、预加载等常见优化手段

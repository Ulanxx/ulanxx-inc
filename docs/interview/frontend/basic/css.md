# CSS

### 一、布局类（Flexbox/Grid/浮动）

1. **实现水平垂直居中**

```css
/* 方案1：Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方案2：Grid */
.container {
  display: grid;
  place-items: center;
}

/* 方案3：绝对定位 */
.container {
  position: relative;
}
.element {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

2. **Flexbox 实现两栏布局（左侧固定，右侧自适应）**

```css
.container {
  display: flex;
}
.left {
  width: 200px;
}
.right {
  flex-grow: 1;
}
```

3. **Grid 实现九宫格布局**

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
```

4. **清除浮动的方法**

```css
/* 方案1：伪元素 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 方案2：BFC */
.container {
  overflow: hidden;
}
```

---

### 二、盒模型与定位

5. **box-sizing 的作用**

```css
/* content-box（默认）：width仅包含内容 */
/* border-box：width包含内容+padding+border */
.box {
  box-sizing: border-box;
}
```

6. **BFC（块级格式化上下文）特性**

- 解决：浮动元素高度塌陷、外边距合并
- 触发条件：`overflow: hidden`、`display: inline-block` 等

7. **position 定位的区别**

- `static`：默认，不定位
- `relative`：相对自身定位
- `absolute`：相对最近非 static 祖先定位
- `fixed`：相对视口定位
- `sticky`：滚动时粘性定位

---

### 三、选择器与优先级

8. **CSS 优先级计算规则**

- `!important` > 内联样式 > ID 选择器 > 类/伪类 > 标签选择器
- 示例：`#id .class:hover` 的优先级值为 `0,1,2,1`

9. **伪类与伪元素的区别**

- 伪类：`:hover`、`:nth-child()`
- 伪元素：`::before`、`::after`

10. **属性选择器示例**

```css
/* 选择href以https开头的a标签 */
a[href^="https"] {
  color: green;
}
```

---

### 四、动画与过渡

11. **实现一个旋转动画**

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin 2s linear infinite;
}
```

12. **transition 与 animation 的区别**

- `transition`：需要触发条件（如 hover），适合简单过渡
- `animation`：自动执行，支持复杂动画序列

---

### 五、响应式设计

13. **媒体查询实现移动端适配**

```css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

14. **rem 布局原理**

- 设置根元素字体大小：`html { font-size: 16px; }`
- 使用 rem 单位：`width: 10rem; /* 160px */`

---

### 六、性能优化

15. **CSS 性能优化方法**

- 减少嵌套层级
- 避免使用通配符选择器
- 压缩 CSS 文件
- 使用 `will-change` 优化动画性能

16. **GPU 加速的实现**

```css
.element {
  transform: translateZ(0);
}
```

---

### 七、常见问题与解决方案

17. **1px 边框问题**

```css
.border {
  position: relative;
}
.border::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #000;
  transform: scaleY(0.5);
}
```

18. **文本溢出显示省略号**

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

19. **隐藏元素的几种方式**

- `display: none`：完全移除渲染树
- `visibility: hidden`：保留空间
- `opacity: 0`：透明但可交互

---

### 八、CSS3 新特性

20. **渐变背景实现**

```css
.gradient {
  background: linear-gradient(to right, red, blue);
}
```

21. **阴影效果**

```css
.shadow {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}
```

22. **滤镜效果**

```css
.filter {
  filter: blur(5px) grayscale(50%);
}
```

---

### 九、预处理器与模块化

23. **Sass 常用功能**

- 变量：`$color: red;`
- 嵌套：`.parent { .child {} }`
- 混合：`@mixin center { ... }`

24. **CSS Modules 的作用**

- 解决全局样式污染
- 示例：`import styles from './App.module.css';`

---

### 十、综合应用题

25. **实现一个三角形**

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

26. **实现一个模态框**

```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
```

27. **实现一个 sticky footer**

```css
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex-grow: 1;
}
.footer {
  flex-shrink: 0;
}
```

28. **实现一个瀑布流布局**

```css
.container {
  column-count: 3;
  column-gap: 10px;
}
.item {
  break-inside: avoid;
}
```

29. **实现一个斑马纹表格**

```css
tr:nth-child(odd) {
  background: #f2f2f2;
}
```

30. **实现一个响应式图片**

```html
<img src="image.jpg" srcset="image-2x.jpg 2x, image-3x.jpg 3x" alt="..." />
```

---

### 备考建议

1. 重点掌握 Flexbox/Grid 布局，面试出现频率极高
2. 熟悉 BFC/IFC 等布局概念，理解其应用场景
3. 准备 CSS 性能优化 的实际案例（如项目中的优化实践）
4. 练习 手写代码（如三角形、模态框等）

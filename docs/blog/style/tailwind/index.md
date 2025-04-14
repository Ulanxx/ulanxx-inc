# Tailwind CSS 快速上手指北

Tailwind CSS 是一个实用优先的 CSS 框架，让我们通过一个简单的示例快速入门。

## 1. 项目初始化与安装

首先创建一个新项目并安装必要依赖：

```bash
npm init vite
npm install
```

## 2. 安装 Tailwind CSS

```bash
npm install tailwindcss postcss autoprefixer
```

## 3. 配置 Tailwind CSS

在项目根目录下创建 `tailwind.config.js` 文件：

```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 4. 配置 PostCSS

在项目根目录下创建 `postcss.config.js` 文件：

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 5. 配置 Vite

在 `vite.config.js` 文件中添加 Tailwind CSS 配置：

```js
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

## 6. 创建样式文件

在 `src/index.css` 文件中添加以下内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 7. 运行项目

```bash
npm run dev
```

现在，你已经成功创建了一个使用 Tailwind CSS 的项目。

## 8. 基础使用示例

让我们通过一个简单的卡片组件来学习 Tailwind CSS 的基本用法：

```jsx
<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
        产品介绍
      </div>
      <h2 class="block mt-1 text-lg leading-tight font-medium text-black">
        iPhone 15 Pro Max
      </h2>
      <p class="mt-2 text-slate-500">
        搭载 A17 Pro 芯片，提供出色的性能和能效。
      </p>
    </div>
  </div>
</div>
```

## 9. 常用类名速查

### 布局类

- `container`: 响应式容器
- `flex`: 弹性布局
- `grid`: 网格布局
- `hidden/block`: 显示/隐藏

### 间距

- `p-{0-16}`: 内边距
- `m-{0-16}`: 外边距
- `space-x/y-{0-16}`: 子元素间距

### 尺寸

- `w-{size}`: 宽度（如：w-full, w-1/2）
- `h-{size}`: 高度
- `max-w-{size}`: 最大宽度

### 文字

- `text-{size}`: 字体大小（如：text-sm, text-lg）
- `font-{weight}`: 字重
- `text-{color}`: 文字颜色

## 10. 响应式设计

Tailwind 提供了简单的响应式前缀：

```jsx
<div class="w-full md:w-1/2 lg:w-1/3">
  <!--
    手机：宽度100%
    平板：宽度50%
    电脑：宽度33.33%
  -->
</div>
```

常用断点：

- `sm`: >= 640px
- `md`: >= 768px
- `lg`: >= 1024px
- `xl`: >= 1280px

## 11. 状态修饰符

```jsx
<button
  class="
  bg-blue-500 
  hover:bg-blue-700 
  active:bg-blue-800 
  focus:ring-2 
  focus:ring-blue-300
  text-white 
  font-bold 
  py-2 
  px-4 
  rounded
"
>
  点击按钮
</button>
```

常用状态：

- `hover:`: 鼠标悬停
- `focus:`: 获得焦点
- `active:`: 激活状态
- `disabled:`: 禁用状态

## 12. 暗色模式

```jsx
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  自动适应明暗模式的内容
</div>
```

## 13. 实用技巧

### 使用 @apply 抽取重复样式

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

### 自定义主题

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#FF0000",
        secondary: "#00FF00",
      },
      spacing: {
        128: "32rem",
      },
    },
  },
};
```

## 14. 常见问题

1. **样式没有生效**

   - 检查 content 配置是否正确
   - 确认类名拼写无误
   - 查看是否有样式冲突

2. **构建文件过大**

   - 配置 purge 选项
   - 使用 JIT 模式
   - 按需导入组件

3. **开发效率问题**
   - 使用 VSCode 插件
   - 创建常用组件库
   - 使用代码片段

现在你已经掌握了 Tailwind CSS 的基础用法，可以开始构建你的项目了！记住，实践是最好的学习方式。

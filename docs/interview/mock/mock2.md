### 第二套面试题

1. JavaScript 中的事件循环机制是怎样的？宏任务和微任务的执行顺序是什么？
2. 分析以下代码的输出顺序并解释原因

```js
console.log("script start");
setTimeout(() => {
  console.log("setTimeout");
}, 0);
Promise.resolve()
  .then(() => {
    console.log("promise1");
  })
  .then(() => {
    console.log("promise2");
  });
console.log("script end");
```

3. React Hooks 的设计初衷是什么？useEffect 的依赖项数组的作用是什么？

4. 浏览器存储方式有哪些？localStorage、sessionStorage、Cookie 的区别和使用场景是什么？
5. CSS 中的 BFC 是什么？它有哪些应用场景？如何创建 BFC？

- 答：BFC（Block Formatting Context）是 CSS 中的一种布局区域，它决定了元素的布局方式。BFC 的主要特点是：
  - 内容会从 BFC 的边界开始，不与外部元素重叠。
  - BFC 内部的元素会形成独立的布局区域，不与外部元素重叠。
  - 如何创建：
    - float 不为 none
    - overflow 不为 visible
    - display 为 flow-root
    - position 为 absolute 或 fixed

6. 前端模块化的发展历程是怎样的？CommonJS、AMD、ES Module 各有什么特点？

- CommonJS（主要用于 Node.js），AMD（主要用于浏览器），ES Module（ECMAScript 新标准），AMD 是异步加载，ES Module 是同步加载。

7. 如何实现一个防抖(debounce)和节流(throttle)函数？它们的应用场景有哪些？

- 防抖：在事件触发后的一段时间内，只执行一次回调函数。
- 节流：在事件触发的固定时间间隔内，只执行一次回调函数。

8. TypeScript 与 JavaScript 的主要区别是什么？TypeScript 的优势和局限性是什么？

9. 前端工程化中，如何进行代码质量控制？谈谈你对 ESLint、Prettier、单元测试的理解。

10. 虚拟 DOM 的工作原理是什么？它相比直接操作 DOM 有什么优势？

11. 如何设计一个大型 React 应用的目录结构？请从组件划分、状态管理、路由设计等方面考虑。
    答：首先将组件划分为基础组件、业务组件、页面组件，然后将状态管理划分为 reducer、action、store，最后将路由划分为路由配置、路由组件、路由守卫。
12. Web 安全有哪些常见问题？如何防范 XSS 和 CSRF 攻击？
    答：XSS：跨站脚本攻击，CSRF：跨站请求伪造。防范：XSS：使用 HTML 实体编码、内容安全策略(CSP)；CSRF：使用 CSRF token。
13. 请实现一个简单的防抖函数

```js
// 防抖用于停止后超过 delay 时间再执行，比如浏览器搜索
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// 节流用于固定时间间隔内只执行一次，比如防止按钮重复点击
function throttle(fn, delay) {
  let lastTime = 0;
  return function () {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, arguments);
      lastTime = now;
    }
  };
}
```

14. 前端工程化中，如何进行代码质量控制？谈谈你对 ESLint、Prettier、单元测试的理解。
15. 虚拟 DOM 的工作原理是什么？它相比直接操作 DOM 有什么优势？
16. 如何设计一个大型 React 应用的目录结构？请从组件划分、状态管理、路由设计等方面考虑。
17. Web 安全有哪些常见问题？如何防范 XSS 和 CSRF 攻击？

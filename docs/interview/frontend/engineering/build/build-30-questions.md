### 一、Vite（10 题）

1. **Vite 的核心优势是什么？**  
   **答**：基于浏览器原生 ES 模块，开发环境无需打包，启动速度快。

2. **Vite 如何实现快速热更新？**  
   **答**：利用浏览器缓存和 HTTP/2 多路复用，仅更新修改的模块。

3. **Vite 的生产环境构建基于什么工具？**  
   **答**：Rollup。

4. **如何配置 Vite 的多页面应用？**

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "about.html",
      },
    },
  },
};
```

5. **Vite 如何处理 CSS 模块？**  
   **答**：支持 `.module.css` 文件，自动生成局部作用域类名。

6. **Vite 插件机制与 Webpack 有何不同？**  
   **答**：Vite 插件基于 Rollup 插件体系，更轻量且兼容 Rollup 生态。

7. **如何实现 Vite 的按需加载？**  
   **答**：使用动态 `import()` 语法。

8. **Vite 如何支持 TypeScript？**  
   **答**：内置 `esbuild` 编译 TypeScript，无需额外配置。

9. **Vite 如何优化生产环境的构建性能？**  
   **答**：通过 `build.minify` 启用压缩，`build.chunkSizeWarningLimit` 控制 chunk 大小。

10. **Vite 如何处理静态资源？**  
    **答**：支持图片、字体等静态资源，可通过 `import` 引入。

---

### 二、esbuild（5 题）

11. **esbuild 的核心优势是什么？**  
    **答**：极快的构建速度，基于 Go 语言实现，并行处理任务。

12. **esbuild 支持哪些文件类型？**  
    **答**：JavaScript、TypeScript、JSX、CSS、JSON 等。

13. **esbuild 如何配置插件？**

```javascript
esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "dist/bundle.js",
  plugins: [myPlugin],
});
```

14. **esbuild 的局限性有哪些？**  
    **答**：不支持 HMR（热更新），生态插件较少。

15. **esbuild 如何与 Vite 结合使用？**  
    **答**：Vite 开发环境使用 esbuild 预构建依赖。

---

### 三、SWC（5 题）

16. **SWC 的核心优势是什么？**  
    **答**：基于 Rust 实现，编译速度极快，兼容 Babel 插件。

17. **SWC 支持哪些功能？**  
    **答**：TypeScript 编译、JSX 转换、代码压缩等。

18. **如何配置 SWC 编译 TypeScript？**

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript"
    }
  }
}
```

19. **SWC 与 Babel 的区别？**  
    **答**：SWC 性能更高，但生态插件较少。

20. **SWC 如何与 Webpack 结合使用？**  
    **答**：通过 `swc-loader` 替换 `babel-loader`。

---

### 四、Rollup（5 题）

21. **Rollup 的核心优势是什么？**  
    **答**：专注于 ES 模块打包，输出更小的 bundle。

22. **Rollup 如何处理 Tree Shaking？**  
    **答**：静态分析代码，移除未使用的导出。

23. **如何配置 Rollup 的多入口打包？**

```javascript
export default {
  input: ["src/index.js", "src/about.js"],
  output: {
    dir: "dist",
    format: "esm",
  },
};
```

24. **Rollup 插件的作用是什么？**  
    **答**：扩展 Rollup 功能，如处理 CSS、压缩代码等。

25. **Rollup 与 Webpack 的区别？**  
    **答**：Rollup 适合库开发，Webpack 适合应用开发。

---

### 五、Babel（5 题）

26. **Babel 的核心作用是什么？**  
    **答**：将新语法转换为兼容性更好的代码。

27. **如何配置 Babel 支持 TypeScript？**

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

28. **Babel 插件与预设的区别？**  
    **答**：插件实现单一功能，预设是一组插件的集合。

29. **Babel 如何处理 Polyfill？**  
    **答**：通过 `@babel/preset-env` 的 `useBuiltIns` 选项。

30. **Babel 如何与 Webpack 结合使用？**  
    **答**：通过 `babel-loader`。

---

### 六、TSC（TypeScript Compiler）（5 题）

31. **TSC 的核心作用是什么？**  
    **答**：将 TypeScript 编译为 JavaScript。

32. **如何配置 TSC 的输出目录？**

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

33. **TSC 如何处理类型检查？**  
    **答**：通过 `tsconfig.json` 中的 `strict` 选项启用严格模式。

34. **TSC 与 Babel 的区别？**  
    **答**：TSC 仅编译 TypeScript，Babel 支持更多语法转换。

35. **如何优化 TSC 的编译性能？**  
    **答**：启用 `incremental` 选项，增量编译。

---

### 七、Webpack（5 题）

36. **Webpack 的核心作用是什么？**  
    **答**：将模块打包为静态资源。

37. **Webpack 如何处理代码分割？**  
    **答**：通过 `import()` 动态加载模块。

38. **如何配置 Webpack 的多入口打包？**

```javascript
module.exports = {
  entry: {
    main: "./src/index.js",
    about: "./src/about.js",
  },
};
```

39. **Webpack 插件的作用是什么？**  
    **答**：扩展 Webpack 功能，如生成 HTML 文件、压缩代码等。

40. **Webpack 如何优化构建性能？**  
    **答**：使用 `cache` 选项、`thread-loader` 多线程编译。

---

### 高频考点解析

1. **工具对比**：理解各工具的适用场景（如 Vite 适合开发，Rollup 适合库打包）
2. **性能优化**：掌握 Tree Shaking、代码分割、缓存等优化手段
3. **插件机制**：熟悉各工具的插件体系及常用插件
4. **配置技巧**：掌握多入口、多环境、静态资源处理等配置方法

建议结合项目中的实际应用场景准备答案（如：如何用 Vite 优化开发体验），面试时被追问的概率极高。需要某题的详细解析或扩展变种题，可以随时告诉我！

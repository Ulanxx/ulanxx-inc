# Rollup 如何实现树摇优化和代码分割

**Rollup** 实现代码拆分（Code Splitting）和树摇优化（Tree Shaking）是其核心功能之一，这两项技术能够显著减少打包后的文件体积并提升性能。以下是详细的实现原理和配置方法：

---

## **1. 树摇优化（Tree Shaking）**

### **1.1 工作原理**

树摇优化的目标是移除未使用的代码（“死代码”），从而减少最终的打包体积。Rollup 的树摇功能基于以下关键技术：

- **ES Module（ESM）规范**：
  - ESM 是静态模块，编译时可以明确知道模块的导入和导出内容。
  - Rollup 在分析依赖图时，可以精准识别哪些导出未被使用。
- **静态分析**：
  - Rollup 通过分析代码中的依赖关系，移除未被引用的导出。
  - 它不会执行代码，而是通过代码语法（AST）来判断哪些代码需要保留。

### **1.2 实现步骤**

#### **配置说明**

树摇优化是 Rollup 的内置功能，无需额外配置，但以下条件需满足：

1. **源码必须使用 ESM**：例如 `import` 和 `export`。
2. **确保未使用的代码不包含副作用**：
   - 副作用（Side Effects）是指代码运行时可能影响外部环境（如修改全局变量或 I/O 操作）。
   - Rollup 会移除未使用且无副作用的代码。

#### **示例代码**

假设有一个工具库：

```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

在另一个文件中：

```javascript
import { add } from "./utils.js";

console.log(add(2, 3)); // 仅使用了 add，未使用 subtract
```

Rollup 打包时，`subtract` 函数会被移除。

#### **配置副作用**

在 `package.json` 中指定哪些文件包含副作用：

```json
{
  "sideEffects": ["some-global-effect.js"],
  "main": "dist/index.js",
  "module": "dist/index.esm.js"
}
```

未声明为副作用的文件会默认进行树摇优化。

---

## **2. 代码拆分（Code Splitting）**

### **2.1 工作原理**

代码拆分的目标是将打包后的代码分为多个文件，按需加载以提高性能。Rollup 使用 **动态导入（Dynamic Import）** 和 **共享依赖（Shared Dependencies）** 实现代码拆分。

- **动态导入**：
  - 使用 `import()` 函数动态加载模块，Rollup 会将这些模块拆分成独立的文件。
- **共享依赖**：
  - 将多个模块中的公共依赖提取为单独的文件（chunk），避免重复加载。

### **2.2 实现步骤**

#### **动态导入**

在代码中使用 `import()` 语法：

```javascript
// main.js
document.getElementById("button").addEventListener("click", () => {
  import("./module.js").then(({ sayHello }) => {
    sayHello();
  });
});

// module.js
export function sayHello() {
  console.log("Hello, Rollup!");
}
```

Rollup 配置文件：

```javascript
// rollup.config.js
export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [],
};
```

运行 `rollup -c` 后，会生成两个文件：

- `main.js`：入口文件。
- `module.js`：动态导入模块。

浏览器只在点击按钮时加载 `module.js`，实现按需加载。

#### **共享依赖**

Rollup 自动提取公共依赖为单独的 chunk：

```javascript
// a.js
import { shared } from "./shared.js";
console.log("A", shared);

// b.js
import { shared } from "./shared.js";
console.log("B", shared);

// shared.js
export const shared = "This is shared";
```

Rollup 配置：

```javascript
export default {
  input: ["src/a.js", "src/b.js"],
  output: {
    dir: "dist",
    format: "es",
  },
};
```

Rollup 会输出：

- `a.js` 和 `b.js`：分别包含模块特定的代码。
- `shared.js`：提取的公共依赖。

---

## **3. 配置代码拆分与树摇的选项**

### **Rollup 配置示例**

```javascript
export default {
  input: "src/main.js", // 入口文件
  output: {
    dir: "dist",
    format: "es", // 输出为 ESM 格式
    chunkFileNames: "[name]-[hash].js", // 拆分后文件的命名规则
  },
  plugins: [],
  treeshake: {
    moduleSideEffects: false, // 禁止处理有副作用的模块
    propertyReadSideEffects: false, // 移除未使用的属性读取
    tryCatchDeoptimization: false, // 防止 try-catch 阻止树摇
  },
};
```

---

### **4. 注意事项**

1. **动态导入的限制**：
   - Rollup 只支持动态导入的 **静态路径**（即路径不能是变量）。
2. **副作用处理**：
   - 确保模块代码无副作用，或者正确配置 `sideEffects`。
3. **格式限制**：
   - 输出格式应为支持代码拆分的格式（如 `es` 或 `system`）。
4. **插件的副作用**：
   - 一些插件（如 Babel 插件）可能会破坏树摇功能，需检查插件配置。

通过以上配置和实践，你可以利用 Rollup 实现高效的代码拆分与树摇优化，生成轻量级的打包文件，满足现代化开发需求。

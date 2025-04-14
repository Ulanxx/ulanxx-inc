# 构建器性能优化

小程序构建器从 webpack 迁移到 esbuild + SWC。

### 一、迁移背景与目标

1. **Webpack 的痛点**：
   - 构建速度慢，尤其是大型项目
   - 配置复杂，插件生态庞大但性能开销大
2. **esbuild + SWC 的优势**：
   - **esbuild**：极快的 JavaScript 和 CSS 打包速度
   - **SWC**：极快的 TypeScript 和 JavaScript 编译速度
3. **优化目标**：
   - 减少构建时间（如从 60s 降到 10s 以内）
   - 简化配置，降低维护成本
   - 支持小程序特有的构建需求（如分包、多平台适配）

---

### 二、迁移与优化方案

#### 1. **替换 Webpack 为 esbuild**

- **核心功能迁移**：
  - 使用 esbuild 的 `build` API 替代 Webpack 的打包逻辑
  - 支持小程序入口文件配置
  ```javascript
  require("esbuild").build({
    entryPoints: ["src/app.js"], // 小程序入口
    bundle: true,
    outfile: "dist/app.js",
    platform: "node", // 根据小程序环境调整
  });
  ```
- **插件替换**：
  - 使用 esbuild 插件替代 Webpack 插件（如 `esbuild-plugin-copy` 替代 `copy-webpack-plugin`）
  ```javascript
  const copyPlugin = require("esbuild-plugin-copy");
  require("esbuild").build({
    plugins: [
      copyPlugin({
        assets: [{ from: "src/assets", to: "dist/assets" }],
      }),
    ],
  });
  ```

#### 2. **替换 Babel 为 SWC**

- **编译逻辑迁移**：

  - 使用 SWC 替代 Babel 编译 TypeScript 和 JavaScript

  ```javascript
  const { transform } = require("@swc/core");

  transform("const x = 1;", {
    jsc: {
      parser: {
        syntax: "typescript",
      },
    },
  }).then((output) => {
    console.log(output.code);
  });
  ```

- **配置文件**：
  - 创建 `.swcrc` 配置文件，支持小程序语法
  ```json
  {
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "jsx": false
      },
      "target": "es5"
    }
  }
  ```

#### 3. **性能优化策略**

- **并行构建**：
  - 使用 esbuild 的 `incremental` 和 `watch` 模式
  ```javascript
  require("esbuild").build({
    incremental: true,
    watch: true,
  });
  ```
- **缓存机制**：
  - 使用 SWC 的缓存功能，避免重复编译
  ```javascript
  transform("const x = 1;", {
    jsc: {
      parser: { syntax: "typescript" },
    },
    cache: true, // 启用缓存
  });
  ```
- **Tree Shaking**：
  - esbuild 默认支持 Tree Shaking，移除未使用的代码
- **代码压缩**：
  - 使用 esbuild 的 `minify` 功能
  ```javascript
  require("esbuild").build({
    minify: true,
  });
  ```

#### 4. **小程序特有优化**

- **分包加载**：
  - 使用 esbuild 的 `entryPoints` 配置多个入口文件
  ```javascript
  require("esbuild").build({
    entryPoints: ["src/app.js", "src/subpackage/index.js"],
    outdir: "dist",
  });
  ```
- **多平台适配**：
  - 使用环境变量区分不同平台（如微信、支付宝）
  ```javascript
  require("esbuild").build({
    define: {
      "process.env.PLATFORM": JSON.stringify("wechat"),
    },
  });
  ```

---

### 三、性能对比与收益

1. **构建速度**：
   - Webpack：60s
   - esbuild + SWC：10s 以内
2. **资源体积**：
   - 通过 Tree Shaking 和代码压缩，减少 20%~30% 的包体积
3. **开发体验**：
   - 热更新速度提升，开发效率显著提高

---

### 四、注意事项

1. **插件生态**：
   - esbuild 和 SWC 的插件生态不如 Webpack 丰富，需评估是否满足需求
2. **兼容性问题**：
   - 部分 Webpack 特有的功能（如 `require.context`）需手动实现
3. **调试支持**：
   - 确保 Source Map 配置正确，便于调试
   ```javascript
   require("esbuild").build({
     sourcemap: true,
   });
   ```

---

### 五、示例配置

以下是一个完整的 esbuild + SWC 配置示例：

```javascript
const esbuild = require("esbuild");
const { transform } = require("@swc/core");

// 使用 SWC 编译 TypeScript
transform("const x: number = 1;", {
  jsc: {
    parser: { syntax: "typescript" },
  },
}).then((output) => {
  console.log(output.code);
});

// 使用 esbuild 打包
esbuild
  .build({
    entryPoints: ["src/app.js"],
    bundle: true,
    outfile: "dist/app.js",
    platform: "node",
    minify: true,
    sourcemap: true,
    incremental: true,
    watch: true,
  })
  .catch(() => process.exit(1));
```

---

### 六、总结

通过迁移到 esbuild + SWC，你的小程序构建器可以获得显著的性能提升。以下是迁移的核心步骤：

1. **替换 Webpack**：使用 esbuild 实现打包逻辑
2. **替换 Babel**：使用 SWC 实现编译逻辑
3. **优化构建性能**：启用并行构建、缓存、Tree Shaking 等功能
4. **适配小程序需求**：支持分包、多平台等特性

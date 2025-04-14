# Esbuild 自定义插件的最佳实践

## 简介

Esbuild 插件系统提供了强大的扩展能力，让我们能够自定义构建过程中的各个环节。本文将介绍如何编写高质量的 Esbuild 插件，以及一些最佳实践。

## 插件基础结构

一个标准的 Esbuild 插件是一个包含 `name` 和 `setup` 函数的对象：

```typescript
interface EsbuildPlugin {
  name: string;
  setup(build: PluginBuild): void | Promise<void>;
}
```

## 常见钩子函数

### onResolve

用于自定义模块解析逻辑：

```typescript
build.onResolve({ filter: /\.custom$/ }, async (args) => {
  return {
    path: args.path,
    namespace: "my-namespace",
  };
});
```

### onLoad

用于自定义模块加载逻辑：

```typescript
build.onLoad(
  { filter: /\.custom$/, namespace: "my-namespace" },
  async (args) => {
    return {
      contents: 'export default "processed content"',
      loader: "js",
    };
  }
);
```

## Setup 钩子函数返回值详解

### onResolve 返回值详解

#### 1. path

用于指定模块的最终路径。

```typescript
// 将 @src 别名解析到实际路径
build.onResolve({ filter: /^@src\// }, (args) => ({
  path: args.path.replace(/^@src\//, path.resolve(__dirname, "src/")),
}));
```

#### 2. external

标记模块为外部依赖，不参与打包。

```typescript
// 将所有 node_modules 中的包标记为外部依赖
build.onResolve({ filter: /^[^./]|^\.[^./]|^\.\.[^/]/ }, (args) => ({
  path: args.path,
  external: true,
}));
```

#### 3. namespace

创建虚拟模块或特殊处理的模块命名空间。

```typescript
// 创建虚拟模块命名空间
build.onResolve({ filter: /^virtual:/ }, (args) => ({
  path: args.path,
  namespace: "virtual-modules",
}));

// 处理对应命名空间的模块
build.onLoad({ filter: /.*/, namespace: "virtual-modules" }, (args) => ({
  contents: `export default "这是虚拟模块内容"`,
}));
```

#### 4. pluginData

在插件之间传递数据。

```typescript
// 第一个插件设置数据
build.onResolve({ filter: /\.css$/ }, (args) => ({
  path: args.path,
  pluginData: { cssModules: true },
}));

// 第二个插件读取数据
build.onLoad({ filter: /\.css$/ }, (args) => {
  if (args.pluginData?.cssModules) {
    // 处理 CSS Modules
  }
});
```

#### 5. sideEffects

控制模块的副作用。

```typescript
// 标记无副作用的模块
build.onResolve({ filter: /\.pure\.js$/ }, (args) => ({
  path: args.path,
  sideEffects: false,
}));
```

### onLoad 返回值详解

#### 1. contents

模块的内容，支持字符串或 Uint8Array。

```typescript
// 返回字符串内容
build.onLoad({ filter: /\.txt$/ }, async (args) => ({
  contents: await fs.promises.readFile(args.path, "utf8"),
  loader: "text",
}));

// 返回二进制内容
build.onLoad({ filter: /\.bin$/ }, async (args) => ({
  contents: await fs.promises.readFile(args.path),
  loader: "binary",
}));
```

#### 2. loader

指定内容的解析方式。

```typescript
// 支持的 loader 类型：
type Loader =
  | "js" // JavaScript
  | "jsx" // React JSX
  | "ts" // TypeScript
  | "tsx" // TypeScript + React
  | "css" // CSS
  | "json" // JSON
  | "text" // 纯文本
  | "base64" // Base64 编码
  | "file" // 文件路径
  | "dataurl" // Data URL
  | "binary"; // 二进制

// 示例：将 .vue 文件转换为 JSX
build.onLoad({ filter: /\.vue$/ }, async (args) => ({
  contents: await transformVueToJsx(args.path),
  loader: "jsx",
}));
```

#### 3. resolveDir

指定解析依赖时的基准目录。

```typescript
build.onLoad({ filter: /\.special$/ }, (args) => ({
  contents: `import "./relative-module"`,
  loader: "js",
  resolveDir: path.dirname(args.path), // 相对于当前文件解析
}));
```

#### 4. sourcefile 和 sourcesContent

用于生成源码映射。

```typescript
build.onLoad({ filter: /\.ts$/ }, async (args) => {
  const source = await fs.promises.readFile(args.path, "utf8");
  const { code, map } = await transform(source);

  return {
    contents: code,
    loader: "js",
    sourcefile: args.path,
    sourcesContent: true,
  };
});
```

### 错误和警告处理

#### errors 和 warnings

用于报告问题。

```typescript
build.onLoad({ filter: /\.custom$/ }, async (args) => {
  try {
    const content = await processFile(args.path);
    if (content.hasWarnings) {
      return {
        contents: content.code,
        warnings: [
          {
            text: "文件处理可能不完整",
            location: {
              file: args.path,
              line: content.warningLine,
              column: content.warningColumn,
            },
            detail: content.warningDetail,
          },
        ],
      };
    }
    return { contents: content.code };
  } catch (error) {
    return {
      errors: [
        {
          text: "处理文件失败",
          location: {
            file: args.path,
            line: 1,
            column: 0,
          },
          detail: error.message,
        },
      ],
    };
  }
});
```

### 最佳实践

1. **合理使用 namespace**：

   - 用于隔离不同类型的模块
   - 创建虚拟模块系统
   - 避免与其他插件冲突

2. **优化 contents 返回**：

   - 文本文件使用字符串
   - 二进制文件使用 Uint8Array
   - 大文件考虑流式处理

3. **正确设置 loader**：

   - 选择最合适的 loader 类型
   - 考虑文件类型的特性
   - 注意性能影响

4. **错误处理**：
   - 提供详细的错误信息
   - 包含文件位置信息
   - 添加有用的警告信息

## 最佳实践

### 1. 明确的命名规范

- 插件名称应该清晰表达功能
- 推荐使用 `esbuild-plugin-` 前缀
- 使用小写字母和连字符

### 2. 错误处理

```typescript
try {
  // 插件逻辑
} catch (error) {
  return {
    errors: [
      {
        text: error.message,
        location: null,
      },
    ],
  };
}
```

### 3. 性能优化

- 尽可能使用精确的 filter 正则表达式
- 避免不必要的异步操作
- 合理使用缓存机制

### 4. 配置选项

提供合理的默认值和类型定义：

```typescript
interface PluginOptions {
  option1?: string;
  option2?: boolean;
}

export default (options: PluginOptions = {}) => ({
  name: "my-plugin",
  setup(build) {
    const finalOptions = {
      option1: options.option1 ?? "default",
      option2: options.option2 ?? true,
    };
    // ...
  },
});
```

### 5. 调试支持

添加调试日志支持：

```typescript
const DEBUG = process.env.DEBUG === "true";

function log(...args: any[]) {
  if (DEBUG) {
    console.log("[my-plugin]", ...args);
  }
}
```

## 常见使用场景

### 1. 自定义文件处理

```typescript
build.onLoad({ filter: /\.custom$/ }, async (args) => {
  const source = await fs.promises.readFile(args.path, "utf8");
  const processed = customTransform(source);
  return {
    contents: processed,
    loader: "js",
  };
});
```

### 2. 虚拟模块

```typescript
build.onResolve({ filter: /^virtual:/ }, (args) => ({
  path: args.path,
  namespace: "virtual",
}));

build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => ({
  contents: generateVirtualModule(args.path),
}));
```

### 3. 外部资源处理

```typescript
build.onResolve({ filter: /^https?:\/\// }, (args) => ({
  path: args.path,
  namespace: "http-url",
}));

build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
  const response = await fetch(args.path);
  const contents = await response.text();
  return { contents };
});
```

## 实用插件案例

### 1. 环境变量注入插件

在构建时注入环境变量，支持开发和生产环境的配置：

```typescript
interface EnvPluginOptions {
  env: Record<string, string>;
  prefix?: string;
}

export const envPlugin = (options: EnvPluginOptions): esbuild.Plugin => ({
  name: "env-plugin",
  setup(build) {
    // 创建虚拟模块
    build.onResolve({ filter: /^@env$/ }, (args) => ({
      path: args.path,
      namespace: "env-ns",
    }));

    // 注入环境变量
    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => {
      const env = options.env;
      const prefix = options.prefix || "VITE_";
      const filtered = Object.keys(env)
        .filter((key) => key.startsWith(prefix))
        .reduce((obj, key) => {
          obj[key] = env[key];
          return obj;
        }, {} as Record<string, string>);

      return {
        contents: `export default ${JSON.stringify(filtered)}`,
        loader: "js",
      };
    });
  },
});

// 使用示例
const result = await esbuild.build({
  entryPoints: ["app.js"],
  bundle: true,
  plugins: [
    envPlugin({
      env: process.env,
      prefix: "APP_",
    }),
  ],
});
```

### 2. 图片压缩插件

自动压缩项目中的图片资源：

```typescript
import { Plugin } from "esbuild";
import sharp from "sharp";
import path from "path";

interface ImageOptions {
  quality?: number;
  formats?: ("webp" | "avif")[];
}

export const imageOptimizePlugin = (options: ImageOptions = {}): Plugin => ({
  name: "image-optimize",
  setup(build) {
    build.onLoad({ filter: /\.(png|jpe?g)$/ }, async (args) => {
      const source = sharp(args.path);
      const meta = await source.metadata();

      // 生成优化后的图片版本
      const optimized = await source
        .resize({
          width: meta.width,
          height: meta.height,
          fit: "contain",
        })
        .toBuffer();

      // 生成现代图片格式
      const variants = await Promise.all(
        (options.formats || ["webp"]).map(async (format) => {
          const buffer = await source[format]({
            quality: options.quality || 80,
          }).toBuffer();
          return {
            format,
            buffer,
          };
        })
      );

      // 生成导出代码
      const variantImports = variants
        .map(
          (v, i) =>
            `const variant${i} = "data:image/${
              v.format
            };base64,${v.buffer.toString("base64")}";`
        )
        .join("\n");

      return {
        contents: `
          ${variantImports}
          export default {
            default: "data:image/${path
              .extname(args.path)
              .slice(1)};base64,${optimized.toString("base64")}",
            variants: [${variants.map((_, i) => `variant${i}`).join(", ")}]
          };
        `,
        loader: "js",
      };
    });
  },
});
```

### 3. 自动 API 文档生成插件

自动从 TypeScript 接口定义生成 API 文档：

```typescript
import { Plugin } from "esbuild";
import * as ts from "typescript";
import path from "path";

interface ApiDocOptions {
  output?: string;
  include?: string[];
}

export const apiDocPlugin = (options: ApiDocOptions = {}): Plugin => ({
  name: "api-doc",
  setup(build) {
    const docs: Record<string, any> = {};

    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      if (!options.include?.some((pattern) => args.path.includes(pattern))) {
        return;
      }

      const program = ts.createProgram([args.path], {});
      const sourceFile = program.getSourceFile(args.path);
      const checker = program.getTypeChecker();

      if (!sourceFile) return;

      // 遍历 AST 收集接口信息
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
          const symbol = checker.getSymbolAtLocation(node.name);
          if (symbol) {
            const type = checker.getDeclaredTypeOfSymbol(symbol);
            docs[symbol.getName()] = {
              properties: type.getProperties().map((prop) => ({
                name: prop.getName(),
                type: checker.typeToString(
                  checker.getTypeOfSymbolAtLocation(prop, node)
                ),
                docs: ts.displayPartsToString(prop.getDocumentationComment(checker)),
              })),
            };
          }
        }
      });

      // 生成文档
      if (options.output) {
        const fs = require("fs").promises;
        await fs.writeFile(
          path.resolve(options.output),
          JSON.stringify(docs, null, 2)
        );
      }

      return {
        contents: await fs.promises.readFile(args.path, "utf8"),
        loader: "ts",
      };
    });
  },
}));
```

这些插件案例展示了更实用的场景：

1. 环境变量注入插件：帮助管理不同环境的配置
2. 图片压缩插件：自动优化图片资源，支持现代图片格式
3. API 文档生成插件：从 TypeScript 类型定义自动生成 API 文档

每个插件都包含了完整的类型定义、错误处理和实用的配置选项，可以直接在实际项目中使用。

## 注意事项

1. 保持插件功能单一，遵循单一职责原则
2. 提供详细的文档和使用示例
3. 编写测试用例确保插件的稳定性
4. 注意插件之间的顺序和互操作性
5. 合理处理异步操作，避免性能问题

## 总结

编写高质量的 Esbuild 插件需要注意以下几点：

- 遵循标准的插件结构
- 实现必要的钩子函数
- 做好错误处理和性能优化
- 提供良好的开发体验
- 保持代码的可维护性

通过遵循这些最佳实践，我们可以开发出高质量、可维护的 Esbuild 插件。

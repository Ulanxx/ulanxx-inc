# esbuild-plugin-style-compiler 实现原理与关键代码

### 1. 概述

esbuild-plugin-style-compiler 是小程序构建系统中的关键组件，负责在 esbuild-plugin-style 基础上进一步处理样式，实现样式隔离和冲突解决。它的主要功能是：

- 接收 CSS/LESS 文件的处理结果
- 应用 style-factory 转换标签选择器
- 实现样式隔离机制
- 提供缓存优化

### 2. 插件架构

插件通过 styleCompilerLoader 函数暴露，它返回符合 esbuild 插件规范的对象：

```typescript
export const styleCompilerLoader = (options?: {
  root: string;
  extensions: string[];
}): Plugin => {
  const opts = Object.assign(
    { root: process.cwd(), extensions: [".css", ".tyss", ".less"] },
    options
  );
  const { root, extensions } = opts;

  // 创建缓存系统
  const cacheResult = new Map<string, string>();
  const cacheMD5 = new Map<string, string>();

  const cssExtensions = extensions.filter((ext) => ext !== ".less");

  return {
    name: "style-compiler-loader",
    setup(build: PluginBuild) {
      // 设置插件钩子
      // ...
    },
  };
};
```

### 3. 核心功能实现

#### 3.1 解析阶段

在解析阶段，插件通过 `onResolve` 钩子处理文件路径和依赖关系：

```typescript
async function resolveArgs(
  args: OnResolveArgs,
  fn: typeof getCssImportsAsync | typeof getLessImportsAsync,
  namespace: string
): Promise<OnResolveResult> {
  if (args.resolveDir === "") return;
  const file = normalizeResolvePath(args, root);

  if (!fs.existsSync(file)) {
    return {
      watchDirs: [path.dirname(file)],
      errors: [{ text: `${file} file does not exist.` }],
    };
  }

  // 收集样式依赖，用于文件监听和增量构建
  const importFiles = await fn(file);
  const watchFiles = [...importFiles, file];

  return { path: file, namespace, watchFiles, sideEffects: true };
}

// 注册 LESS 文件解析钩子
build.onResolve({ filter: /\.(less|style)?$/ }, (args) => {
  return resolveArgs(args, getLessImportsAsync, "less");
});

// 注册 CSS/TYSS 文件解析钩子
const cssReg = new RegExp(
  `\\.(${cssExtensions.map((n) => n.substring(1)).join("|")}|style)$`
);
build.onResolve({ filter: cssReg }, (args) => {
  return resolveArgs(args, getCssImportsAsync, "css");
});
```

#### 3.2 加载阶段

加载阶段是插件的核心，通过 `onLoad` 钩子实现样式处理和转换：

```typescript
async function loadResult(
  args: OnLoadArgs,
  type: "less" | "css"
): Promise<OnLoadResult> {
  const currentFile = args.path;
  let contents = fs.readFileSync(currentFile, "utf-8");

  const isLess = type === "less";
  const transform = isLess ? transformLess : transformCss;
  const convertError = isLess ? convertLessError : convertCssError;

  let warnings = [];

  try {
    // 1. 首先使用基础样式转换处理 CSS/LESS
    const cssResult = await transform(contents, currentFile, {
      minify: initialOptions.minify,
    });
    contents = cssResult.css;

    if (cssResult.warnings()) {
      warnings = convertPostcssWarnings(cssResult.warnings());
    }
  } catch (e) {
    // 错误处理
    return {
      errors: [convertError(e)],
      resolveDir: path.dirname(currentFile),
    };
  }

  // 2. MD5 缓存优化
  const md5 = getBufferMD5(Buffer.from(contents));

  if (md5 === cacheMD5.get(currentFile) && cacheResult.has(currentFile)) {
    // 命中缓存，直接使用缓存结果
    contents = cacheResult.get(currentFile);
  } else {
    // 未命中缓存，使用 style-factory 处理
    try {
      contents = styleFactory(contents, {
        transformTag: (name) => {
          if (name === "web-view") {
            return `unsupported_${name}`;
          }
          if (name === "\\*") {
            return "unsupported_star";
          }
          // 3. 核心转换: 将标签选择器转换为属性选择器
          return `[meta\\\\:tag=${name}]`;
        },
      });
      // 更新缓存
      cacheResult.set(currentFile, contents);
      cacheMD5.set(currentFile, md5);
    } catch (e) {
      return {
        errors: [{ text: e.message, location: { file: currentFile } }],
        resolveDir: path.dirname(currentFile),
      };
    }
  }

  // 4. 返回处理结果
  return {
    contents: contents,
    loader: "js", // 注意这里返回 js 而不是 css
    resolveDir: path.dirname(currentFile),
    warnings,
  };
}

// 注册 LESS 文件加载钩子
build.onLoad({ filter: /.\*/, namespace: "less" }, async (args) => {
  return await loadResult(args, "less");
});

// 注册 CSS 文件加载钩子
build.onLoad({ filter: /.\*/, namespace: "css" }, async (args) => {
  return await loadResult(args, "css");
});
```

### 4. 核心技术点解析

#### 4.1 标签选择器转换

这是插件的最核心功能，通过 `styleFactory` 库实现标签选择器到属性选择器的转换：

```typescript
contents = styleFactory(contents, {
  transformTag: (name) => {
    if (name === "web-view") {
      return `unsupported_${name}`;
    }
    if (name === "\\*") {
      return "unsupported_star";
    }
    // 将标签选择器 (如 view) 转换为属性选择器 [meta\:tag=view]
    return `[meta\\\\:tag=${name}]`;
  },
});
```

这段代码是样式隔离的关键，它做了以下转换：

- 标签选择器 view → 属性选择器 [meta\:tag=view]
- 通配符选择器 \* → 移除功能的 unsupported_star
- 不支持的标签 web-view → 移除功能的 unsupported_web-view

转换后的 CSS 示例：

```css
/_ 转换前 _/ view.button {
  color: red;
}

/_ 转换后 _/ [meta\:tag="view"].button {
  color: red;
}
```

#### 4.2 样式隔离原理

样式隔离的原理是将 CSS 中的标签选择器转换为专用的属性选择器，这样的转换确保了：

- 范围限制：样式只应用于拥有对应 meta:tag 属性的元素
- 冲突避免：防止样式与浏览器原生标签样式冲突
- 优先级提升：属性选择器比普通标签选择器优先级更高

在运行时，小程序框架会为每个组件添加对应的 meta:tag 属性，例如：

```html
<!-- 原始模板 -->
<view class="button">按钮</view>

<!-- 渲染结果 -->
<div meta:tag="view" class="button">按钮</div>
```

#### 4.3 MD5 缓存机制

为了提高性能，插件实现了基于 MD5 的缓存系统：

```typescript
// 计算 MD5 哈希
function getBufferMD5(buffer: Buffer) {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(buffer);
  return hashSum.digest('hex');
}

// 应用缓存
const md5 = getBufferMD5(Buffer.from(contents));
if (md5 === cacheMD5.get(currentFile) && cacheResult.has(currentFile)) {
contents = cacheResult.get(currentFile);
} else {
// 处理样式并更新缓存
contents = styleFactory(contents, { /_ ... _/ });
cacheResult.set(currentFile, contents);
cacheMD5.set(currentFile, md5);
}
```

这种缓存机制确保了相同内容的样式文件只被处理一次，大幅提升了构建性能。

#### 4.4 与 esbuild 的集成

插件充分利用了 esbuild 的插件机制，特别是：

- 命名空间：使用 less 和 css 命名空间区分不同类型的样式文件
- 文件监听：通过 watchFiles 实现依赖文件的监听，支持增量构建
- 错误处理：提供标准化的错误和警告处理，提升开发体验

#### 4.5 工作流程总结

esbuild-plugin-style-compiler 的完整工作流程如下：

- 初始化：设置配置项和缓存系统
- 路径解析：处理文件路径和依赖关系
- 基础转换：使用 esbuild-plugin-style 的功能处理 CSS/LESS 文件
- 缓存检查：检查处理结果是否已缓存
- 选择器转换：使用 styleFactory 将标签选择器转换为属性选择器
- 结果处理：更新缓存并返回处理后的代码

#### 4.6 与其他组件的关系

esbuild-plugin-style-compiler 在样式处理流水线中处于关键位置：

- 上游：接收 esbuild-plugin-style 处理过的基础 CSS 内容
- 核心处理：应用 styleFactory 实现样式隔离
- 下游：为 minipack 提供经过样式隔离处理的 CSS 代码

#### 4.7 技术亮点

- 高效的选择器转换：通过精确的选择器转换实现样式隔离
- 智能缓存系统：使用 MD5 哈希避免重复处理，提升性能
- 特殊情况处理：针对 web-view 和通配符选择器等特殊情况提供专门处理
- 完善的错误处理：提供友好的错误信息，提升开发体验
- 无缝集成：与 esbuild 和其他插件形成完整的处理流水线

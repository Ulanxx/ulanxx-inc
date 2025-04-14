# Vite 核心原理

## 1. 基于 ESM 的开发服务器

在 Vite 出现之前，传统的打包工具如 Webpack 通常是先解析依赖、打包构建，然后再启动开发服务器。Dev Server 必须等待所有模块构建完成，当我们修改了 bundle 模块中的一个子模块时，整个 bundle 文件都会重新打包并输出。随着项目规模的增大，启动时间也会变得越来越长。

Vite 则利用了浏览器对 ESM（ES Modules）的支持。当 import 模块时，浏览器会直接下载被导入的模块。Vite 先启动开发服务器，当代码执行到模块加载时再请求对应模块的文件，从而实现了动态加载。未被使用的路由部分不会参与构建过程，因此不会影响构建速度。即使项目中的应用越来越多，增加新的路由也不会显著影响其构建速度。

### 面试题

1. **Vite 的开发服务器是如何利用 ESM 提高构建速度的？**

   - 答：Vite 利用浏览器对 ESM 的支持，先启动开发服务器，当代码执行到模块加载时再请求对应模块的文件，实现动态加载，避免了传统打包工具需要等待所有模块构建完成的问题。

2. **与传统的打包工具相比，Vite 的开发服务器有哪些优势？**
   - 答：传统打包工具如 Webpack 需要先解析依赖、打包构建再启动开发服务器，修改一个子模块时需要重新打包整个 bundle 文件。而 Vite 利用 ESM 支持，动态加载模块，未使用的路由不会参与构建，构建速度更快，项目规模增大时也不会显著影响构建速度。

#### 代码示例

以下是一个简单的 Vite 配置示例，展示了如何配置开发服务器：

```js
// vite.config.js
export default {
  server: {
    port: 3000,
  },
};
```

## 2. 基于 ESM 的 HMR

Vite 的 HMR（热模块替换）基于浏览器原生 ESM 实现，能够在不刷新整个页面的情况下，实时更新模块内容，从而提高开发效率。

### 实现原理

1. **模块热替换**：当模块内容发生变化时，Vite 会通过 WebSocket 向客户端发送更新通知。客户端接收到通知后，会根据模块的依赖关系，动态加载更新后的模块，并替换旧的模块内容。
2. **依赖追踪**：Vite 会追踪模块之间的依赖关系，当某个模块发生变化时，Vite 会找到所有依赖该模块的父模块，并通知这些父模块进行更新。
3. **状态保留**：在模块热替换过程中，Vite 会尽量保留模块的内部状态，避免因模块更新导致的状态丢失。例如，在 React 项目中，组件的状态会在热替换后保留，从而避免页面刷新带来的状态重置。

### 面试题

1. **Vite 的 HMR 是如何实现的？**

   - 答：Vite 的 HMR 基于浏览器原生 ESM 实现，通过 WebSocket 向客户端发送更新通知，客户端接收到通知后，动态加载更新后的模块，并替换旧的模块内容。同时，Vite 会追踪模块之间的依赖关系，通知依赖该模块的父模块进行更新，并尽量保留模块的内部状态。

2. **Vite 的 HMR 与传统的 HMR 有何不同？**
   - 答：传统的 HMR 通常需要重新打包整个模块，并替换旧的模块内容。而 Vite 的 HMR 基于 ESM 实现，通过动态加载更新后的模块，避免了重新打包的过程，提高了更新速度。同时，Vite 的 HMR 会尽量保留模块的内部状态，避免状态丢失。

#### 代码示例

以下是一个简单的 Vite 配置示例，展示了如何配置 HMR：

```js
// vite.config.js
export default {
  hmr: true,
};
```

## 3. 基于 esbuild 的依赖预编译优化

### 3.1 为什么需要预构建？

1. **支持 CommonJS 依赖**：Vite 基于浏览器原生 ESM 实现，但用户代码必须是 ESM 模块。因此，Vite 需要将 CommonJS 模块预先转换为 ESM 模块，并缓存到 `node_modules/.vite` 目录中。
2. **减少模块和请求数量**：例如，常用的 lodash 工具库包含许多通过单独文件导入的包，而 `lodash-es` 包含数百个子模块。当代码中使用 `import { debounce } from 'lodash-es'` 时，会发出数百个 HTTP 请求，导致网络拥堵，影响页面加载性能。Vite 将这些内部模块的 ESM 依赖关系转换为单个模块，从而提高页面加载性能。

### 3.2 为什么使用 Esbuild？

### 为什么使用 Esbuild？

1. **编译运行 VS 解释运行**：大多数前端打包工具是用 JavaScript 实现的，JavaScript 是解释性语言，边运行边解释。而 Esbuild 是用 Go 语言编写的，Go 语言可以直接编译为机器码，在启动时直接执行，因此在 CPU 密集场景下，Go 语言具有显著的性能优势。
2. **多线程 VS 单线程**：JavaScript 本质上是单线程语言，虽然可以通过 WebWorker 实现多线程操作，但仍有局限性。相比之下，Go 语言天生支持多线程，能够更高效地利用多核 CPU 资源。
3. **构建流程优化**：Esbuild 对构建流程进行了深度优化，例如在构建过程中，Esbuild 会使用多线程并行处理文件，从而显著提高构建速度。

### 3.3 实现原理

Vite 的依赖预编译是通过 esbuild 实现的，主要包括以下几个步骤：

1. **依赖扫描**：在启动开发服务器时，Vite 会扫描项目中的所有模块依赖，找到所有的第三方依赖（如 lodash-es）。
2. **依赖预编译**：使用 esbuild 将这些第三方依赖编译成 ESM 格式，并将结果缓存到 `node_modules/.vite` 目录中。
3. **请求拦截**：在开发服务器中拦截对这些依赖的请求，并返回预编译后的结果，从而减少浏览器的请求数量，提高页面加载速度。

#### 面试题

1. **为什么 Vite 需要对依赖进行预编译？**

   - 答：Vite 基于浏览器原生 ESM 实现，但许多第三方库仍然使用 CommonJS 格式。预编译可以将这些依赖转换为 ESM 格式，减少浏览器请求数量，提高加载性能。

2. **Vite 是如何利用 esbuild 进行依赖预编译的？**
   - 答：Vite 在启动时扫描项目依赖，使用 esbuild 将第三方依赖编译成 ESM 格式，并缓存到 `node_modules/.vite` 目录中，开发服务器拦截请求并返回预编译结果。

#### 代码示例

以下是一个简单的 Vite 配置示例，展示了如何配置依赖预编译：

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ["lodash-es"],
  },
};
```

## 4. 基于 Rollup 的 Plugins

### 4.1 Vite 插件是什么

使用 Vite 插件可以扩展 Vite 的能力，通过暴露构建打包过程中的一些生命周期，配合工具函数，让用户可以自己定义地写一些配置代码，执行在打包过程中。比如解析用户自定义文件的输入，在打包代码前转义代码，或者查找。

在实际的实现中，Vite 仅仅需要基于 Rollup 设计的接口进行扩展，在保证兼容 Rollup 插件的同时再加入一些 Vite 特有的钩子和属性进行扩展。

### 4.2 Vite 独有的钩子

Vite 独有的钩子有：

- `config`：可以在 Vite 被解析之前修改 Vite 的相关配置。钩子接收原始用户配置 `config` 和一个描述配置环境的变量 `env`。
- `configResolved`：解析 Vite 配置后调用，配置确认。
- `configureServer`：主要用来配置开发服务器，为 dev-server 添加自定义的中间件。
- `transformIndexHtml`：主要用来转换 `index.html`，钩子接收当前的 HTML 字符串和转换上下文。
- `handleHotUpdate`：执行自定义 HMR 更新，可以通过 `ws` 往客户端发送自定义的事件。

### 4.3 通用钩子

Vite 兼容 Rollup 的通用钩子，以下是一些常用的钩子：

- `options`：在服务启动时调用一次，可以获取和操纵 Rollup 选项。
- `buildstart`：在构建开始时调用。
- `resolveId`：在每个传入模块请求时被调用，可以创建自定义确认函数，用来定位第三方依赖。
- `load`：在每个传入模块请求时被调用，可以自定义加载器，返回自定义的内容。
- `transform`：在每个传入模块请求时被调用，主要用来转换单个模块。
- `buildend`：在服务关闭时调用一次。
- `closeBundle`：在服务关闭时调用一次。

#### 面试题

1. **Vite 插件有哪些常用的钩子？**

   - 答：Vite 插件常用的钩子包括 `options`、`buildstart`、`resolveId`、`load`、`transform`、`buildend` 和 `closeBundle`。

2. **如何在 Vite 插件中使用 `resolveId` 钩子？**
   - 答：`resolveId` 钩子在每个传入模块请求时被调用，可以创建自定义确认函数，用来定位第三方依赖。

#### 代码示例

以下是一个简单的 Vite 插件示例，展示了如何使用 `resolveId` 钩子：

```js
// vite.config.js
export default {
  plugins: [
    {
      resolveId(id) {
        return id;
      },
    },
  ],
};
```

### 4.4 插件的执行顺序

Vite 插件的执行顺序是：

- 插件的 `options` 钩子
- 插件的 `config` 钩子
- 插件的 `configResolved` 钩子
- 插件的 `configureServer` 钩子
- 插件的 `transformIndexHtml` 钩子
- 插件的 `handleHotUpdate` 钩子
- 插件的 `buildstart` 钩子
- 插件的 `resolveId` 钩子
- 插件的 `load` 钩子
- 插件的 `transform` 钩子
- 插件的 `buildend` 钩子
- 插件的 `closeBundle` 钩子

Vite 插件可以通过一个 `enforce` 属性（类似于 Webpack 加载器）来调整它的应用顺序。`enforce` 的值可以是 `pre` 或 `post`。解析后的插件将按照以下顺序排列：

1. Alias 插件
2. `enforce: 'pre'` 的自定义插件
3. Vite 核心插件
4. 没有 `enforce` 的自定义插件
5. Vite 构建用的插件
6. `enforce: 'post'` 的自定义插件
7. Vite 后置构建插件

### 4.5 自定义插件

Vite 插件的实现方式与 Webpack 插件类似，都是通过 `plugin` 函数返回一个对象，对象中包含一些钩子函数。

```js
export default function plugin(options) {
  const pluginName = "@my-vite-plugin";
  // 返回整个插件对象
  return {
    // 必须的，会显示在 warning 和 error 中
    name: pluginName,
    // 钩子
    // config
    config: (config, env) =>({
        // 可以在 Vite 被解析之前修改 Vite 的相关配置。钩子接收原始用户配置 `config` 和一个描述配置环境的变量 `env`。
        console.log(config, env)
        return {}
    }),
    // configResolved 确认 config
    configResolved: (config) => {
        // 解析 Vite 配置后调用，配置确认
        console.log(config)
        return {}
    },
    // options
    options: (options) => {
        // 在服务启动时调用一次，可以获取和操纵 Rollup 选项
        // 什么时候需要使用？ 答：当需要对 Rollup 选项进行自定义时，可以使用这个钩子。
        console.log(options)
        return {}
    },
    buildStart: options =>({
        // 在构建开始时调用
        console.log(options)
        return {}
    }),
    transformIndexHtml: (html, ctx) => {
        // 主要用来转换 `index.html`，钩子接收当前的 HTML 字符串和转换上下文。
        // 什么时候需要使用？ 答：当需要对 `index.html` 进行自定义转换时，可以使用这个钩子。
        console.log(html, ctx)
        return html
    },
    // resolveId
    resolveId(id) {
        // 在每个传入模块请求时被调用，可以创建自定义确认函数，用来定位第三方依赖。
        console.log(id)
        return id;
    },
    // transform
    transform(code, id) {
        // 在每个传入模块请求时被调用，主要用来转换单个模块。
        console.log(code, id)
        return code
    },
    // buildEnd
    buildEnd: () => {
        // 在服务关闭时调用一次
        console.log("buildEnd")
        return {}
    },
  };
}
```

插件在 vite.config.ts 中引用

```js
import plugin from "./plugin";

export default {
  plugins: [plugin()],
};
```

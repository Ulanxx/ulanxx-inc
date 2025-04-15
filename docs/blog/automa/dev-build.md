# automa 项目开发与构建流程文档

## 1. 项目概述

automa 是一个基于 Vue.js 构建的浏览器扩展，允许用户通过连接功能块来创建自动化工作流。项目使用 Webpack 进行构建，支持 Chrome 和 Firefox 两种主流浏览器。

## 2. 开发流程 (`pnpm dev`)

运行 `pnpm dev` 命令时实际执行 `node utils/webserver.js` 脚本。

### 2.1 开发环境配置

- 设置环境变量：
  - `BABEL_ENV = "development"`
  - `NODE_ENV = "development"`
- 配置资源路径 `ASSET_PATH = "/"`

### 2.2 热重载设置

- 使用 `webpack-dev-server` 提供本地开发服务器
- 为特定入口点添加热重载支持：

```javascript
config.entry[entryName] = [
  "webpack/hot/dev-server",
  `webpack-dev-server/client?hot=true&hostname=localhost&port=${env.PORT}`,
].concat(config.entry[entryName]);
```

- 排除热重载的入口点：
  - `background`
  - `webService`
  - `contentScript`
  - `recordWorkflow`
  - `elementSelector`

### 2.3 开发服务器配置

- 运行在 `localhost` 和指定端口上
- 静态文件目录设置为 `build` 目录
- 开启写入磁盘功能 `writeToDisk: true`（对浏览器扩展开发很重要）
- 配置跨域支持 `Access-Control-Allow-Origin: *`

### 2.4 浏览器特定开发

- **Chrome**: `pnpm dev`
- **Firefox**: `pnpm dev:firefox`（通过 `cross-env BROWSER=firefox` 设置目标浏览器）

## 3. 构建流程 (`pnpm build`)

运行 `pnpm build` 命令时实际执行 `node utils/build.js` 脚本。

### 3.1 生产环境配置

- 设置环境变量：
  - `BABEL_ENV = "production"`
  - `NODE_ENV = "production"`
- 配置资源路径 `ASSET_PATH = "/"`

### 3.2 构建优化

- 设置 webpack 模式为 `"production"`: `config.mode = 'production'`
- 在生产模式下启用代码优化：

```javascript
options.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
    }),
  ],
};
```

### 3.3 浏览器特定构建

- **Chrome**: `pnpm build`
- **Firefox**: `pnpm build:firefox`（通过 `cross-env BROWSER=firefox` 设置目标浏览器）

## 4. 打包流程 (`pnpm build:zip`)

运行 `pnpm build:zip` 命令时实际执行 `node utils/build-zip.js` 脚本。

### 4.1 ZIP 文件生成

- 创建版本号目录：`../build-zip/${appVersion}/`
- 使用 `archiver` 库将 `build` 目录内容压缩为 ZIP 格式
- 生成文件名格式：`${packageName}-${browser}-v${appVersion}.zip`
- 压缩级别设置为最高：`{ zlib: { level: 9 } }`

### 4.2 生产发布流程

- **Chrome**: `pnpm build:prod-chrome`（运行 `build` 然后 `build:zip`）
- **Firefox**: `pnpm build:prod-firefox`（运行 `build:firefox` 然后 `build:zip`）
- **全平台**: `pnpm build:prod`（同时构建 Chrome 和 Firefox 版本）

## 5. Webpack 配置分析

### 5.1 入口点配置

```javascript
entry: {
  sandbox: path.join(__dirname, 'src', 'sandbox', 'index.js'),
  execute: path.join(__dirname, 'src', 'execute', 'index.js'),
  newtab: path.join(__dirname, 'src', 'newtab', 'index.js'),
  popup: path.join(__dirname, 'src', 'popup', 'index.js'),
  params: path.join(__dirname, 'src', 'params', 'index.js'),
  background: path.join(__dirname, 'src', 'background', 'index.js'),
  contentScript: path.join(__dirname, 'src', 'content', 'index.js'),
  offscreen: path.join(__dirname, 'src', 'offscreen', 'index.js'),
  recordWorkflow: path.join(__dirname, 'src', 'content', 'services', 'recordWorkflow', 'index.js'),
  webService: path.join(__dirname, 'src', 'content', 'services', 'webService.js'),
  elementSelector: path.join(__dirname, 'src', 'content', 'elementSelector', 'index.js'),
}
```

### 5.2 加载器配置

- Vue 单文件组件处理：`vue-loader`
- CSS 处理：`MiniCssExtractPlugin.loader`、`css-loader`、`postcss-loader`
- 国际化文件处理：`@intlify/vue-i18n-loader`
- JavaScript 处理：`babel-loader`、`source-map-loader`

### 5.3 插件配置

- `VueLoaderPlugin`：处理 Vue 单文件组件
- `CleanWebpackPlugin`：清理构建目录
- `CopyWebpackPlugin`：复制静态资源（如 `manifest.json` 和图标）
- `HtmlWebpackPlugin`：为每个入口点生成 HTML 文件
- `MiniCssExtractPlugin`：提取 CSS 到单独文件
- `webpack.DefinePlugin`：定义环境变量和 Vue 特定配置

### 5.4 清单文件处理

动态生成 `manifest.json` 文件：

```javascript
from: env.NODE_ENV === 'development' && env.BROWSER === 'chrome'
  ? `src/manifest.${env.BROWSER}.dev.json`
  : `src/manifest.${env.BROWSER}.json`,
to: path.join(__dirname, 'build', 'manifest.json'),
```

### 5.5 环境差异

- **开发环境**：启用源映射 `cheap-module-source-map`
- **生产环境**：启用代码压缩，使用 `TerserPlugin` 优化

## 6. 开发建议

### 贡献新功能

- 理解目录结构和 webpack 配置
- 按照现有模式添加新的功能模块

### 调试技巧

- 使用 `pnpm dev` 命令启动开发服务器
- 将扩展加载到浏览器时指向 `build` 目录
- 利用浏览器的扩展调试工具进行调试

### 跨浏览器兼容性

- 在两种浏览器中测试功能
- 遵循项目中处理浏览器差异的模式（如通过 manifest 文件区分）

### 构建优化建议

- 使用 `webpack-bundle-analyzer` 进行优化分析
- 考虑使用并行构建提高构建速度

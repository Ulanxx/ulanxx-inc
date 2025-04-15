# automa 项目二次开发指南

## 项目概述

automa 是一个基于 Vue.js 构建的浏览器扩展，允许用户通过连接功能块来创建自动化工作流，支持自动填写表单、执行重复任务、截取屏幕截图和抓取网站数据等功能。项目支持 Chrome 和 Firefox 浏览器，使用 Webpack 进行构建，采用 TailwindCSS 进行样式设计。

## 项目结构

```
src/
├── workflowEngine/            # 核心引擎
│   └── blocksHandler/         # 功能块处理逻辑
├── components/                # Vue组件
│   ├── block/                 # 功能块组件
│   ├── newtab/                # 新标签页组件
│   └── popup/                 # 弹出窗口组件
├── db/                        # 数据存储
├── background/                # 扩展后台脚本
├── content/                   # 内容脚本
├── stores/                    # 状态管理
├── utils/                     # 工具函数
└── locales/                   # 国际化文件
```

## 开发流程

### 环境搭建

1. 克隆仓库并安装依赖：

```bash
pnpm install
```

2. 创建必要的配置文件（如 `getPassKey.js`）

### 开发命令

| 命令                      | 说明                    |
| ------------------------- | ----------------------- |
| `pnpm dev`                | 开发模式（Chrome）      |
| `pnpm dev:firefox`        | 开发模式（Firefox）     |
| `pnpm build`              | 生产构建（Chrome）      |
| `pnpm build:firefox`      | 生产构建（Firefox）     |
| `pnpm build:prod-chrome`  | 完整生产发布（Chrome）  |
| `pnpm build:prod-firefox` | 完整生产发布（Firefox） |

## 核心架构

### 关键文件

1. **WorkflowEngine.js** - 工作流引擎核心
2. **WorkflowWorker.js** - 工作流执行器
3. **blocksHandler/** - 所有功能块处理器
4. **getSharedData.js** - 块注册系统

## 二次开发指南

### 1. 添加新功能块

**步骤：**

1. 在 `src/workflowEngine/blocksHandler/` 创建处理器文件

   ```javascript
   // handlerYourNewBlock.js
   export default {
     name: "Your New Block",
     execute({ inputs }) {
       // 实现块逻辑
     },
   };
   ```

2. 在 `src/components/block/` 添加 UI 组件

3. 在注册系统中注册新块（通常在 `getSharedData.js`）

### 2. 扩展现有功能

- 修改对应块处理器（`blocksHandler/` 目录下）
- 更新相关组件添加新选项

### 3. 开发新服务集成

1. 在 `src/service/` 创建服务连接器
2. 添加对应的块处理器和 UI 组件
3. 参考现有集成（如 Google Sheets）

### 4. 国际化支持

在 `src/locales/` 中添加翻译文件：

```json
// en.json
{
  "yourNewBlock": {
    "title": "Your New Block",
    "description": "Description of your block"
  }
}
```

## 构建系统

### Webpack 配置要点

1. **多入口点** - 支持扩展的不同部分
2. **浏览器差异化** - 通过环境变量区分
3. **开发优化** - 热重载、源映射
4. **生产优化** - 代码压缩、Tree Shaking

### 清单文件处理

动态生成 `manifest.json`：

```javascript
// webpack.config.js
from: env.NODE_ENV === 'development' && env.BROWSER === 'chrome'
  ? `src/manifest.${env.BROWSER}.dev.json`
  : `src/manifest.${env.BROWSER}.json`,
```

## 开发建议

1. **调试技巧**：

   - 使用浏览器开发者工具调试扩展
   - 重点关注 `background` 和 `content` 脚本

2. **性能优化**：

   - 分析 `WorkflowEngine` 执行流程
   - 使用 `webpack-bundle-analyzer` 检查包大小

3. **测试策略**：

   - 在 Chrome 和 Firefox 上分别测试
   - 验证工作流执行稳定性

4. **最佳实践**：
   - 遵循现有代码风格
   - 保持块处理器的独立性
   - 为新增功能添加文档

## 常见开发场景

### 场景 1：添加截图功能块

1. 创建 `handlerScreenshot.js` 处理器
2. 添加 `ScreenshotBlock.vue` 组件
3. 实现截图逻辑（使用浏览器截图 API）
4. 注册到块系统

### 场景 2：集成新 API 服务

1. 在 `src/service/` 创建 API 客户端
2. 添加认证处理（OAuth 等）
3. 创建对应的功能块处理器
4. 实现 API 调用逻辑

## 注意事项

1. 浏览器扩展 API 限制
2. 内容脚本的安全限制
3. 跨浏览器兼容性问题
4. 扩展更新时的数据迁移

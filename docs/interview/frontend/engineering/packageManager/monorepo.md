# Monorepo 工具对比与实践

## 1. 基础概念

> 面试题: 什么是 Monorepo? 与 Multirepo 相比有什么优势和劣势?

Monorepo 是一种将多个项目代码存储在同一个代码仓库中的开发策略。

### 1.1 优势

1. **代码复用**

   - 多个项目可以共享代码库
   - 避免重复开发
   - 提高代码质量和稳定性

2. **依赖管理**

   - 统一的依赖版本控制
   - 避免版本冲突
   - 简化依赖更新流程

3. **工程标准化**
   - 统一的构建流程
   - 统一的代码规范
   - 统一的测试标准

### 1.2 劣势

1. **仓库体积大**

   - 随着项目增多,仓库体积会变得很大
   - 初次克隆耗时较长

2. **权限管理复杂**
   - 难以针对子目录做细粒度的权限控制
   - 所有开发者都能看到所有代码

## 2. 工具选择

> 面试题: 常见的 Monorepo 工具有哪些?各自有什么特点?

### 2.1 包管理工具 - pnpm

```bash
# workspace 配置
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
```

**核心优势:**

- 节省磁盘空间(依赖复用)
- 安装速度快
- 避免幽灵依赖
- 原生支持 workspace

### 2.2 构建工具 - Turborepo

> 面试题: Turborepo 相比 Lerna 有哪些优势?

**1. 构建性能**

- Turborepo 提供更快的增量构建
- 支持并行任务执行
- 具有本地/远程缓存能力
- 支持任务编排和依赖分析

**2. 缓存机制**

- 本地缓存: 自动缓存任务输出
- 远程缓存: 支持团队间共享缓存
- 精确的内容哈希: 避免不必要的重建

**3. 开发体验**

- 更好的日志输出和可视化
- 提供构建 profile 分析
- 支持任务管道可视化

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

**4. 与 Lerna 对比**

| 特性     | Turborepo           | Lerna           |
| -------- | ------------------- | --------------- |
| 增量构建 | ✅ 内置支持         | ❌ 需要额外配置 |
| 任务缓存 | ✅ 本地+远程        | ❌ 无内置缓存   |
| 并行执行 | ✅ 自动优化         | ✅ 基础支持     |
| 版本管理 | ❌ 需要配合其他工具 | ✅ 内置支持     |
| 发布管理 | ❌ 需要配合其他工具 | ✅ 内置支持     |
| 上手难度 | 较低                | 较高            |

### 2.3 版本管理 - Changesets

```bash
# 生成变更集
pnpm changeset

# 更新版本
pnpm changeset version

# 发布
pnpm publish -r
```

**主要功能:**

- 版本管理
- 变更日志
- 发布工作流

## 3. 最佳实践

> 面试题: 如何搭建一个高效的 Monorepo 工程体系?

### 3.1 推荐工具组合

```bash
# 基础架构
pnpm + turborepo + changesets

# 场景选择
简单项目: npm workspaces + lerna
复杂项目: pnpm + turborepo
CI/CD场景: turborepo(更好的缓存)
```

### 3.2 性能优化

```json
// turbo.json
{
  "pipeline": {
    "build": {
      // 1. 开启并行构建
      "dependsOn": ["^build"],
      // 2. 配置缓存
      "outputs": ["dist/**"],
      // 3. 启用远程缓存
      "cache": true
    }
  }
}
```

## 4. 常见问题

> 面试题: Monorepo 项目中如何处理包的依赖关系?

### 4.1 工作区依赖

```json
// packages/pkg-a/package.json
{
  "dependencies": {
    "pkg-b": "workspace:*" // 使用 workspace 协议
  }
}
```

### 4.2 版本管理

```bash
# 1. 统一版本
lerna version 1.0.0

# 2. 独立版本
lerna version --independent
```

### 4.3 构建顺序

```json
// turbo.json
{
  "pipeline": {
    "build": {
      // 拓扑排序构建（依赖关系）
      "dependsOn": ["^build"]
    }
  }
}
```

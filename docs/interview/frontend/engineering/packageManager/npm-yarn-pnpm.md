# npm、yarn、pnpm 的区别与优势

## 1. 核心区别

### 1.1 依赖管理方式

```bash
# 1. npm (v3+)
node_modules/
├── express/      # 扁平化管理
└── lodash/      # 可能产生依赖提升

# 2. yarn (v1)
node_modules/
├── .yarn-integrity   # 更好的依赖完整性检查
└── packages/        # 扁平化 + 确定性安装

# 3. yarn (v4)
.yarn/
├── cache/          # 零安装缓存
└── install-state.gz # 安装状态

# 4. pnpm
node_modules/
├── .pnpm/          # 依赖统一存储
└── packages/       # 硬链接到 .pnpm
```

### 1.2 主要特性对比

| 特性     | npm    | Yarn v1 | Yarn v4                       | pnpm     |
| -------- | ------ | ------- | ----------------------------- | -------- |
| 安装速度 | 慢     | 较快    | 快                            | 最快     |
| 磁盘空间 | 大     | 大      | 中                            | 小       |
| 依赖管理 | 扁平化 | 扁平化  | PnP (Plug and Play，即插即用) | 硬链接   |
| 安全性   | 一般   | 较好    | 好                            | 最好     |
| Monorepo | 支持   | 支持    | 完整支持                      | 原生支持 |

## 2. 各自优势

### 2.1 npm 优势

```bash
# 1. 生态最完整
npm install react    # 包最全

# 2. 无需额外安装
node -v             # Node.js 自带

# 3. 文档最完善
npm docs react      # 查看文档
```

### 2.2 Yarn v1 优势

```bash
# 1. 并行安装
yarn add react lodash    # 并行下载

# 2. 离线缓存
yarn install --offline   # 支持离线

# 3. 确定性安装
yarn.lock              # 版本锁定
```

### 2.3 Yarn v4 优势

```yaml
# 1. 零安装
enableZeroInstalls: true # 无需 node_modules

# 2. 插件系统
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs

# 3. PnP 机制
nodeLinker: pnp # 更好的依赖管理
```

### 2.4 pnpm 优势

```bash
# 1. 节省空间
.pnpm/                 # 硬链接共享

# 2. 安装速度快
pnpm install          # 并行 + 硬链接

# 3. 依赖安全
node_modules          # 严格的依赖隔离
```

## 3. 使用建议

```bash
# 1. 小型项目
npm/yarn v1          # 简单直接

# 2. 大型项目
pnpm                 # 性能和空间优势

# 3. Monorepo
yarn v4/pnpm        # 完整工具链

# 4. CI/CD
yarn v4             # 零安装
pnpm                # 快速安装
```

## 4. 总结

npm、yarn、pnpm 各有优势，选择合适的工具取决于项目规模和需求。npm 适合小型项目，Yarn v1 和 v4 适合大型项目，pnpm 适合需要高性能和节省空间的项目。

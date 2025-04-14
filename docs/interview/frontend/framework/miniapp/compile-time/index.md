# 小程序编译时

- [template-compiler](./template-compiler.md): 模板解析与编译
- [style-compiler](./style-compiler.md): 样式处理与编译
- [esbuild-plugin-style](./esbuild-plugin-style.md): 样式插件
- [esbuild-plugin-style-compiler](./esbuild-plugin-style-compiler.md): 样式编译器插件
- [expression-compiler](./expression-compiler.md): 表达式编译器
- [transform-wxs-code](./transform-wxs-code.md): 安全脚本转换
- [minipack](./minipack.md): 核心打包模块

主要功能与技术实现

1. 模板编译系统 (template-compiler)
   - 模板解析：将 tyml 文件解析为结构化数据，通过 tokenizer 进行词法分析
   - 指令处理：实现条件渲染、列表渲染等各种指令的解析与处理逻辑
   - 表达式处理：支持数据绑定表达式，通过 parser 构建抽象语法树
   - 代码生成：通过 codeGenerator 将解析结果转化为基础库可运行的 JS 代码
2. 样式编译系统 (style-compiler)
   - 样式解析：支持 CSS、LESS、TYSS 等样式文件的解析
   - 样式处理：实现样式隔离，通过 transformTag 方法将标签选择器转换为属性选择器
   - 冲突处理：提供样式冲突检测与解决机制
   - 样式优化：支持样式文件的依赖分析与缓存优化
3. 构建系统
   - 高性能打包：基于 esbuild + swc 构建，相比传统工具提升构建速度约 10-100 倍
   - 插件系统：通过多个专用插件扩展 esbuild 功能，如 style-compiler-loader 等
   - 缓存机制：实现文件 MD5 缓存，避免重复编译提升构建效率
   - 监听模式：支持文件变更实时重构

开发梗概

1. 架构设计阶段：
   - 采用模块化设计，将编译器拆分为多个独立功能模块
   - 设计插件系统以支持扩展功能
   - 确定核心编译流水线：模板解析 → AST 生成 → 代码转换 → 生成
2. 核心实现阶段：
   - 实现模板编译器，处理从词法分析到代码生成的完整流程
   - 开发样式编译器，解决样式隔离与冲突问题
   - 集成 esbuild 与 swc，实现高性能打包系统
3. 优化阶段：
   - 引入缓存系统，提升编译效率
   - 完善错误处理，将各类编译错误转换为统一格式
   - 优化依赖分析，实现精确的文件监听和增量构建

技术亮点

- 高性能：通过 esbuild + swc 实现的构建系统显著提升了构建速度
- 可扩展性：插件化设计使功能模块可独立演进
- 完整支持：全面支持小程序开发所需的模板、样式、脚本等编译需求
- 开发体验：错误提示友好，支持热更新，大幅提升开发效率

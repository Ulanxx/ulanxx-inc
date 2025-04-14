## 插件化设计与 AppPlugin 架构

### 1. 插件架构概述

小程序采用了一种轻量级、可扩展的插件架构，通过 AppPlugin 类实现了统一的插件管理和上下文注入。这种架构具有以下特点：

- 松耦合设计：插件与核心框架松耦合，可以独立开发和维护
- 统一注册机制：使用一致的插件注册和初始化流程
- 上下文共享：插件可以共享框架核心上下文和服务
- 双端支持：同时支持逻辑层和视图层插件扩展

### 2. 核心组件

#### 2.1 AppPlugin 类

```typescript
export class AppPlugin {
  private readonly context: PluginServiceContext | PluginViewContext;
  private readonly plugins: {};

  constructor(context: PluginServiceContext | PluginViewContext) {
    this.context = context;
    this.plugins = {};
  }

  registry(config: PluginConfig) {
    this.plugins[config.name] = config;
    config.setup(this.context);
  }
}
```

这个简洁的实现是整个插件系统的核心，它：

- 存储框架上下文（context）
- 维护已注册插件列表（plugins）
- 提供插件注册方法（registry）

#### 2.2 插件配置接口

```typescript
export type PluginConfig = {
  name: string;
  setup(plugin: PluginServiceContext | PluginViewContext): void;
};
```

每个插件必须提供：

- 唯一的名称标识
- setup 方法，在插件注册时执行初始化逻辑

#### 2.3 插件上下文

```typescript
export type PluginServiceContext = {
  appServiceHooks: AppServiceHooks;
  ServiceJSBridge: ReturnType<typeof createServiceJSBridge>;
  appEngine?: any;
};

export type PluginViewContext = {
  appViewHooks: AppViewHooks;
  ViewJSBridge: ReturnType<typeof createViewJSBridge>;
  appEngine?: any;
};
```

上下文提供了插件与框架交互所需的核心服务：

- 生命周期钩子（appServiceHooks/appViewHooks）
- 消息通信桥（ServiceJSBridge/ViewJSBridge）
- 应用引擎实例（appEngine）

### 3. 插件集成流程

在框架初始化时，插件通过以下方式集成：

```typescript
// 在 core/src/core/index.ts 中
const appPlugin = new AppPlugin({
  appServiceHooks: appServiceHooks,
  ServiceJSBridge: ServiceJSBridge,
  appEngine,
});

// 注册内置插件
appPlugin.registry(vconsolePlugin());
appPlugin.registry(idePlugin());
appPlugin.registry(auditToolPlugin(getAppApi()));
```

### 4. 插件实现

```typescript
export class AppPlugin {
  private readonly context: PluginServiceContext | PluginViewContext;
  private readonly plugins: {};

  constructor(context: PluginServiceContext | PluginViewContext) {
    this.context = context;
    this.plugins = {};
  }

  registry(config: PluginConfig) {
    this.plugins[config.name] = config;
    config.setup(this.context);
  }
}
```

这个简洁的实现是整个插件系统的核心，它：

- 存储框架上下文（context）
- 维护已注册插件列表（plugins）
- 提供插件注册方法（registry）

#### 4.1 插件配置接口

```typescript
export type PluginConfig = {
  name: string;
  setup(plugin: PluginServiceContext | PluginViewContext): void;
};
```

每个插件必须提供：

- 唯一的名称标识
- setup 方法，在插件注册时执行初始化逻辑

#### 4.3 插件上下文

```typescript
CopyInsert;
export type PluginServiceContext = {
  appServiceHooks: AppServiceHooks;
  ServiceJSBridge: ReturnType<typeof createServiceJSBridge>;
  appEngine?: any;
};

export type PluginViewContext = {
  appViewHooks: AppViewHooks;
  ViewJSBridge: ReturnType<typeof createViewJSBridge>;
  appEngine?: any;
};
```

上下文提供了插件与框架交互所需的核心服务：

- 生命周期钩子（appServiceHooks/appViewHooks）
- 消息通信桥（ServiceJSBridge/ViewJSBridge）
- 应用引擎实例（appEngine）

### 3. 插件集成流程

在框架初始化时，插件通过以下方式集成：

```typescript
// 在 core/src/core/index.ts 中
const appPlugin = new AppPlugin({
  appServiceHooks: appServiceHooks,
  ServiceJSBridge: ServiceJSBridge,
  appEngine,
});

// 注册内置插件
appPlugin.registry(vconsolePlugin());
appPlugin.registry(idePlugin());
appPlugin.registry(auditToolPlugin(getAppApi()));
```

### 4. 插件实现示例

```typescript
// 在 core/src/core/index.ts 中
const appPlugin = new AppPlugin({
  appServiceHooks: appServiceHooks,
  ServiceJSBridge: ServiceJSBridge,
  appEngine,
});

// 注册内置插件
appPlugin.registry(vconsolePlugin());
appPlugin.registry(idePlugin());
appPlugin.registry(auditToolPlugin(getAppApi()));
```

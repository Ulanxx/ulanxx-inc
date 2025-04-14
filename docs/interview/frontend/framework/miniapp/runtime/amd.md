## 自定义 AMD 模块系统

### 1. 为什么使用自定义的 AMD 模块系统

1. 小程序环境特殊性
   1. 隔离执行环境：小程序需要在逻辑层和渲染层间保持严格隔离，AMD 的模块化设计提供了良好的隔离机制
   2. 运行时动态加载：小程序经常需要按需加载子包内容，AMD 的异步特性天然支持这一需求
   3. 受限执行环境：小程序 WebView 环境对 ES Modules 支持有限，需要更可控的方案
2. 兼容性
   1. 不同小程序平台对 JavaScript 模块系统支持程度不同
   2. 自定义 AMD 实现可以抹平差异，提供统一的模块化体验
3. 性能和体积考量
   1. 轻量级实现（核心逻辑仅约 200 行）相比完整的模块加载器更适合小程序环境。
   2. 可以精确控制模块依赖解析和加载时机，优化首屏加载性能。
   3. 支持更精细的代码分割和按需加载策略。

### 2. AMD 模块系统实现

#### 2.1 模块定义与注册

通过 define 方法将模块工厂函数注册到内部模块表中，每个模块保持未初始化状态，直到被首次请求。

```ts
define(path: string | number, fun: ModuleFactory, argsLength?: number) {
  if (!this.moduleArr[path]) {
    this.moduleArr[path] = {
      status: statusDefineFlag,
      factory: fun,
      argsLength: argsLength,
    };
  }
}
```

#### 2.2 懒加载与初始化机制

当 require 调用时，模块才会被加载和初始化。

```ts
require(path: string) {
  // ...
  if (moduleObj.status === statusDefineFlag) {
    const factoryFun = moduleObj.factory;
    // ...
    exports = factoryFun(self.getRequireFun(path), module, module.exports, ...factoryFuncArgs);
    // ...
    moduleObj.status = statusRequireFlag;
  }
  return moduleObj.exports;
}
```

模块仅在首次被 require 时才执行工厂函数，模块执行后将状态标记为已加载，缓存执行结果避免重复初始化。

#### 2.3 模块依赖解析

实现了完整的路径解析算法，支持相对路径、绝对路径，自动处理常见约定，如 index.js 和 .js 扩展名，提供类似 Node.js 的路径解析体验。

```ts
getRequireFun(pathname: string) {
  // ...
  return function (path: string) {
    // 复杂的路径解析逻辑
    // 支持相对路径、绝对路径解析
    // 支持文件夹索引自动解析 (.js, /index.js)
    // ...
  };
}
```

#### 2.4 上下文隔离

通过 scope 和自定义参数实现模块上下文隔离，支持向模块注入特定的运行时变量，如 Promise 或全局 API，隔离不同模块系统，如服务层和渲染层可以有独立的模块实例

```ts
constructor(id: string | any, requireParams: any[] = []) {
  if ('string' !== typeof id) throw new Error('AmdEngine `id` must be a string');
  this.moduleArr = {};
  this.scope = id;
  this.requireParams = requireParams;
  this.requireArgsFactory = undefined;
}
```

### 3. 主要作用与价值

1. 代码组织与模块化
   提供统一的模块化标准，使开发者能按功能拆分代码
   支持复杂的依赖关系管理，避免全局变量污染
   增强代码可维护性和可复用性
2. 性能优化
   按需加载机制避免不必要的代码执行
   路径缓存和模块缓存减少重复解析开销
   支持子包加载与预加载策略，优化用户体验
3. **安全增强**

   - 通过模块隔离减少全局污染，防止变量冲突和命名空间污染
   - **支持注入安全沙箱环境，控制代码执行上下文**

     ```ts
     // 创建隔离的模块执行环境
     const sandboxAmd = new AmdEngine("sandbox", [
       // 注入受限的全局对象
       {
         console: {
           log: console.log,
           error: console.error,
           // 不提供危险方法如 console.clear
         },
         // 提供受限的setTimeout，防止恶意长时间任务
         setTimeout: (callback, time) => {
           const maxTime = Math.min(time, 3000); // 限制最大延迟时间
           return setTimeout(callback, maxTime);
         },
         // 禁止使用危险API
         eval: undefined,
         Function: undefined,
       },
     ]);

     // 注册安全模块
     sandboxAmd.define(
       "safeModule",
       function (require, module, exports, sandbox) {
         // 模块中只能访问到注入的安全对象
         sandbox.console.log("安全执行"); // 可用
         // eval('危险代码') 会失败，因为eval被禁用

         exports.safeMethod = function () {
           // 安全的功能实现
         };
       }
     );
     ```

   - 错误边界限制，防止单个模块崩溃影响整个应用

     ```ts
     // 实现错误边界处理
     try {
       const moduleExports = amd.require("potentially-dangerous-module");
       // 使用模块导出
     } catch (error) {
       console.error("模块加载失败，应用继续运行:", error);
       // 执行降级逻辑
     }
     ```

   - 支持模块访问控制和权限管理

     ```ts
     // 权限控制示例
     const accessControlAmd = new AmdEngine("access-control");

     // 添加权限检查中间件
     accessControlAmd.use(function (modulePath, moduleFactory) {
       // 检查模块路径是否在白名单内
       if (!isAllowedModule(modulePath)) {
         throw new Error(`安全限制: 模块 ${modulePath} 不允许被加载`);
       }
       return moduleFactory;
     });
     ```

### 面试题: 小程序自定义 AMD 模块系统

#### Q1: 在小程序环境中，为什么要使用自定义的 AMD 模块系统而不是 ES Modules？

**答案:**

- 小程序 WebView 环境对 ES Modules 支持有限，尤其是在低版本设备上
- 需要控制模块加载过程，实现按需加载和预加载策略
- 自定义 AMD 可以实现更精细的沙箱隔离，提高安全性

#### Q2: 如何通过 AMD 模块系统增强小程序安全性？请举例说明。

**答案:**

- 通过模块隔离减少全局变量污染，每个模块拥有独立作用域
- 实现安全沙箱注入，限制模块访问的全局 API 和对象
- 可以禁用危险函数（如 eval、Function 构造器等）
- 实现模块访问控制，限制敏感模块的加载权限
- 提供错误边界处理，防止单模块崩溃影响整个应用
- 代码示例（参考上述沙箱注入示例）

#### Q3: 实现一个 AMD 模块系统中的沙箱环境需要考虑哪些方面？

**答案:**

- 全局对象控制：限制或修改模块能访问的全局对象
- 危险 API 屏蔽：移除 eval、Function 等可执行任意代码的 API
- 资源限制：限制 setTimeout/setInterval 最大执行时间
- 网络请求控制：对模块内发起的网络请求进行权限验证
- 错误捕获：实现全局错误处理，防止影响其他模块
- 内存隔离：防止模块间的内存泄露和相互影响

#### Q4: 如何在 AMD 模块系统中实现模块间的权限控制？

**答案:**

- 模块白名单/黑名单机制：预定义允许或禁止加载的模块清单
- 中间件拦截：在模块加载前通过中间件拦截并进行权限检查
- 路径限制：限制模块只能从特定路径加载依赖
- 标签系统：为模块添加安全等级标签，只允许相同或更高安全级别的模块相互依赖
- 签名验证：对关键模块进行签名，加载前验证签名确保模块未被篡改

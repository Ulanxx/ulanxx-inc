# 小程序统一 API 层

### Q1: 什么是小程序的统一 API 层？为什么需要这种设计？

小程序的统一 API 层是对底层各平台原生能力的封装与抽象，提供一致的接口供开发者使用。需要这种设计的原因有：

- 跨平台一致性：抹平不同平台（iOS/Android/Web）间的实现差异，提供统一接口
- 向下兼容：处理不同版本客户端的能力差异，实现版本适配
- 错误处理：统一的错误处理和参数校验机制
- 扩展性：便于添加新功能而不破坏已有接口
- 安全性：对原生能力进行安全控制和权限管理

### Q2: 小程序 API 封装与传统 Web API 封装有何异同？

相同点：

- 都提供对底层能力的封装和抽象
- 都关注开发体验和易用性
- 都需要考虑兼容性和异常处理

不同点：

- 运行环境：Web API 运行在浏览器环境，小程序 API 运行在定制化容器中
- 通信机制：小程序 API 需要通过 JSBridge 与原生通信，而不是直接调用
- 跨线程特性：小程序双线程模型使 API 需要考虑跨线程通信
- 生命周期：小程序 API 需要适配特定的应用和页面生命周期
- 能力范围：小程序可以调用更多设备原生能力，超出传统 Web 范围

### Q3: 如何设计一个可扩展的小程序 API 系统？请描述你的架构设计。

一个良好的小程序 API 系统应具备以下架构特点：

- 分层设计：
  - 接口层：提供开发者直接调用的 API
  - 适配层：处理平台差异性的逻辑
  - 通信层：负责与原生层通信
- 核心层：处理公共逻辑和基础能力
- 插件化架构：
  - 核心 API 与扩展 API 分离
  - 扩展 API 通过插件方式加载
  - 支持按需引入和懒加载
- 统一接口规范：
  - 一致的参数结构（options 对象）
  - 统一的回调模式（success/fail/complete）
  - Promise 化支持
- 版本控制：
  - API 支持版本标记
  - 降级策略和兼容性处理
  - 能力检测机制
- 错误处理：
  - 统一的错误码系统
  - 全局错误拦截和处理
  - 调试和日志机制

### Q4: 请描述小程序框架中的能力扩展体系是如何实现的？

小程序框架的能力扩展体系通常通过以下方式实现：

注入式扩展：

```typescript
// 将扩展API注入到全局对象
function injectExtendApis(globalObject) {
  // 云能力API注入
  globalObject.cloud = createCloudAPI();
  // 支付API注入
  globalObject.payment = createPaymentAPI();
}
```

插件式扩展：

```typescript
class ApiExtension {
  constructor(name, apis) {
    this.name = name;
    this.apis = apis;
  }

  register(apiHost) {
    Object.keys(this.apis).forEach((key) => {
      apiHost[key] = this.apis[key];
    });
  }
}

// 注册扩展
apiManager.registerExtension(new ApiExtension("cloud", cloudApis));
```

代理拦截模式：

```typescript
const apiProxy = new Proxy(baseApis, {
  get(target, property) {
    // 检查扩展API中是否存在
    if (extendedApis[property]) {
      return extendedApis[property];
    }
    return target[property];
  },
});
```

动态加载机制：

```typescript
async function loadApiExtension(name) {
  const extension = await import(`./extensions/${name}.js`);
  registerApi(extension.default);
}
```

### Q5: 在小程序 API 层中，如何处理异步 API 的 Promise 化？

小程序 API 的 Promise 化处理通常有以下几种方式：

包装器模式：

```typescript
function promisify(api) {
  return function (options = {}) {
    return new Promise((resolve, reject) => {
      api({
        ...options,
        success: (res) => {
          resolve(res);
          options.success && options.success(res);
        },
        fail: (err) => {
          reject(err);
          options.fail && options.fail(err);
        },
      });
    });
  };
}

// 使用方式
const request = promisify(ty.request);
```

全局转换：

```typescript
function promisifyAll(apis) {
  const promisifiedApis = {};
  Object.keys(apis).forEach((key) => {
    if (typeof apis[key] === "function") {
      promisifiedApis[key] = promisify(apis[key]);
    }
  });
  return promisifiedApis;
}
```

API 标记和选择性处理

```typescript
const asyncApiList = ["request", "login", "uploadFile"];

function createPromisifiedApis(rawApis) {
  const apis = { ...rawApis };
  asyncApiList.forEach((name) => {
    if (apis[name]) {
      apis[name + "Async"] = promisify(apis[name]);
    }
  });
  return apis;
}
```

### Q6: 如何在小程序 API 层实现向下兼容？如何处理不同平台间的 API 差异？

实现向下兼容和处理平台差异的方法：

能力检测模式：

```typescript
function callAPI(name, options) {
  // 检查该API是否存在
  if (!nativeAPI[name]) {
    // 降级处理
    return fallbackImplementation(name, options);
  }
  // 正常调用
  return nativeAPI[name](options);
}
```

版本比较处理：

```typescript
function callVersionedAPI(name, options) {
  const currentVersion = getContainerVersion();
  const requiredVersion = API_VERSION_MAP[name];

  if (semverCompare(currentVersion, requiredVersion) < 0) {
    // 版本过低，执行降级逻辑
    return polyfill(name, options);
  }

  return nativeAPI[name](options);
}
```

平台适配策略：

```typescript
const platformImplementations = {
  ios: {
    scanCode: iosScanCodeImpl,
  },
  android: {
    scanCode: androidScanCodeImpl,
  },
  web: {
    scanCode: webScanCodePolyfill,
  },
};

function getPlatformAPI(name) {
  const platform = getPlatformType();
  return platformImplementations[platform][name] || defaultImpl[name];
}
```

参数转换：

```typescript
function callCrossplatformAPI(name, options) {
  const platform = getPlatformType();
  // 转换参数格式以适应不同平台
  const adaptedOptions = parameterAdapters[platform](options);

  return nativeAPI[name](adaptedOptions);
}
```

### Q7: 在小程序 API 层面，有哪些性能优化技术？如何减少调用开销？

小程序 API 层面的性能优化技术：

缓存机制：

```typescript
// 实现 API 结果缓存
const apiCache = new Map();

function callWithCache(name, options, cacheTime = 5000) {
  const cacheKey = `${name}_${JSON.stringify(options)}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return Promise.resolve(cached.data);
  }

  return originalAPI[name](options).then((res) => {
    apiCache.set(cacheKey, {
      data: res,
      timestamp: Date.now(),
    });
    return res;
  });
}
```

批量处理：

```typescript
// 收集短时间内的多次请求，合并处理
class BatchProcessor {
  constructor(api, delay = 50) {
    this.queue = [];
    this.timer = null;
    this.api = api;
    this.delay = delay;
  }

  add(params, resolve, reject) {
    this.queue.push({ params, resolve, reject });

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.process();
      }, this.delay);
    }
  }

  process() {
    const batch = this.queue.slice();
    this.queue = [];
    this.timer = null;

    // 批量处理逻辑
    this.api
      .batchProcess(batch.map((item) => item.params))
      .then((results) => {
        results.forEach((result, index) => {
          batch[index].resolve(result);
        });
      })
      .catch((error) => {
        batch.forEach((item) => item.reject(error));
      });
  }
}
```

延迟加载：

```typescript
// 非核心 API 延迟加载
const lazyAPIs = {};

function getLazyAPI(name) {
  if (!lazyAPIs[name]) {
    lazyAPIs[name] = new Proxy({}, {
      get(\_, property) {
        // 首次调用时加载
        if (!lazyAPIs[name].loaded) {
          lazyAPIs[name].loaded = true;
          lazyLoadAPI(name);
        }
        return lazyAPIs[name][property];
      }
    });
  }
  return lazyAPIs[name];
}
```

通信优化：

```typescript
// 优化序列化/反序列化过程
function optimizedCall(name, data) {
  // 避免不必要的深拷贝
  const serializedData = fastSerialize(data);

  return bridge.call(name, serializedData).then((result) => {
    return fastDeserialize(result);
  });
}
```

### Q8: 如何设计一个高效的小程序 API 权限控制系统？

高效的 API 权限控制系统设计：

分层权限模型：

```typescript
const permissionLevels = {
  PUBLIC: 0, // 无需授权
  USER: 1, // 需要用户授权
  SENSITIVE: 2, // 敏感权限，需要额外确认
  SYSTEM: 3, // 系统级权限，限制使用场景
};

const apiPermissions = {
  getLocation: permissionLevels.USER,
  getPhoneNumber: permissionLevels.SENSITIVE,
  getFileSystem: permissionLevels.SYSTEM,
};
```

权限检查代理：

```typescript
function createPermissionProxy(apis) {
  return new Proxy(apis, {
    get(target, property) {
      const api = target[property];
      if (typeof api !== "function") return api;

      return function (options) {
        const permission = apiPermissions[property];

        // 检查权限
        return checkPermission(property, permission).then((granted) => {
          if (granted) {
            return api(options);
          } else {
            throw new Error(`Permission denied: ${property}`);
          }
        });
      };
    },
  });
}
```

权限缓存机制：

```typescript
const permissionCache = new Map();

function checkPermission(name, level) {
  // 检查缓存
  if (permissionCache.has(name)) {
    const cached = permissionCache.get(name);
    if (Date.now() - cached.timestamp < PERMISSION_CACHE_TIME) {
      return Promise.resolve(cached.granted);
    }
  }

  // 实际权限检查
  return performPermissionCheck(name, level).then((granted) => {
    permissionCache.set(name, {
      granted,
      timestamp: Date.now(),
    });
    return granted;
  });
}
```

### Q9: 如何实现一个跨平台的文件系统 API？请详细说明设计思路。

跨平台文件系统 API 设计思路：

统一接口定义：

```typescript
interface FileSystemAPI {
  // 读取文件内容
  readFile(options: {
    filePath: string;
    encoding?: string;
    success?: (res: { data: string | ArrayBuffer }) => void;
    fail?: (err: Error) => void;
    complete?: () => void;
  }): Promise<{ data: string | ArrayBuffer }>;

  // 写入文件
  writeFile(options: {
    filePath: string;
    data: string | ArrayBuffer;
    encoding?: string;
    success?: (res: { errMsg: string }) => void;
    fail?: (err: Error) => void;
    complete?: () => void;
  }): Promise<{ errMsg: string }>;

  // 其他方法：mkdir, rmdir, unlink 等
}
```

平台特定实现：

```typescript
// iOS 实现
const iOSFileSystem: FileSystemAPI = {
  readFile(options) {
    return bridge.invokeNative({
      namespace: "fileSystem",
      method: "readFile",
      args: formatOptions(options),
    });
  },
  // 其他方法实现...
};

// Android 实现
const androidFileSystem: FileSystemAPI = {
  readFile(options) {
    // Android 特有的参数处理
    const androidOptions = {
      ...options,
      androidSpecific: getAndroidPath(options.filePath),
    };

    return bridge.invokeNative({
      namespace: "fileSystem",
      method: "readFile",
      args: formatOptions(androidOptions),
    });
  },
  // 其他方法实现...
};

// Web 实现 (使用 FileSystem API 或降级处理)
const webFileSystem: FileSystemAPI = {
  readFile(options) {
    if (window.FileReader) {
      // 使用 Web API 实现
      return webFileReadImplementation(options);
    } else {
      // 降级到服务器端实现
      return serverSideFileRead(options);
    }
  },
  // 其他方法实现...
};
```

自动平台检测：

```typescript
function createFileSystemAPI(): FileSystemAPI {
  const platform = detectPlatform();

  switch (platform) {
    case "ios":
      return iOSFileSystem;
    case "android":
      return androidFileSystem;
    case "web":
      return webFileSystem;
    default:
      // 默认实现或错误处理
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

// 导出统一 API
export const fileSystem = createFileSystemAPI();
```

路径标准化：

```typescript
function normalizePath(path: string, platform: string): string {
  // 处理不同平台的路径格式
  if (platform === "android") {
    // Android 路径处理
    return path.replace(/^\//, "");
  } else if (platform === "ios") {
    // iOS 路径处理
    return path.startsWith("/") ? path : `/${path}`;
  } else {
    // Web 路径处理
    return path;
  }
}
```

错误码统一：

```typescript
const errorCodeMap = {
  // 原生错误码到统一错误码的映射
  ios: {
    "10001": "FILE_NOT_FOUND",
    "10002": "NO_PERMISSION",
  },
  android: {
    "2001": "FILE_NOT_FOUND",
    "2002": "NO_PERMISSION",
  },
};

function normalizeError(nativeError, platform) {
  const code = nativeError.code;
  const standardCode = errorCodeMap[platform][code] || "UNKNOWN_ERROR";

  return {
    code: standardCode,
    message: getErrorMessage(standardCode),
    originalError: nativeError,
  };
}
```

### Q10: 你如何设计小程序的网络请求 API，以处理不同的认证方式、拦截器和缓存策略？

小程序网络请求 API 的设计：

基础接口设计：

```typescript
interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: object | string | ArrayBuffer;
  header?: Record<string, string>;
  timeout?: number;
  dataType?: "json" | "text" | "base64";
  success?: (res: {
    data: any;
    statusCode: number;
    header: Record<string, string>;
  }) => void;
  fail?: (err: Error) => void;
  complete?: () => void;
}

function request(options: RequestOptions): Promise<any> {
  // 实现逻辑
}
```

拦截器链：

```typescript
interface Interceptor {
  request?: (
    config: RequestOptions
  ) => RequestOptions | Promise<RequestOptions>;
  response?: (response: any) => any | Promise<any>;
  error?: (error: Error) => Error | Promise<Error>;
}

class HttpClient {
  private interceptors: Interceptor[] = [];

  addInterceptor(interceptor: Interceptor) {
    this.interceptors.push(interceptor);
    return this;
  }

  async request(options: RequestOptions) {
    let config = { ...options };

    // 请求拦截
    for (const interceptor of this.interceptors) {
      if (interceptor.request) {
        config = await interceptor.request(config);
      }
    }

    try {
      // 发起请求
      let response = await nativeRequest(config);

      // 响应拦截
      for (const interceptor of this.interceptors) {
        if (interceptor.response) {
          response = await interceptor.response(response);
        }
      }

      return response;
    } catch (error) {
      // 错误拦截
      let processedError = error;

      for (const interceptor of this.interceptors) {
        if (interceptor.error) {
          processedError = await interceptor.error(processedError);
        }
      }

      throw processedError;
    }
  }
}
```

认证机制：

```typescript
// 认证拦截器
const authInterceptor = {
  request: async (config) => {
    const token = await getAuthToken();

    if (token) {
      // 设置认证头
      config.header = config.header || {};
      config.header["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },

  response: async (response) => {
    // 处理 401 错误，尝试刷新 token
    if (response.statusCode === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        // 使用新 token 重试请求
        return httpClient.request({
          ...response.config,
          header: {
            ...response.config.header,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return response;
  },
};

// 添加到 HTTP 客户端
httpClient.addInterceptor(authInterceptor);
```

缓存策略：

```typescript
// 缓存拦截器
const cacheInterceptor = {
  request: async (config) => {
    // 只缓存 GET 请求
    if (config.method !== "GET" || config.noCache) {
      return config;
    }

    const cacheKey = generateCacheKey(config);
    const cachedResponse = await getCachedResponse(cacheKey);

    if (cachedResponse && !isCacheExpired(cachedResponse, config.cacheTime)) {
      // 返回缓存的响应
      return Promise.reject({
        __CACHE__: true,
        data: cachedResponse,
      });
    }

    // 将缓存键附加到配置
    config.__cacheKey = cacheKey;
    return config;
  },

  response: async (response) => {
    // 缓存响应
    if (response.config.__cacheKey && response.statusCode === 200) {
      await cacheResponse(response.config.__cacheKey, response.data);
    }

    return response;
  },

  error: async (error) => {
    // 如果是缓存命中，返回缓存的响应
    if (error.__CACHE__) {
      return error.data;
    }

    throw error;
  },
};

// 添加到 HTTP 客户端
httpClient.addInterceptor(cacheInterceptor);
```

重试机制：

```typescript
// 重试拦截器
const retryInterceptor = {
  error: async (error) => {
    const config = error.config;

    // 检查是否应该重试
    if (!config || !config.retry || config.__retryCount >= config.retry) {
      throw error;
    }

    // 增加重试计数
    config.__retryCount = (config.__retryCount || 0) + 1;

    // 延迟重试
    await new Promise((resolve) =>
      setTimeout(resolve, config.retryDelay || 1000)
    );

    // 重试请求
    return httpClient.request(config);
  },
};

// 添加到 HTTP 客户端
httpClient.addInterceptor(retryInterceptor);
```

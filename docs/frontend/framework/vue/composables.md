# Vue 组合式函数(Composables) - 面试指南

## 1. 组合式函数概述

### 1.1 基本概念

组合式函数(Composables)是 Vue 3 中一种实现逻辑复用的强大方式，它基于组合式 API。组合式函数约定以"use"开头，是一个利用 Vue 的响应式 API 来封装和复用有状态逻辑的函数。

```js
// 🤔 问题：什么是组合式函数？它与 Vue 2 中的 mixins 有何不同？
// ✅ 答案：
// 组合式函数是一个使用 Vue 组合式 API 的函数，用于封装和复用有状态逻辑。
// 与 mixins 相比优势：
// 1. 来源清晰：明确知道变量来自哪个组合式函数
// 2. 命名冲突少：可以通过解构重命名避免冲突
// 3. 更好的类型推导：对 TypeScript 更友好
// 4. 更灵活的组合机制：可以按需引入和使用

// 简单的组合式函数示例
import { ref, onMounted, onUnmounted } from "vue";

export function useMousePosition() {
  // 状态封装在函数内部
  const x = ref(0);
  const y = ref(0);

  // 在组合式函数内部处理副作用
  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  // 生命周期钩子
  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  // 暴露所需的状态
  return { x, y };
}
```

### 1.2 解决 mixins 的痛点

面试题：组合式函数与 mixins 相比有哪些优势？在什么场景下应该选择使用组合式函数？

组合式函数相比于 mixins 方式有以下几个明显优势：

1. 命名冲突少：通过解构重命名可以避免命名冲突
2. 来源清晰：每个变量都明确来自哪个组合式函数
3. 更好的类型推导：对 TypeScript 更友好
4. 更灵活的组合机制：可以按需引入和使用

```js
// 🤔 问题：组合式函数如何解决 mixins 的痛点？
// ✅ 答案：

// Mixins 的问题：
// 1. 命名冲突 - 不同 mixin 可能定义相同名称的属性
// 2. 来源不清晰 - 模板中使用的属性不知道来自哪个 mixin
// 3. 隐式依赖 - mixin 之间可能存在依赖关系
// 4. 类型支持差 - TypeScript 难以为 mixins 提供良好类型支持

// Mixins 方式
const mouseMixin = {
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  mounted() {
    window.addEventListener("mousemove", this.update);
  },
  unmounted() {
    window.removeEventListener("mousemove", this.update);
  },
  methods: {
    update(e) {
      this.x = e.pageX;
      this.y = e.pageY;
    },
  },
};

// 组合式函数方式
function useMousePosition() {
  const x = ref(0);
  const y = ref(0);

  function update(e) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  return { x, y };
}

// 在组件中使用
export default {
  setup() {
    // 清晰的来源，解构命名灵活
    const { x, y } = useMousePosition();
    // 可以通过重命名避免冲突
    const { x: otherX } = useOtherFeature();

    return { x, y, otherX };
  },
};
```

## 创建组合式函数

### 2.1 基本结构

面试题：如何设计一个好的组合式函数？请描述组合式函数的基本结构和设计原则。

组合式函数通常遵循以下结构：

```js
// 🤔 问题：组合式函数的设计原则有哪些？
// ✅ 答案：
// 1. 命名以"use"开头，表明这是一个组合式函数
// 2. 输入：接收必要的参数，提供默认值
// 3. 状态：使用响应式 API 管理内部状态
// 4. 副作用：处理副作用，确保适当清理
// 5. 输出：返回想要暴露的状态和方法

import { ref, watch, onMounted, onUnmounted } from "vue";

export function useFeature(options = {}) {
  // 1. 处理参数，设置默认值
  const { initialValue = 0, step = 1 } = options;

  // 2. 声明响应式状态
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);

  // 3. 声明方法
  function increment() {
    count.value += step;
  }

  function reset() {
    count.value = initialValue;
  }

  // 4. 处理副作用(如果有)
  watch(count, (newValue) => {
    console.log(`Count changed to ${newValue}`);
  });

  // 5. 处理生命周期
  onMounted(() => {
    console.log("Feature initialized");
  });

  onUnmounted(() => {
    console.log("Feature destroyed");
  });

  // 6. 返回暴露的状态和方法
  return {
    count,
    doubled,
    increment,
    reset,
  };
}
```

### 2.2 复用和组合

组合式函数的真正威力在于它们可以相互组合，从而构建更复杂的逻辑。

```js
// 🤔 问题：如何组合多个组合式函数？有什么注意事项？
// ✅ 答案：
// - 可以在一个组合式函数中调用其他组合式函数
// - 注意依赖关系，确保按正确顺序调用
// - 合理处理返回值，避免暴露太多不必要的内容
// - 可以处理不同组合式函数之间的交互

// 基础组合式函数
function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data.value = json;
      loading.value = false;
    })
    .catch((err) => {
      error.value = err;
      loading.value = false;
    });

  return { data, error, loading };
}

// 利用基础组合式函数构建更复杂的功能
function useUserData(userId) {
  // 组合其他组合式函数
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  // 添加额外的处理逻辑
  const formattedName = computed(() => {
    if (!user.value) return "";
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    formattedName,
    loading,
    error,
  };
}

// 在组件中使用
export default {
  setup() {
    const { user, formattedName, loading } = useUserData(42);
    const { x, y } = useMousePosition();

    return {
      user,
      formattedName,
      loading,
      x,
      y,
    };
  },
};
```

## 常见组合式函数模式

### 3.1 状态管理模式

```js
// 🤔 问题：如何使用组合式函数实现状态管理？
// ✅ 答案：
// 可以创建一个共享状态的组合式函数，在不同组件间共享

import { reactive, readonly } from 'vue'

export function useStore() {
  // 私有状态
  const state = reactive({
    count: 0,
    users: []
  })

  // 修改状态的方法
  function increment() {
    state.count++
  }

  function addUser(user) {
    state.users.push(user)
  }

  // 返回只读状态和方法
  return {
    // 使用 readonly 防止外部直接修改状态
    state: readonly(state),
    increment,
    addUser
  }
}

// 在多个组件中使用同一个 store 实例
const store = useStore()

// 组件 A
export default {
  setup() {
    return {
      state: store.state,
      increment: store.increment
    }
  }
}

// 组件 B
export default {
  setup() {
    return {
      users: computed(() => store.state.users),
      addUser: store.addUser
    }
  }
}
```

### 3.2 异步处理模式

面试题：如何使用组合式函数优雅地处理异步操作？请设计一个用于数据获取的组合式函数。

```js
// 🤔 问题：组合式函数如何处理异步操作和错误处理？
// ✅ 答案：

import { ref, watch } from "vue";

export function useAsync(asyncFn, immediate = true) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 异步执行函数
  async function execute(...args) {
    loading.value = true;
    error.value = null;

    try {
      const result = await asyncFn(...args);
      data.value = result;
      return result;
    } catch (e) {
      error.value = e;
      return Promise.reject(e);
    } finally {
      loading.value = false;
    }
  }

  // 首次加载时执行
  if (immediate) {
    execute();
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

// 使用示例
import { useAsync } from "./composables";

export default {
  setup() {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    };

    const {
      data: users,
      loading,
      error,
      execute: refreshUsers,
    } = useAsync(fetchUsers);

    return {
      users,
      loading,
      error,
      refreshUsers,
    };
  },
};
```

### 3.3 事件处理模式

```js
// 🤔 问题：如何使用组合式函数封装事件处理逻辑？
// ✅ 答案：

import { onMounted, onUnmounted } from "vue";

export function useEventListener(target, event, callback) {
  // 如果传入的是 ref，则需要访问其 .value
  const getTarget = () => {
    return typeof target === "function" ? target() : target.value || target;
  };

  onMounted(() => {
    const targetElement = getTarget();
    if (!targetElement) return;

    targetElement.addEventListener(event, callback);
  });

  onUnmounted(() => {
    const targetElement = getTarget();
    if (!targetElement) return;

    targetElement.removeEventListener(event, callback);
  });
}

// 使用示例
import { ref } from "vue";
import { useEventListener } from "./composables";

export default {
  setup() {
    const buttonRef = ref(null);

    // 监听按钮点击
    useEventListener(buttonRef, "click", () => {
      console.log("Button clicked!");
    });

    // 监听全局事件
    useEventListener(window, "resize", () => {
      console.log("Window resized!");
    });

    return {
      buttonRef,
    };
  },
};
```

## 4. 最佳实践与常见问题

### 4.1 组合式函数代码组织

面试题：在大型项目中，如何组织管理众多的组合式函数？有什么最佳实践？

```js
// 🤔 问题：组合式函数的项目结构应该如何组织？
// ✅ 答案：
// 1. 创建专门的 composables 目录
// 2. 按功能域划分组合式函数
// 3. 创建 index.js 统一导出
// 4. 考虑使用 auto-import 插件

// 推荐的项目结构：
// src/
// ├── composables/
// │   ├── index.js          # 统一导出所有组合式函数
// │   ├── user.js           # 用户相关组合式函数
// │   ├── auth.js           # 认证相关组合式函数
// │   ├── form.js           # 表单相关组合式函数
// │   ├── ui/               # UI 相关组合式函数
// │   │   ├── useModal.js
// │   │   ├── useToast.js
// │   │   └── index.js
// │   └── utils/            # 工具类组合式函数
// │       ├── useLocalStorage.js
// │       └── useDebounce.js

// composables/index.js
export * from "./user";
export * from "./auth";
export * from "./form";
export * from "./ui";
export * from "./utils/useLocalStorage";
export * from "./utils/useDebounce";

// 使用示例
import { useUser, useAuth, useForm } from "@/composables";
```

### 4.2 测试组合式函数

```js
// 🤔 问题：如何测试组合式函数？有什么策略和方法？
// ✅ 答案：
// 1. 隔离测试：单独测试组合式函数，不依赖组件
// 2. 模拟生命周期：使用 @vue/test-utils 提供的工具
// 3. 测试返回值：检查返回的状态和方法
// 4. 测试副作用：检查副作用是否按预期执行

// 组合式函数
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubled, increment };
}

// 测试代码
import { useCounter } from "@/composables/useCounter";

describe("useCounter", () => {
  test("should initialize with provided value", () => {
    const { count, doubled } = useCounter(5);
    expect(count.value).toBe(5);
    expect(doubled.value).toBe(10);
  });

  test("should increment counter", () => {
    const { count, increment } = useCounter(1);
    increment();
    expect(count.value).toBe(2);
    increment();
    expect(count.value).toBe(3);
  });
});
```

### 4.3 常见陷阱与解决方案

```js
// 🤔 问题：使用组合式函数时有哪些常见的陷阱和错误？
// ✅ 答案：

// ❌ 陷阱1：在组件外创建共享状态
const count = ref(0); // 所有组件实例会共享此状态！

export function useCounter() {
  function increment() {
    count.value++;
  }
  return { count, increment };
}

// ✅ 解决方案1：将状态声明在函数内部，或使用工厂函数
// 方法A：每次调用创建新的状态
export function useCounter() {
  const count = ref(0);
  function increment() {
    count.value++;
  }
  return { count, increment };
}

// 方法B：工厂函数实现共享状态
export function createSharedCounter() {
  const count = ref(0);
  function increment() {
    count.value++;
  }
  return { count, increment };
}
const sharedCounter = createSharedCounter();

// ❌ 陷阱2：副作用未清理
export function useEventListener(event, callback) {
  // 仅添加监听器，没有移除
  onMounted(() => {
    window.addEventListener(event, callback);
  });
  return {};
}

// ✅ 解决方案2：总是清理副作用
export function useEventListener(event, callback) {
  onMounted(() => {
    window.addEventListener(event, callback);
  });
  onUnmounted(() => {
    window.removeEventListener(event, callback);
  });
  return {};
}

// ❌ 陷阱3：不正确的响应式处理
export function useUserStatus(user) {
  // 没有使用 ref/reactive，非响应式
  let status = "离线";

  if (user.value.active) {
    status = "在线";
  }

  return { status };
}

// ✅ 解决方案3：正确使用响应式API
export function useUserStatus(user) {
  const status = computed(() => {
    return user.value.active ? "在线" : "离线";
  });

  return { status };
}
```

## 5. 面试常见问题与答案

### 5.1 问：组合式函数和 React Hooks 有什么异同？

答：相似点：

- 都是利用函数组合实现逻辑复用
- 都能在多个组件间共享状态和行为
- 都使用钩子函数处理副作用和生命周期

不同点：

- Vue 的组合式函数没有调用顺序的限制，React Hooks 必须顺序一致
- Vue 的响应式系统基于 Proxy，而 React 依赖于组件重渲染
- Vue 允许在条件语句中使用组合式函数，React Hooks 不允许在条件语句中使用

### 5.2 问：为什么组合式函数约定使用 "use" 前缀命名？ 答：使用 "use" 前缀是一种约定，表明这个函数是一个组合式函数，用于逻辑复用。这种命名约定：

- 使代码更具可读性，明确区分普通函数和组合式函数
- 与 React Hooks 保持了一致的命名习惯，便于跨框架开发者理解
- 有利于自动导入工具识别（如 unplugin-auto-import）
- 遵循了 Vue 官方推荐的最佳实践

### 5.3 问：组合式函数中的响应式状态在组件卸载后会发生什么？ 答：当一个组件被卸载时：

- 组合式函数内部的响应式状态（如 ref, reactive）会失去引用，可以被垃圾回收
- 在组合式函数中使用 onUnmounted 注册的清理函数会被执行
- 共享的状态（如从工厂函数返回的单例）会继续存在
- 通过 watchEffect 或 watch 创建的监听器会被自动停止
- 需要确保所有副作用（如事件监听、定时器）都被正确清理

### 5.4 问：使用组合式函数时，如何处理 TypeScript 类型？ 答：组合式函数与 TypeScript 结合的最佳实践：

- 为函数参数和返回值定义明确的类型
- 利用泛型增强复用性
- 为 ref 和 reactive 定义明确的类型
- 使用接口定义复杂对象结构
- 考虑使用 ReturnType 获取组合式函数的返回类型

```ts
// TypeScript 组合式函数示例
interface User {
  id: number;
  name: string;
  email: string;
}

interface UseUserOptions {
  initialId?: number;
  fetchOnCreated?: boolean;
}

export function useUser<T extends User>(options: UseUserOptions = {}) {
  const { initialId = 0, fetchOnCreated = true } = options;

  const user = ref<T | null>(null);
  const loading = ref(fetchOnCreated);
  const error = ref<Error | null>(null);

  async function fetchUser(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      user.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  }

  if (fetchOnCreated && initialId > 0) {
    fetchUser(initialId);
  }

  return {
    user,
    loading,
    error,
    fetchUser,
  };
}

// 使用
const { user, loading, fetchUser } = useUser<AdminUser>({ initialId: 42 });
```

### 5.5 问：如何在组合式函数中处理 SSR（服务端渲染）的问题？ 答：在 SSR 环境下使用组合式函数需要注意：

- 使用 onServerPrefetch 来处理服务端数据预取
- 使用 import.meta.env.SSR 判断当前环境
- 避免在服务端访问仅客户端才有的 API（如 window, document）
- 考虑使用 Vue 提供的 isClient 和 isServer 辅助函数
- 数据获取组合式函数应支持 SSR 环境

```js
import { ref, onServerPrefetch, onMounted } from "vue";

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  // 异步获取数据
  async function fetchData() {
    try {
      const res = await fetch(url);
      data.value = await res.json();
    } catch (err) {
      error.value = err;
    }
  }

  // 在 SSR 期间
  if (import.meta.env.SSR) {
    // 确保数据在 SSR 期间被解析
    onServerPrefetch(fetchData);
  } else {
    // 仅客户端
    onMounted(fetchData);
  }

  return { data, error, fetchData };
}
```

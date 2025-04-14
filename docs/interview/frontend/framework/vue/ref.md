# ref 和 shallowRef

## 区别

`ref`和`shallowRef`是 Vue 3 组合式 API 中用于创建响应式引用的两个函数，它们在响应式跟踪的深度上有明显区别：

**ref**

- 深层响应式: `ref`会递归地将传入对象的所有嵌套属性转换为响应式的
- 用途: 适合需要对整个对象（包括嵌套属性）进行响应式跟踪的场景
- 性能: 对于复杂嵌套对象可能会带来一定的性能开销，因为它会深层转换每个属性

例如：

```typescript
const user = ref({
  name: "张三",
  profile: { age: 25 },
});

// 修改嵌套属性，视图会更新
user.value.profile.age = 26;
```

**shallowRef**

- 浅层响应式: 只有对引用的.value 本身的直接替换会触发响应式更新，对值内部属性的修改不会被跟踪
- 用途: 适合大型数据结构或外部系统管理的数据，例如 API 响应的 JSON 数据
- 性能: 性能更好，特别是对于大型对象，因为它不会递归转换对象的属性

例如：

```typescript
const user = shallowRef({
  name: "张三",
  profile: { age: 25 },
});

// 这不会触发视图更新
user.value.profile.age = 26;

// 这会触发视图更新，替换整个值
user.value = { name: "李四", profile: { age: 30 } };
```

## useFetch 中的应用

```typescript
import { ref, shallowRef, watchEffect, toValue, onUnmounted } from "vue";
import type { Ref } from "vue";

/**
 * 用于处理API请求的可组合函数
 * @param url 请求的URL或返回URL的ref/getter
 * @param options 请求选项
 * @returns 包含数据、加载状态和错误信息的对象
 */
export function useFetch<T>(
  url: string | Ref<string> | (() => string),
  options: RequestInit = {}
) {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<Error | null>(null);
  const loading = ref(false);

  // 用于中止请求的控制器
  const controller = new AbortController();
  options.signal = controller.signal;

  // 用于跟踪当前请求
  let currentUrl: string | null = null;

  // 使用watchEffect自动处理URL变化时的重新请求
  const fetchData = async () => {
    // 重置状态
    data.value = null;
    error.value = null;
    loading.value = true;

    // 获取最新的URL值
    const urlValue = toValue(url);

    try {
      // 避免重复请求相同URL
      if (urlValue === currentUrl) return;
      currentUrl = urlValue;

      const response = await fetch(urlValue, options);

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      data.value = (await response.json()) as T;
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        error.value = e;
      }
    } finally {
      loading.value = false;
    }
  };

  // 使用watchEffect自动处理URL变化时的重新请求
  const stopWatch = watchEffect(fetchData);

  // 在组件卸载时清理资源
  onUnmounted(() => {
    stopWatch();
    controller.abort();
  });

  return { data, error, loading, retry: fetchData };
}
```

在我们的 useFetch 组合式函数中：

```typescript
const data = shallowRef<T | null>(null);
const error = shallowRef<Error | null>(null);
const loading = ref(false);
```

1. 使用 `shallowRef` 存储 `data` 和 `error`：因为 API 响应数据通常是较大的对象，我们不需要跟踪其内部变化，只关心整体替换，这样可以提高性能
2. 使用 `ref` 存储 `loading`：因为它是简单的布尔值，深度和浅层响应式没有区别

### 何时使用哪个？

#### 使用 `ref` 的情况：

- 处理简单数据类型（数字、字符串、布尔值）
- 需要跟踪对象内部属性变化的场景
- 对象结构较小，性能不是主要考虑因素

#### 使用 `shallowRef` 的情况：

- 处理大型数据结构，尤其是 API 返回的数据
- 不需要跟踪对象内部变化的场景
- 性能优化场景，减少不必要的响应式转换
- 与非 Vue 的外部系统集成时

在实际应用中，明智地选择适合场景的响应式 API 可以在保持响应式功能的同时优化性能。

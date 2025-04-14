# setup 函数

## 1.1 与 Vue 2 的选项式 API 相比有什么优势？

```js
// 🤔 问题：setup 函数与 Vue 2 的选项式 API 相比有什么优势？
// ✅ 答案：
// 1. 更好的代码组织：相关逻辑可以放在一起，而非分散在不同选项中
// 2. 更好的逻辑复用：通过组合式函数复用逻辑，替代 mixins
// 3. 更好的类型推导：对 TypeScript 支持更友好
// 4. 更小的生产包体积：代码更容易被压缩和优化

export default {
  setup() {
    // 在这里编写组合式 API 代码
    return {
      // 返回的内容可在模板中使用
    };
  },
};
```

### 1.2 核心特点

> 面试题：setup 函数的核心特点是什么？在使用时需要注意哪些问题？

```js
// 🤔 问题：setup 函数的执行时机和访问限制是什么？
// ✅ 答案：
// 1. 执行时机：在组件实例创建之前执行
// 2. 没有 this：因为在实例创建前执行，所以无法访问组件实例
// 3. 返回类型：可以返回对象或渲染函数
// 4. 参数：接收 props 和 context 两个参数

export default {
  setup(props, context) {
    // props 是响应式的
    console.log(props.title);

    // context 包含三个属性
    const { attrs, slots, emit } = context;

    return {
      // 返回的属性可在模板中访问
    };
  },
};
```

## 2. setup 函数的两种使用方式

### 2.1 作为组件选项

> 面试题：setup 函数的两种使用方式各有什么特点和应用场景？

```js
// 🤔 问题：setup 选项的写法有什么优缺点？
// ✅ 答案：
// 优点：
// 1. 可以与选项式 API 共存，便于渐进式升级
// 2. 可以访问 props 和 emit 事件
// 缺点：
// 1. 需要手动返回暴露给模板的变量和方法
// 2. 在复杂组件中代码可能较长

export default {
  props: {
    title: String,
  },
  setup(props, { emit }) {
    // 1. 导入响应式 API
    const { ref, reactive, computed, watch } = Vue;

    // 2. 定义响应式状态
    const count = ref(0);
    const user = reactive({
      name: "Zhang San",
      age: 30,
    });

    // 3. 定义计算属性
    const doubleCount = computed(() => count.value * 2);

    // 4. 定义方法
    function increment() {
      count.value++;
      emit("increment", count.value);
    }

    // 5. 监听变化
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`);
    });

    // 6. 生命周期钩子
    onMounted(() => {
      console.log("Component mounted");
    });

    // 7. 返回暴露给模板的内容
    return {
      count,
      user,
      doubleCount,
      increment,
    };
  },
};
```

### 2.2 `<script setup>` 语法糖

```ts
// 🤔 问题：`<script setup>` 与普通 setup 函数有什么区别？为什么它是推荐的写法？
// ✅ 答案：
// 1. 更简洁：不需要手动 return，所有顶层变量和导入都会自动暴露给模板
// 2. 更高效：编译时优化，减少运行时开销
// 3. 更好的类型推导：特别是对 defineProps 和 defineEmits
// 4. 更好的 IDE 支持：更准确的自动补全

// <script setup> 基本使用示例
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// Props 定义 - 会自动暴露给模板
const props = defineProps({
  title: String,
  items: Array
})

// Emits 定义
const emit = defineEmits(['update', 'delete'])

// 响应式状态
const count = ref(0)
const user = reactive({
  name: 'Li Si',
  age: 25
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
  emit('update', count.value)
}

// 监听器
watch(count, (newVal) => {
  console.log(`Count is now: ${newVal}`)
})

// 生命周期钩子
onMounted(() => {
  console.log('Component is mounted')
})

// 所有顶层变量和函数都会自动暴露给模板使用
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <ChildComponent :user="user" />
  </div>
</template>
```

## 3. setup 函数中的响应式系统

### 3.1 ref 与 reactive

> 面试题：Vue 3 的 ref 和 reactive 有什么区别？什么场景下应该使用哪一种？

```js
// 🤔 问题：ref 和 reactive 的区别是什么？使用时有什么注意事项？
// ✅ 答案：
// ref:
// - 可以包装任何类型的值，包括基本类型
// - 需要通过 .value 访问和修改值
// - 在模板中会自动解包，不需要 .value
// reactive:
// - 只能用于对象类型（对象、数组、集合类型）
// - 直接使用属性访问和修改
// - 有解构丢失响应性的问题

// ref 示例
const count = ref(0);
count.value++; // 修改需要 .value

// reactive 示例
const state = reactive({
  count: 0,
  user: { name: "Wang Wu" },
});
state.count++; // 直接修改属性

// 解构问题与解决方案
const { count } = reactive({ count: 0 }); // ❌ 解构后丢失响应性
const count = toRef(state, "count"); // ✅ 保持响应性的解构
const { count } = toRefs(state); // ✅ 批量保持响应性的解构
```

### 3.2 计算属性与监听器

```js
// 🤔 问题：在 setup 中如何实现计算属性和侦听器？它们与选项式 API 有什么不同？
// ✅ 答案：
// computed:
// - 可以创建基于其他响应式状态的派生状态
// - 返回一个只读的响应式引用
// - 可以通过 getter 和 setter 创建可写的计算属性
// watch/watchEffect:
// - watch 侦听一个或多个响应式数据源，并在数据源变化时触发回调
// - watchEffect 自动追踪依赖并在依赖变化时执行回调

// 计算属性
const firstName = ref("John");
const lastName = ref("Doe");

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});

// 监听单个数据源
watch(firstName, (newValue, oldValue) => {
  console.log(`firstName changed from ${oldValue} to ${newValue}`);
});

// 监听多个数据源
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log("Name changed");
});

// watchEffect 会自动追踪依赖
watchEffect(() => {
  console.log(`Current name: ${firstName.value} ${lastName.value}`);
});
```

## 4. 组合式函数 (Composables)

> 面试题：Vue 3 中的组合式函数是什么？它如何解决代码复用问题？

```js
// 🤔 问题：什么是组合式函数？它与 Vue 2 的 mixins 相比有什么优势？
// ✅ 答案：
// 组合式函数特点：
// 1. 是一个利用 Vue 组合式 API 的可复用函数
// 2. 命名约定为 useXxx
// 3. 返回一个包含状态和方法的对象
// 4. 可以互相组合，形成强大的逻辑复用机制
// 优势（相比 mixins）：
// 1. 来源清晰：可以明确知道某个属性来自哪个组合式函数
// 2. 命名冲突：通过解构重命名避免冲突
// 3. 更好的类型推导：对 TypeScript 更友好

// 创建一个组合式函数
function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    increment,
    decrement,
  };
}

// 使用组合式函数
import { useCounter } from "./composables/counter";

export default {
  setup() {
    // 在组件中使用组合式函数
    const { count, increment } = useCounter(10);

    // 可以组合多个组合式函数
    const { user, loading } = useUser();

    // 通过解构重命名避免命名冲突
    const { count: messageCount } = useMessages();

    return {
      count,
      messageCount,
      increment,
      user,
      loading,
    };
  },
};
```

## 5. 最佳实践与常见问题

### 5.1 避免的反模式

```js
// 🤔 问题：在使用 setup 函数时有哪些常见的反模式和陷阱？
// ✅ 答案：

// ❌ 错误：在 reactive 对象上解构属性
const state = reactive({ count: 0 });
const { count } = state; // 解构后丢失响应性
count++; // 不会更新视图

// ✅ 正确：使用 toRefs 保持响应性
const state = reactive({ count: 0 });
const { count } = toRefs(state);
count.value++; // 正确更新

// ❌ 错误：直接修改 ref 数组的元素
const list = ref(["A", "B"]);
list.value[0] = "X"; // 视图不会更新

// ✅ 正确：使用数组方法
list.value.splice(0, 1, "X");
// 或者
list.value = ["X", "B"];
```

### 5.2 性能优化建议

```js
// 🤔 问题：使用 setup 时如何优化组件性能？
// ✅ 答案：

// 1. 使用 shallowRef 和 shallowReactive 处理大型对象
const bigObject = shallowRef({
  // 大量的嵌套数据
})

// 2. 使用 v-once 处理一次性渲染的内容
<template>
  <div v-once>{{ staticContent }}</div>
</template>

// 3. 使用计算属性缓存复杂计算
const filteredItems = computed(() => {
  return items.value.filter(item => item.isActive)
})

// 4. 使用 v-memo 减少不必要的模板更新
<div v-memo="[item.id]">
  {{ item.name }}
</div>
```

### 5.3 与 TypeScript 集成

```ts
// 🤔 问题：如何在 setup 中更好地使用 TypeScript？
// ✅ 答案：

// 为 props 定义类型
const props = defineProps<{
  title: string;
  count?: number;
}>();

// 为 emits 定义类型
const emit = defineEmits<{
  (e: "update", value: number): void;
  (e: "delete", id: string): void;
}>();

// 为 ref 定义类型
const name = ref<string>("");

// 为 reactive 定义类型
interface User {
  id: number;
  name: string;
  email: string;
}

const user = reactive<User>({
  id: 1,
  name: "Zhang San",
  email: "zhangsan@example.com",
});

// 为函数返回值定义类型
function fetchUser(): Promise<User> {
  return axios.get("/api/user");
}
```

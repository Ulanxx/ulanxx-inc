# 数组去重问题

数组去重是 JavaScript 面试中的常见问题。本文将介绍多种去重方法及其优缺点。

## 1. 使用 Set

Set 是 ES6 引入的新数据结构，它只存储唯一值。

```javascript
const array = [1, 2, 3, 3, 4, 5, 5];
const uniqueArray = [...new Set(array)];
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

**优点**：

- 代码简洁
- 时间复杂度为 O(n)

**缺点**：

- 无法处理对象类型的元素

## 2. 使用 filter 和 indexOf

通过检查元素第一次出现的位置来判断是否重复。

```javascript
const array = [1, 2, 3, 3, 4, 5, 5];
const uniqueArray = array.filter(
  (item, index) => array.indexOf(item) === index
);
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

**优点**：

- 兼容性好

**缺点**：

- 时间复杂度为 O(n^2)

## 3. 使用 reduce

使用 reduce 方法构建新数组，检查元素是否已存在。

```javascript
const array = [1, 2, 3, 3, 4, 5, 5];
const uniqueArray = array.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

**优点**：

- 可读性好

**缺点**：

- 时间复杂度为 O(n^2)

## 4. 使用对象属性

利用对象属性不能重复的特性。

```javascript
const array = [1, 2, 3, 3, 4, 5, 5];
const obj = {};
array.forEach((item) => (obj[item] = true));
const uniqueArray = Object.keys(obj).map(Number);
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

**优点**：

- 时间复杂度为 O(n)

**缺点**：

- 只能处理字符串和数字类型的元素

## 5. 使用 Map

Map 是 ES6 引入的新数据结构，可以存储任意类型的键。

```javascript
const array = [1, 2, 3, 3, 4, 5, 5];
const map = new Map();
array.forEach((item) => map.set(item, true));
const uniqueArray = [...map.keys()];
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

**优点**：

- 可以处理任意类型的元素
- 时间复杂度为 O(n)

**缺点**：

- 代码稍显复杂

## 总结

| 方法             | 时间复杂度 | 优点         | 缺点                 |
| ---------------- | ---------- | ------------ | -------------------- |
| Set              | O(n)       | 代码简洁     | 无法处理对象         |
| filter + indexOf | O(n^2)     | 兼容性好     | 性能差               |
| reduce           | O(n^2)     | 可读性好     | 性能差               |
| 对象属性         | O(n)       | 性能好       | 只能处理字符串和数字 |
| Map              | O(n)       | 支持任意类型 | 代码稍复杂           |

在实际开发中，应根据具体需求选择合适的方法。如果需要处理任意类型的元素且性能要求高，推荐使用 Map；如果只需要处理基本类型且代码简洁优先，推荐使用 Set。

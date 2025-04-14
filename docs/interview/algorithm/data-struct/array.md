# 数组

## 数组的创建

```js
const arr = [1, 2, 3];
```

不过在算法题中，很多时候我们初始化一个数组时，并不知道它内部元素的情况。这种场景下，要给大家推荐的是构造函数创建数组的方法：

```js
// 创建空数组 = const arr = [];
const arr = new Array();

// 创建长度为 10 的数组
const arr = new Array(10);

// 创建长度为 10 的数组，并填充 1
const arr = new Array(10).fill(1);
```

## 数组的访问和遍历

建议使用 `for` 来遍历数组。

```js
// 访问数组元素
const arr = [1, 2, 3];
console.log(arr[0]); // 1

// 遍历数组
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// 使用forEach遍历数组
arr.forEach((item) => {
  console.log(item);
});

// 使用 map 遍历数组
const newArr = arr.map((item) => {
  return item * 2;
});
console.log(newArr); // [2, 4, 6]

// 使用 for...of 遍历数组
for (const item of arr) {
  console.log(item);
}
```

## 二维数组

矩阵，是二维数组的一种特殊形式。

### 初始化

```js
let arr = [];
for (let i = 0; i < 10; i++) {
  arr[i] = [];
  for (let j = 0; j < 10; j++) {
    arr[i][j] = 0;
  }
}
```

注意：不要使用 `new Array(10).fill(0).map(() => new Array(10).fill(0))` 来初始化二维数组，因为这样初始化出来的二维数组，每一项都是同一个数组。

```js
const arr = new Array(10).fill(0).map(() => new Array(10).fill(0));
console.log(arr[0] === arr[1]); // true
```

### 访问

```js
console.log(arr[0][0]); // 0
```

### 遍历

```js
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    console.log(arr[i][j]);
  }
}
```

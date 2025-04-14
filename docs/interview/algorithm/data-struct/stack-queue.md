# 栈和队列

在 JavaScript 中，栈和队列的实现一般要依赖于数组，所以大家要先掌握数组的基本操作。（实际上，栈和队列的实现，也可以使用链表来实现，只是从前端面试的角度来说，数组更简单，所以大家要先掌握数组的基本操作。）

## 数组的增删

### 数组中增加元素的三种方法

- `unshift`：在数组的开头添加一个或多个元素，并返回数组的新长度。
- `push`：在数组的末尾添加一个或多个元素，并返回数组的新长度。
- `splice`：在数组的指定位置添加或删除元素，并返回被删除的元素。

```js
const arr = [1, 2, 3];
arr.unshift(0); // [0, 1, 2, 3]
arr.push(4); // [0, 1, 2, 3, 4]

// 第一个入参是起始的索引值，第二个入参表示从起始索引开始需要删除的元素个数。
arr.splice(1, 0, "a", "b"); // [0, 'a', 'b', 1, 2, 3, 4]
arr.splice(1, 2); // [0, 3, 4]
```

_注意：`slice` 和 `splice` 的区别在于，`slice` 不会修改原数组，而 `splice` 会修改原数组。`slice` 只有两个入参，分别是起始索引和结束索引，而 `splice` 有三个入参，分别是起始索引、需要删除的元素个数和需要添加的元素。_

### 数组中删除元素的三种方法

- `shift`：删除数组中的第一个元素，并返回被删除的元素。
- `pop`：删除数组中的最后一个元素，并返回被删除的元素。
- `splice`：删除数组中的指定位置的元素，并返回被删除的元素。

```js
const arr = [0, "a", "b", 1, 2, 3, 4];
arr.shift(); // [0, 1, 2, 3, 4]
arr.pop(); // [0, 1, 2, 3]
arr.splice(1, 2); // [0, 3]
```

## 栈的创建

栈是先进后出（FILO）的数据结构，只用数组来实现栈，只需要一个数组，然后通过数组的增删方法来实现栈的入栈和出栈操作。

```js
// 初始状态
const stack = [];

// 入栈
stack.push(1);
stack.push(2);
stack.push(3);

// 出栈
stack.pop(); // 3
stack.pop(); // 2
stack.pop(); // 1

// 栈顶元素
stack[stack.length - 1];

// 栈的长度
stack.length;

// 栈是否为空
stack.length === 0;

// 栈的逐个出栈
while (stack.length) {
  console.log(stack.pop());
}

// 栈的清空
stack = [];
```

## 队列

队列是先进先出（FIFO）的数据结构，只用数组来实现队列，需要两个数组，一个用于入队，一个用于出队。

- 只允许从尾部添加元素
- 只允许从头部移除元素

```js
// 初始状态
const queue = [];

// 入队
queue.push(1);
queue.push(2);
queue.push(3);

// 出队
queue.shift(); // 1
queue.shift(); // 2
queue.shift(); // 3

// 队列的长度
queue.length;

// 队列是否为空
queue.length === 0;

// 队列的逐个出队
while (queue.length) {
  console.log(queue.shift());
}

// 队列的清空
queue = [];
```

# 链表

核心：链表的插入和删除操作效率较高，但访问效率较低；数组的访问效率较高，但插入和删除操作效率较低。

链表和数组都是线性数据结构，但它们在内存中的存储方式不同。链表的元素在内存中是通过指针连接的，可以是不连续的；而数组的元素在内存中是连续的。

由于数组的元素是连续存储的，每个元素的内存地址可以通过其索引直接计算出来，因此数组的访问效率较高。而链表的元素是通过指针连接的，访问某个元素需要从头节点开始逐个遍历，访问效率较低。

## 单链表

单链表的每个节点包含两个部分：

- 数据域：存储节点的值
- 指针域：存储下一个节点的地址

单链表的第一个节点称为头节点，最后一个节点称为尾节点。

单链表的遍历，只能从头节点开始，依次访问链表中的每个节点，直到尾节点。

### 链表结点的创建

```js
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }

  // 添加节点
  add(val) {
    this.next = val;
  }
}
```

### 链表的创建

```js
const head = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);

head.next = node2;
node2.next = node3;

// 1 -> 2 -> 3
```

### 链表元素添加

```js
const head = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);

head.next = node2;
node2.next = node3;

// 1 -> 2 -> 3

// 若要在 2 和 3 之间插入一个 4
const node4 = new ListNode(4);
node2.next = node4;
node4.next = node3;

// 1 -> 2 -> 4 -> 3
```

### 链表元素删除

```js
// 1 -> 2 -> 4 -> 3

// 删除 2
node2.next = node4;

// 1 -> 4 -> 3
```

涉及到链表删除操作的题目中，重点不是定位目标结点，而是定位目标结点的前驱结点。

```js
const deleteNode = (node) => {
  node.next = node.next.next;
};
```

### 链表的遍历

```js
const traverse = (head) => {
  let current = head;
  while (current) {
    current = current.next;
  }
};
```

### 链表和数组的辨析

在大多数编程语言中，数组是一段连续的内存空间，因此在任意位置删除或插入元素时，需要移动该位置之后的所有元素。假设数组长度为 n，删除或插入一个元素的时间复杂度均为 O(n)。

链表的优势在于其元素不需要连续存储，因此在任意位置添加或删除元素时，不需要移动其他元素，操作复杂度为 O(1)。然而，链表的缺点是无法通过索引直接访问元素，查找某个元素时需要从头节点开始逐一遍历，时间复杂度为 O(n)。

# 链表算法题

链表是面试中的高频考点，很多看似复杂的链表问题都可以通过一些经典技巧解决。

## 链表的基本操作

链表节点的基本结构：

```javascript
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}
```

## 高频面试题

### 1. 反转链表

**问题描述**：给你单链表的头节点 `head`，请你反转链表，并返回反转后的链表。

**解题思路**：使用迭代或递归方法反转指针方向。

**迭代解法**：

```javascript
function reverseList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    // 保存下一个节点
    const next = curr.next;
    // 反转指针
    curr.next = prev;
    // 移动指针
    prev = curr;
    curr = next;
  }
  
  return prev; // 新的头节点
}
```

**递归解法**：

```javascript
function reverseList(head) {
  // 基础情况：空链表或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }
  
  // 递归反转子链表
  const newHead = reverseList(head.next);
  
  // 改变指针方向
  head.next.next = head;
  head.next = null;
  
  return newHead;
}
```

**相关面试题**：
1. "如何判断递归和迭代方法的空间复杂度差异？"
2. "如何反转链表的一部分，例如从位置 m 到位置 n？"

### 2. 检测链表中的环

**问题描述**：给定一个链表，判断链表中是否有环。

**解题思路**：使用快慢指针，如果链表中有环，快指针最终会追上慢指针。

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // 慢指针每次移动一步
    fast = fast.next.next;  // 快指针每次移动两步
    
    // 如果有环，快指针最终会追上慢指针
    if (slow === fast) {
      return true;
    }
  }
  
  return false;
}
```

**相关面试题**：
1. "如何找到环的入口节点？"
2. "如果链表中有环，如何计算环的长度？"

### 3. 合并两个有序链表

**问题描述**：将两个升序链表合并为一个新的升序链表并返回。

**解题思路**：使用递归或迭代方法比较两个链表的节点。

```javascript
function mergeTwoLists(l1, l2) {
  // 创建哑节点作为结果链表的头部
  const dummy = new ListNode(-1);
  let current = dummy;
  
  // 比较两个链表的节点
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  // 处理剩余节点
  current.next = l1 !== null ? l1 : l2;
  
  return dummy.next;
}
```

**相关面试题**：
1. "如果要合并k个有序链表，你会如何实现？"
2. "如何优化合并过程的空间复杂度？"

### 4. 寻找链表的中间节点

**问题描述**：给定一个头结点为 `head` 的非空单链表，返回链表的中间结点。

**解题思路**：使用快慢指针，快指针每次走两步，慢指针每次走一步。

```javascript
function middleNode(head) {
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}
```

**相关面试题**：
1. "如果链表长度为偶数，返回的是哪个中间节点？"
2. "如何找到链表的倒数第k个节点？"

### 5. 删除链表的倒数第N个节点

**问题描述**：给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

**解题思路**：使用快慢指针，快指针先走n步，然后两个指针一起走，当快指针到达末尾时，慢指针指向的是要删除节点的前一个节点。

```javascript
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;
  
  let fast = dummy;
  let slow = dummy;
  
  // 快指针先走n+1步
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  
  // 同时移动快慢指针
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  
  // 删除节点
  slow.next = slow.next.next;
  
  return dummy.next;
}
```

**相关面试题**：
1. "如何在不知道链表长度的情况下，找到链表的倒数第k个节点？"
2. "为什么使用dummy节点？不使用会有什么问题？"

### 6. 链表相交

**问题描述**：找到两个单链表相交的起始节点。

**解题思路**：使用两个指针分别遍历两个链表，当一个指针到达末尾时，将其重定向到另一个链表的头部继续遍历。

```javascript
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;
  
  let pA = headA;
  let pB = headB;
  
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }
  
  return pA; // 可能是null或相交节点
}
```

**相关面试题**：
1. "如何判断两个链表是否相交？"
2. "有没有其他方法可以找到相交节点？比较一下不同方法的时间复杂度和空间复杂度。"

## 常见技巧总结

1. **使用哑节点(dummy node)**：处理链表头部变动的问题
2. **快慢指针**：解决环检测、中间节点、倒数第k个节点等问题
3. **双指针**：处理合并、相交等需要同时遍历的问题
4. **递归**：解决反转、合并等具有递归结构的问题

## 复杂度分析

对于链表问题，通常：
- 时间复杂度：O(n)，其中n是链表长度
- 空间复杂度：迭代方法通常是O(1)，递归方法通常是O(n)

# 二叉树算法题

二叉树是算法面试中的重要考点，掌握树的遍历和递归思想是解决树问题的关键。

## 二叉树的基本结构

```javascript
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
```

## 高频面试题

### 1. 二叉树的遍历方式

**问题**：如何实现二叉树的前序、中序、后序和层序遍历？

**解答**：

**前序遍历（根-左-右）**：

```javascript
// 递归方式
function preorderTraversal(root) {
  const result = [];

  function preorder(node) {
    if (!node) return;

    result.push(node.val); // 访问根节点
    preorder(node.left); // 遍历左子树
    preorder(node.right); // 遍历右子树
  }

  preorder(root);
  return result;
}

// 迭代方式
function preorderTraversal(root) {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);

    // 先右后左，保证左子树先被访问
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}
```

**中序遍历（左-根-右）**：

```javascript
// 递归方式
function inorderTraversal(root) {
  const result = [];

  function inorder(node) {
    if (!node) return;

    inorder(node.left); // 遍历左子树
    result.push(node.val); // 访问根节点
    inorder(node.right); // 遍历右子树
  }

  inorder(root);
  return result;
}

// 迭代方式
function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length) {
    // 将所有左子节点入栈
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // 弹出栈顶元素并访问
    current = stack.pop();
    result.push(current.val);

    // 处理右子树
    current = current.right;
  }

  return result;
}
```

**后序遍历（左-右-根）**：

```javascript
// 递归方式
function postorderTraversal(root) {
  const result = [];

  function postorder(node) {
    if (!node) return;

    postorder(node.left); // 遍历左子树
    postorder(node.right); // 遍历右子树
    result.push(node.val); // 访问根节点
  }

  postorder(root);
  return result;
}

// 迭代方式
function postorderTraversal(root) {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    // 将结果插入到数组头部
    result.unshift(node.val);

    // 先左后右，结合unshift操作，实现左-右-根
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return result;
}
```

**层序遍历**：

```javascript
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
```

**相关面试题**：

1. "你能说明前序、中序、后序遍历的应用场景吗？"
2. "如何仅使用前序和中序遍历结果构建二叉树？"
3. "如何不使用递归实现树的遍历？各有什么优缺点？"

### 2. 二叉树的最大深度

**问题**：计算二叉树的最大深度。

**解答**：

```javascript
// 递归解法
function maxDepth(root) {
  if (!root) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
}

// BFS解法
function maxDepth(root) {
  if (!root) return 0;

  const queue = [root];
  let depth = 0;

  while (queue.length) {
    const size = queue.length;
    depth++;

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}
```

**相关面试题**：

1. "如何判断一棵二叉树是否是平衡二叉树？"
2. "深度优先搜索和广度优先搜索在计算树深度时各有什么优缺点？"

### 3. 对称二叉树

**问题**：判断一棵二叉树是否是镜像对称的。

**解答**：

```javascript
function isSymmetric(root) {
  if (!root) return true;

  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    
    return (left.val === right.val) &&
           isMirror(left.left, right.right) &&
           isMirror(left.right, right.left);
  }
  
  return isMirror(root.left, root.right);
}

### 4. 二叉搜索树的操作

**问题**：实现二叉搜索树的基本操作（插入、删除、查找）。

```javascript
// 插入操作
function insert(root, val) {
    if (!root) return new TreeNode(val);
    
    if (val < root.val) {
        root.left = insert(root.left, val);
    } else if (val > root.val) {
        root.right = insert(root.right, val);
    }
    
    return root;
}

// 查找操作
function search(root, val) {
    if (!root || root.val === val) return root;
    
    if (val < root.val) {
        return search(root.left, val);
    } else {
        return search(root.right, val);
    }
}

// 删除操作
function deleteNode(root, key) {
    if (!root) return null;
    
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        // 找到要删除的节点
        
        // 情况1：叶子节点
        if (!root.left && !root.right) {
            return null;
        }
        
        // 情况2：只有一个子节点
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        
        // 情况3：有两个子节点
        let minNode = findMin(root.right);
        root.val = minNode.val;
        root.right = deleteNode(root.right, minNode.val);
    }
    
    return root;
}

function findMin(node) {
    while (node.left) {
        node = node.left;
    }
    return node;
}
```

### 5. 平衡二叉树（AVL树）

**问题**：实现一个平衡二叉树，并实现自平衡操作。

```javascript
class AVLNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    getHeight(node) {
        return node ? node.height : 0;
    }
    
    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }
    
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;
        
        x.right = y;
        y.left = T2;
        
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        
        return x;
    }
    
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;
        
        y.left = x;
        x.right = T2;
        
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        
        return y;
    }
    
    insert(root, val) {
        if (!root) return new AVLNode(val);
        
        if (val < root.val) {
            root.left = this.insert(root.left, val);
        } else if (val > root.val) {
            root.right = this.insert(root.right, val);
        } else {
            return root;
        }
        
        root.height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;
        
        const balance = this.getBalance(root);
        
        // LL情况
        if (balance > 1 && val < root.left.val) {
            return this.rightRotate(root);
        }
        
        // RR情况
        if (balance < -1 && val > root.right.val) {
            return this.leftRotate(root);
        }
        
        // LR情况
        if (balance > 1 && val > root.left.val) {
            root.left = this.leftRotate(root.left);
            return this.rightRotate(root);
        }
        
        // RL情况
        if (balance < -1 && val < root.right.val) {
            root.right = this.rightRotate(root.right);
            return this.leftRotate(root);
        }
        
        return root;
    }
}
```

### 6. 红黑树的基本概念

红黑树是一种自平衡的二叉搜索树，具有以下性质：

1. 节点是红色或黑色
2. 根节点是黑色
3. 所有叶子节点都是黑色
4. 红色节点的子节点都是黑色
5. 从任一节点到其所有后代叶子节点的路径上包含相同数量的黑节点

```javascript
class RBNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.color = 'RED'; // 新插入的节点默认为红色
        this.parent = null;
    }
}
```

## 实际应用场景

1. **文件系统**：
   - 目录结构的表示
   - 文件系统的组织

2. **语法分析**：
   - 编译器的语法树
   - 表达式求值

3. **数据库**：
   - B树和B+树索引
   - 数据库的查询优化

## 面试要点

### 1. 树的基本概念

1. **树的特点**：
   - 层次结构
   - 父子关系
   - 路径和深度

2. **不同类型的树**：
   - 二叉树
   - 二叉搜索树
   - 平衡二叉树
   - 红黑树

### 2. 常见面试问题

1. **树的遍历方式的选择**：
   - 什么时候用前序遍历
   - 什么时候用中序遍历
   - 什么时候用后序遍历
   - 什么时候用层序遍历

2. **平衡树的选择**：
   - AVL树和红黑树的比较
   - 不同场景下的选择
   - 实现的复杂度

3. **递归和迭代的选择**：
   - 递归的优缺点
   - 迭代的优缺点
   - 如何转换

## 总结

树是一个非常重要的数据结构，面试中需要注意：

1. **基础知识**：
   - 理解树的基本概念
   - 掌握不同类型的树
   - 熟练各种遍历方式

2. **实现技巧**：
   - 递归和迭代的转换
   - 平衡树的自平衡
   - 高效的数据结构

3. **应用场景**：
   - 理解实际应用
   - 选择合适的数据结构
   - 性能优化

4. **代码质量**：
   - 代码的可读性
   - 边界情况的处理
   - 错误处理
    if (!left && !right) return true;
    // 其中一个节点为空
    if (!left || !right) return false;

    // 值相等且子树互为镜像
    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  }

  return isMirror(root.left, root.right);
}
```

**相关面试题**：

1. "如何使用迭代而不是递归解决这个问题？"
2. "如果树的节点数非常多，你会如何优化算法？"

### 4. 路径总和

**问题**：给定一棵二叉树和一个目标和，判断是否存在从根节点到叶子节点的路径，使得路径上所有节点值相加等于目标和。

**解答**：

```javascript
function hasPathSum(root, targetSum) {
  if (!root) return false;

  // 如果是叶子节点，检查值是否等于目标和
  if (!root.left && !root.right) {
    return root.val === targetSum;
  }

  // 递归检查左右子树
  return (
    hasPathSum(root.left, targetSum - root.val) ||
    hasPathSum(root.right, targetSum - root.val)
  );
}
```

**相关面试题**：

1. "如何找到所有满足条件的路径，而不仅仅是判断是否存在？"
2. "如果路径不一定从根节点开始，也不一定在叶子节点结束，如何解决？"

### 5. 二叉树的最近公共祖先

**问题**：给定一棵二叉树, 找到该树中两个指定节点的最近公共祖先。

**解答**：

```javascript
function lowestCommonAncestor(root, p, q) {
  // 基本情况
  if (!root || root === p || root === q) {
    return root;
  }

  // 在左右子树中查找p和q
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // 如果p和q分别在左右子树中，则root就是LCA
  if (left && right) {
    return root;
  }

  // 否则，LCA在左子树或右子树中
  return left ? left : right;
}
```

**相关面试题**：

1. "如果树中可能不包含 p 或 q，如何修改算法？"
2. "如果是二叉搜索树，如何优化此算法？"

### 6. 二叉树的序列化与反序列化

**问题**：设计一个算法，将二叉树序列化为字符串，并能将该字符串反序列化为原二叉树。

**解答**：

```javascript
// 序列化
function serialize(root) {
  if (!root) return "null";

  // 前序遍历序列化
  const left = serialize(root.left);
  const right = serialize(root.right);

  return `${root.val},${left},${right}`;
}

// 反序列化
function deserialize(data) {
  const list = data.split(",");

  function buildTree() {
    const val = list.shift();

    if (val === "null") {
      return null;
    }

    const node = new TreeNode(parseInt(val));
    node.left = buildTree();
    node.right = buildTree();

    return node;
  }

  return buildTree();
}
```

**相关面试题**：

1. "除了前序遍历，还可以使用什么遍历方式进行序列化？它们有什么区别？"
2. "如何优化序列化的空间效率？"

## 解题技巧总结

1. **递归思想**：树的问题通常可以通过递归优雅解决
2. **层次遍历**：使用队列实现，解决层级相关问题
3. **前/中/后序遍历**：使用栈实现非递归版本
4. **自顶向下 vs 自底向上**：根据问题特点选择合适的方向
5. **树的构造**：通常需要前序+中序或中序+后序

## 复杂度分析

- **时间复杂度**：通常为 O(n)，其中 n 是树的节点数
- **空间复杂度**：
  - 递归：最坏情况下 O(h)，h 为树高，不平衡树可能达到 O(n)
  - 迭代：通常为 O(w)，w 为树的最大宽度

## 面试常见陷阱

1. 忽略空树或只有一个节点的情况
2. 没有正确处理树不平衡的情况
3. 递归过程中没有合理传递或更新状态

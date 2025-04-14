# 深度优先搜索（DFS）

深度优先搜索（Depth-First Search，DFS）是一种用于遍历或搜索树或图的算法。本文将详细介绍 DFS 的原理、实现和常见应用。

## 1. DFS 基本原理

DFS 从根节点开始，沿着一条路径一直探索到最深处，直到无法继续为止，然后回溯到上一个节点，继续探索其他路径。

### 1.1 DFS 的基本步骤

1. 访问起始节点
2. 递归地访问其未访问的邻接节点
3. 当无法继续访问时，回溯到上一个节点
4. 重复步骤 2-3，直到所有节点都被访问

### 1.2 基本实现

```javascript
// 递归实现
function dfs(root) {
  if (!root) return [];
  
  const result = [];
  
  function traverse(node) {
    result.push(node.val);
    
    if (node.left) traverse(node.left);
    if (node.right) traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// 迭代实现
function dfsIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    
    // 注意：先压入右子节点，这样出栈时就是先左后右
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
}
```

## 2. 二叉树的遍历

### 2.1 前序遍历

```javascript
function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    result.push(node.val);    // 根
    traverse(node.left);      // 左
    traverse(node.right);     // 右
  }
  
  traverse(root);
  return result;
}
```

### 2.2 中序遍历

```javascript
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left);      // 左
    result.push(node.val);    // 根
    traverse(node.right);     // 右
  }
  
  traverse(root);
  return result;
}
```

### 2.3 后序遍历

```javascript
function postorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left);      // 左
    traverse(node.right);     // 右
    result.push(node.val);    // 根
  }
  
  traverse(root);
  return result;
}
```

## 3. 图的遍历

### 3.1 无向图的 DFS

```javascript
function dfsGraph(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfs(node) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  dfs(start);
  return result;
}
```

## 4. 常见面试题

### 4.1 路径总和

**问题描述**：给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

```javascript
function hasPathSum(root, targetSum) {
  if (!root) return false;
  
  function dfs(node, remainingSum) {
    if (!node) return false;
    
    // 如果是叶子节点，检查剩余和是否为0
    if (!node.left && !node.right) {
      return remainingSum === node.val;
    }
    
    // 递归检查左右子树
    return dfs(node.left, remainingSum - node.val) ||
           dfs(node.right, remainingSum - node.val);
  }
  
  return dfs(root, targetSum);
}
```

### 4.2 岛屿数量

**问题描述**：给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿的数量。

```javascript
function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  function dfs(row, col) {
    if (
      row < 0 || row >= rows ||
      col < 0 || col >= cols ||
      grid[row][col] === '0'
    ) {
      return;
    }
    
    // 标记已访问
    grid[row][col] = '0';
    
    // 访问四个方向
    dfs(row + 1, col);
    dfs(row - 1, col);
    dfs(row, col + 1);
    dfs(row, col - 1);
  }
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
}
```

## 5. DFS 的应用场景

1. **树的遍历**：前序、中序、后序遍历
2. **路径搜索**：查找两点之间的路径
3. **连通性问题**：判断图的连通性
4. **回溯算法**：排列、组合、子集等问题
5. **拓扑排序**：检测图中是否有环

## 6. DFS vs BFS

### 6.1 使用 DFS 的优势

1. **空间效率**：在树的深度远小于宽度时，DFS 的空间复杂度更优
2. **适合搜索深层解**：当目标在深层时，DFS 更快找到解
3. **实现简单**：递归实现直观简洁

### 6.2 使用 DFS 的劣势

1. **不保证最短路径**：在无权图中找路径时，不一定是最短的
2. **可能栈溢出**：递归实现时，深度过大可能导致栈溢出

## 7. 面试要点

1. **递归与迭代**：理解两种实现方式的优缺点
2. **访问标记**：避免重复访问和无限循环
3. **空间复杂度**：分析递归调用栈的空间消耗
4. **回溯思想**：理解如何在 DFS 中使用回溯

## 8. 优化技巧

1. **剪枝**：提前结束不可能的搜索分支
2. **记忆化**：存储已计算过的结果
3. **状态压缩**：使用位运算优化状态表示
4. **迭代加深**：限制搜索深度，逐步增加

## 9. 常见问题

### 9.1 如何处理环？

```javascript
function hasCycle(graph) {
  const visited = new Set();
  const path = new Set();
  
  function dfs(node) {
    if (path.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    path.add(node);
    
    for (const neighbor of graph[node]) {
      if (dfs(neighbor)) return true;
    }
    
    path.delete(node);
    return false;
  }
  
  for (const node in graph) {
    if (dfs(node)) return true;
  }
  
  return false;
}
```

### 9.2 如何记录路径？

```javascript
function findPath(graph, start, end) {
  const visited = new Set();
  const path = [];
  
  function dfs(node) {
    visited.add(node);
    path.push(node);
    
    if (node === end) return true;
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor) && dfs(neighbor)) {
        return true;
      }
    }
    
    path.pop();
    return false;
  }
  
  dfs(start);
  return path;
}
```

## 总结

DFS 是一种重要的搜索算法，尤其适合解决需要遍历所有可能性的问题。在面试中，要注意以下几点：

1. **理解本质**：递归回溯的思想
2. **场景应用**：树的遍历、图的搜索、回溯问题
3. **代码实现**：熟练掌握递归和迭代两种实现
4. **优化方法**：掌握剪枝、记忆化等优化技巧

掌握 DFS 不仅能帮助解决树和图的问题，还能为解决回溯、动态规划等问题打下基础。
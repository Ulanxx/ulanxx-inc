# 广度优先搜索（BFS）

广度优先搜索（Breadth-First Search，BFS）是一种图形搜索算法，常用于树或图的遍历。本文将详细介绍 BFS 的原理、实现和常见应用。

## 1. BFS 基本原理

BFS 从根节点开始，首先访问根节点的所有邻接节点，然后按照同样的顺序访问这些邻接节点的邻接节点，以此类推。BFS 使用队列来存储待访问的节点。

### 1.1 BFS 的基本步骤

1. 将起始节点放入队列中
2. 取出队列中的第一个节点，访问它
3. 将该节点的所有未访问的邻接节点加入队列
4. 重复步骤 2-3，直到队列为空

### 1.2 基本实现

```javascript
function bfs(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    
    // 将子节点加入队列
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}
```

## 2. 二叉树的层序遍历

**问题描述**：给定一个二叉树，返回其按层次遍历得到的节点值。

```javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const level = [];
    const levelSize = queue.length;
    
    // 处理当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
```

## 3. 最短路径问题

### 3.1 矩阵中的最短路径

**问题描述**：在一个 0/1 矩阵中，找到从起点到终点的最短路径长度，只能走 0，不能走 1。

```javascript
function shortestPath(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set([`${start[0]},${start[1]}`]);
  
  while (queue.length > 0) {
    const [row, col, distance] = queue.shift();
    
    if (row === end[0] && col === end[1]) {
      return distance;
    }
    
    // 探索四个方向
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      const key = `${newRow},${newCol}`;
      
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 0 &&
        !visited.has(key)
      ) {
        queue.push([newRow, newCol, distance + 1]);
        visited.add(key);
      }
    }
  }
  
  return -1; // 无法到达终点
}
```

## 4. 图的遍历

### 4.1 无向图的连通分量

**问题描述**：给定一个无向图，找到所有的连通分量。

```javascript
function findComponents(graph) {
  const visited = new Set();
  const components = [];
  
  for (const node in graph) {
    if (!visited.has(node)) {
      const component = [];
      const queue = [node];
      
      while (queue.length > 0) {
        const curr = queue.shift();
        if (!visited.has(curr)) {
          visited.add(curr);
          component.push(curr);
          
          // 将邻接节点加入队列
          for (const neighbor of graph[curr]) {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          }
        }
      }
      
      components.push(component);
    }
  }
  
  return components;
}
```

## 5. 常见面试题

### 5.1 二叉树的右视图

**问题描述**：给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

```javascript
function rightSideView(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      // 当前层的最后一个节点就是右视图能看到的节点
      if (i === levelSize - 1) {
        result.push(node.val);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return result;
}
```

### 5.2 完全二叉树的节点个数

```javascript
function countNodes(root) {
  if (!root) return 0;
  
  const queue = [root];
  let count = 0;
  
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return count;
}
```

## 6. BFS 的应用场景

1. **层次遍历**：树的层序遍历、图的层次遍历
2. **最短路径**：无权图中两点之间的最短路径
3. **连通性问题**：判断图的连通性、寻找连通分量
4. **拓扑排序**：课程安排、任务调度等
5. **状态搜索**：迷宫问题、八数码问题等

## 7. BFS vs DFS

### 7.1 使用 BFS 的优势

1. **最短路径**：在无权图中找最短路径时，BFS 总能保证找到最短路径
2. **层次信息**：需要按层处理时，BFS 更直观
3. **搜索范围**：在搜索范围较大时，BFS 更节省空间

### 7.2 使用 BFS 的劣势

1. **空间消耗**：需要存储每一层的节点，空间复杂度较高
2. **不适合深度搜索**：当目标在深层时，BFS 需要遍历很多无关节点

## 8. 面试要点

1. **队列的使用**：理解为什么 BFS 使用队列而不是栈
2. **访问标记**：避免重复访问节点
3. **层次信息**：如何在 BFS 中保持层次信息
4. **空间复杂度**：分析 BFS 的空间消耗
5. **最短路径**：理解 BFS 在最短路径问题中的应用

## 9. 优化技巧

1. **双端队列**：某些情况下可以使用双端队列优化
2. **多源 BFS**：从多个起点同时开始 BFS
3. **方向数组**：使用方向数组简化代码
4. **状态压缩**：在状态搜索问题中使用位运算压缩状态

## 总结

BFS 是一种重要的搜索算法，尤其适合解决最短路径和层次遍历类问题。在面试中，要注意以下几点：

1. **理解原理**：队列的使用、层次遍历的实现
2. **场景应用**：最短路径、层次遍历、连通性问题
3. **代码实现**：熟练掌握基本模板和常见变体
4. **优化方法**：了解不同场景下的优化技巧
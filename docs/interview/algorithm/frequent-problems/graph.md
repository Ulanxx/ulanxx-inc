# 图算法题

图算法是算法面试中的重要考点，本文将介绍常见的图算法及其JavaScript实现。

## 图的基本概念

图是由顶点集合和边集合组成的数据结构，可以表示实体之间的关系。

### 图的表示方法

1. **邻接矩阵**：使用一个二维数组表示顶点间的连接关系。
```javascript
const graph = [
  [0, 1, 0, 1],
  [1, 0, 1, 1],
  [0, 1, 0, 0],
  [1, 1, 0, 0]
];
// graph[i][j] = 1 表示顶点i和顶点j之间有边
// graph[i][j] = 0 表示顶点i和顶点j之间没有边
```

2. **邻接表**：使用数组或哈希表，每个元素是一个链表，表示与该顶点相连的其他顶点。
```javascript
const graph = {
  0: [1, 3],
  1: [0, 2, 3],
  2: [1],
  3: [0, 1]
};
// graph[i] 包含所有与顶点i相邻的顶点
```

## 图的基本遍历

### 1. 深度优先搜索 (DFS)

DFS使用栈（通常是递归调用栈）来遍历图，先尽可能深地探索一条路径。

```javascript
// 邻接表表示的无向图
function dfs(graph, start, visited = new Set()) {
  // 标记当前节点为已访问
  visited.add(start);
  console.log(start); // 访问节点
  
  // 访问所有相邻且未访问过的节点
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// 迭代版DFS
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      console.log(vertex); // 访问节点
      
      // 将未访问的邻居节点入栈
      for (const neighbor of graph[vertex]) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
}
```

### 2. 广度优先搜索 (BFS)

BFS使用队列来逐层遍历图，先访问离起点近的顶点。

```javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    console.log(vertex); // 访问节点
    
    // 将未访问的邻居节点入队
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```

## 高频面试题

### 1. 岛屿数量

**问题描述**：给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿的数量。一个岛被水包围，并且通过水平或垂直方向相邻的陆地连接形成。

**示例**：
```
输入:
[
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出: 1
```

**解题思路**：使用DFS或BFS遍历网格，将连接的陆地标记为已访问，每次找到一块未访问的陆地，岛屿数量加1。

```javascript
function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  // DFS函数，用于探索一个岛屿的所有陆地
  function dfs(row, col) {
    // 边界检查
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === '0') {
      return;
    }
    
    // 标记为已访问 (将陆地设为水)
    grid[row][col] = '0';
    
    // 探索上下左右四个方向
    dfs(row - 1, col); // 上
    dfs(row + 1, col); // 下
    dfs(row, col - 1); // 左
    dfs(row, col + 1); // 右
  }
  
  // 遍历整个网格
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === '1') {
        count++;
        dfs(row, col); // 将当前岛屿的所有陆地都标记为已访问
      }
    }
  }
  
  return count;
}
```

**复杂度分析**：
- 时间复杂度：O(m*n)，其中m和n分别是行数和列数
- 空间复杂度：O(m*n)，最坏情况下递归深度为m*n

**相关面试题**：
1. "如何求解最大岛屿面积？"
2. "如何计算岛屿的周长？"

### 2. 课程表

**问题描述**：现在你总共有 n 门课需要选，记为 0 到 n-1。在选修某些课程之前需要先修完另一些课程，例如，想要学习课程 0，你需要先完成课程 1，我们用一个数组 prerequisites 来表示先修关系，其中 prerequisites[i] = [a, b] 表示如果要学习课程 a 则必须先修课程 b。请判断是否可能完成所有课程的学习？

**示例**：
```
输入: 2, [[1,0]]
输出: true
解释: 总共有 2 门课程。要学习课程 1，你需要先完成课程 0。所以这是可能的。
```

**解题思路**：这是一个典型的有向图检测环路的问题（拓扑排序）。可以使用DFS或BFS来检测图中是否存在环。

```javascript
// 使用BFS（拓扑排序）
function canFinish(numCourses, prerequisites) {
  // 构建邻接表和入度数组
  const graph = Array(numCourses).fill().map(() => []);
  const inDegree = Array(numCourses).fill(0);
  
  // 构建图和计算入度
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  
  // 将所有入度为0的节点入队
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  // 拓扑排序
  let count = 0;
  while (queue.length) {
    const prereq = queue.shift();
    count++;
    
    // 将当前节点的所有邻居的入度减1
    for (const course of graph[prereq]) {
      inDegree[course]--;
      // 如果入度变为0，加入队列
      if (inDegree[course] === 0) {
        queue.push(course);
      }
    }
  }
  
  // 如果所有节点都被访问，则没有环
  return count === numCourses;
}

// 使用DFS检测环
function canFinishDFS(numCourses, prerequisites) {
  // 构建邻接表
  const graph = Array(numCourses).fill().map(() => []);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
  }
  
  // 记录节点的访问状态
  // 0: 未访问, 1: 访问中, 2: 已完成访问
  const visited = Array(numCourses).fill(0);
  
  // DFS检测环
  function hasCycle(node) {
    // 如果节点正在被访问，说明找到了环
    if (visited[node] === 1) return true;
    // 如果节点已经访问完成，不需要再访问
    if (visited[node] === 2) return false;
    
    // 标记为访问中
    visited[node] = 1;
    
    // 访问所有邻居
    for (const neighbor of graph[node]) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }
    
    // 标记为已完成访问
    visited[node] = 2;
    return false;
  }
  
  // 检查每个未访问的节点
  for (let i = 0; i < numCourses; i++) {
    if (visited[i] === 0 && hasCycle(i)) {
      return false; // 存在环，无法完成所有课程
    }
  }
  
  return true; // 不存在环，可以完成所有课程
}
```

**复杂度分析**：
- 时间复杂度：O(V+E)，其中V是节点数，E是边数
- 空间复杂度：O(V+E)

**相关面试题**：
1. "如何输出一个可行的课程学习顺序？"
2. "如果有多组课程，每组内部有依赖关系，如何安排学习顺序？"

### 3. 克隆图

**问题描述**：给你无向连通图中一个节点的引用，请你返回该图的深拷贝（克隆）。图中的每个节点都包含它的值 val（int）和其邻居的列表（list[Node]）。

**示例**：
```
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
```

**解题思路**：使用DFS或BFS遍历原图，同时创建新节点。使用哈希表记录已克隆的节点，避免重复克隆。

```javascript
/**
 * 图节点的定义
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

// DFS克隆图
function cloneGraph(node) {
  if (!node) return null;
  
  const visited = new Map(); // 原节点 -> 克隆节点
  
  function dfs(originalNode) {
    // 如果节点已经被访问过，直接返回其克隆节点
    if (visited.has(originalNode)) {
      return visited.get(originalNode);
    }
    
    // 创建当前节点的克隆
    const cloneNode = new Node(originalNode.val, []);
    visited.set(originalNode, cloneNode);
    
    // 递归克隆所有邻居
    for (const neighbor of originalNode.neighbors) {
      cloneNode.neighbors.push(dfs(neighbor));
    }
    
    return cloneNode;
  }
  
  return dfs(node);
}

// BFS克隆图
function cloneGraphBFS(node) {
  if (!node) return null;
  
  const visited = new Map(); // 原节点 -> 克隆节点
  const queue = [node];
  
  // 创建起始节点的克隆
  visited.set(node, new Node(node.val, []));
  
  while (queue.length) {
    const current = queue.shift();
    
    // 处理所有邻居
    for (const neighbor of current.neighbors) {
      // 如果邻居节点还没有被访问，创建其克隆并加入队列
      if (!visited.has(neighbor)) {
        visited.set(neighbor, new Node(neighbor.val, []));
        queue.push(neighbor);
      }
      
      // 将邻居的克隆添加到当前节点的克隆的邻居列表中
      visited.get(current).neighbors.push(visited.get(neighbor));
    }
  }
  
  return visited.get(node);
}
```

**复杂度分析**：
- 时间复杂度：O(V+E)，其中V是节点数，E是边数
- 空间复杂度：O(V)

**相关面试题**：
1. "如何验证两个图是否同构（结构完全相同）？"
2. "如何只克隆图中的指定子图？"

### 4. 单词接龙

**问题描述**：给定两个单词（beginWord 和 endWord）和一个字典，找到从 beginWord 到 endWord 的最短转换序列的长度。转换需遵循如下规则：每次转换只能改变一个字母。转换过程中的中间单词必须是字典中的单词。

**示例**：
```
输入:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

输出: 5

解释: 一个最短转换序列是 "hit" -> "hot" -> "dot" -> "dog" -> "cog",
     返回它的长度 5。
```

**解题思路**：将单词看作图中的节点，相差一个字母的单词之间有边相连。使用BFS找到最短路径。

```javascript
function ladderLength(beginWord, endWord, wordList) {
  // 如果endWord不在词表中，直接返回0
  if (!wordList.includes(endWord)) return 0;
  
  // 将wordList转换为Set以便快速查找
  const wordSet = new Set(wordList);
  
  // BFS队列
  const queue = [[beginWord, 1]]; // [单词, 转换序列长度]
  const visited = new Set([beginWord]);
  
  while (queue.length) {
    const [word, level] = queue.shift();
    
    // 如果找到endWord，返回转换序列长度
    if (word === endWord) {
      return level;
    }
    
    // 尝试改变单词的每一个字符
    for (let i = 0; i < word.length; i++) {
      // 尝试替换为a-z的每一个字符
      for (let j = 0; j < 26; j++) {
        const newChar = String.fromCharCode(97 + j); // 'a'到'z'
        const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
        
        // 如果新单词在词表中且未被访问过
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          queue.push([newWord, level + 1]);
          visited.add(newWord);
        }
      }
    }
  }
  
  // 如果没有找到转换序列
  return 0;
}
```

**优化版本**：双向BFS。从beginWord和endWord同时开始搜索，当两个搜索相遇时，即找到最短路径。

```javascript
function ladderLengthBidirectional(beginWord, endWord, wordList) {
  // 如果endWord不在词表中，直接返回0
  if (!wordList.includes(endWord)) return 0;
  
  // 将wordList转换为Set以便快速查找
  const wordSet = new Set(wordList);
  
  // 从两端开始BFS
  let beginSet = new Set([beginWord]);
  let endSet = new Set([endWord]);
  
  // 已访问单词集合
  const visited = new Set([beginWord, endWord]);
  
  let level = 1;
  
  // 当两端都有单词待处理时
  while (beginSet.size > 0 && endSet.size > 0) {
    // 选择较小的集合进行扩展，以减少计算量
    if (beginSet.size > endSet.size) {
      [beginSet, endSet] = [endSet, beginSet];
    }
    
    // 下一轮要处理的单词集合
    const nextSet = new Set();
    
    // 处理beginSet中的所有单词
    for (const word of beginSet) {
      // 尝试改变单词的每一个字符
      for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < 26; j++) {
          const newChar = String.fromCharCode(97 + j);
          const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
          
          // 如果从另一端也能到达这个单词，说明找到了路径
          if (endSet.has(newWord)) {
            return level + 1;
          }
          
          // 如果新单词在词表中且未被访问过
          if (wordSet.has(newWord) && !visited.has(newWord)) {
            nextSet.add(newWord);
            visited.add(newWord);
          }
        }
      }
    }
    
    // 更新beginSet为下一轮要处理的单词集合
    beginSet = nextSet;
    level++;
  }
  
  // 如果没有找到转换序列
  return 0;
}
```

**复杂度分析**：
- 时间复杂度：O(N * L^2)，其中N是单词表长度，L是单词长度
- 空间复杂度：O(N)，存储队列和访问过的单词

**相关面试题**：
1. "如何找到所有可能的最短转换序列？"
2. "如果允许添加或删除字符（不仅是替换），算法需要如何修改？"

### 5. 网络延迟时间

**问题描述**：有N个网络节点，用1到N标记。给定一个列表times，表示信号经过有向边的传递时间。times[i] = (u, v, w)，其中u是源节点，v是目标节点，w是一个信号从源节点传递到目标节点的时间。现在，我们向网络中的所有节点发送一个信号。指定源节点K，需要多少时间才能使所有节点都收到信号？如果不能使所有节点接收到信号，返回-1。

**示例**：
```
输入: times = [[2,1,1],[2,3,1],[3,4,1]], N = 4, K = 2
输出: 2
```

**解题思路**：这是一个求最短路径的问题，可以使用Dijkstra算法解决。

```javascript
function networkDelayTime(times, n, k) {
  // 构建邻接表
  const graph = Array(n + 1).fill().map(() => []);
  for (const [u, v, w] of times) {
    graph[u].push([v, w]);
  }
  
  // 使用优先队列（小顶堆）实现Dijkstra算法
  const distances = Array(n + 1).fill(Infinity);
  distances[k] = 0;
  
  const pq = [[0, k]]; // [distance, node]
  
  while (pq.length) {
    const [d, node] = pq.shift();
    
    if (d > distances[node]) continue;
    
    for (const [next, weight] of graph[node]) {
      const newDist = d + weight;
      
      if (newDist < distances[next]) {
        distances[next] = newDist;
        pq.push([newDist, next]);
        pq.sort((a, b) => a[0] - b[0]); // 保持优先队列的顺序
      }
    }
  }
  
  const maxDistance = Math.max(...distances.slice(1));
  return maxDistance === Infinity ? -1 : maxDistance;
}

### 6. 最小生成树（Kruskal算法）

**问题描述**：给定一个带权无向图，找到一个包含所有顶点的最小权重生成树。

```javascript
class UnionFind {
  constructor(size) {
    this.parent = Array.from({length: size}, (_, i) => i);
    this.rank = Array(size).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }
  
  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);
    
    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        [rootX, rootY] = [rootY, rootX];
      }
      this.parent[rootY] = rootX;
      if (this.rank[rootX] === this.rank[rootY]) {
        this.rank[rootX]++;
      }
    }
  }
}

function kruskalMST(n, edges) {
  // 按权重排序边
  edges.sort((a, b) => a[2] - b[2]);
  
  const uf = new UnionFind(n);
  let mstWeight = 0;
  const mstEdges = [];
  
  for (const [u, v, weight] of edges) {
    if (uf.find(u) !== uf.find(v)) {
      uf.union(u, v);
      mstWeight += weight;
      mstEdges.push([u, v, weight]);
    }
  }
  
  return { weight: mstWeight, edges: mstEdges };
}
```

### 7. 强连通分量（Tarjan算法）

**问题描述**：在有向图中找到所有的强连通分量（SCC）。

```javascript
function tarjanSCC(graph) {
  const n = graph.length;
  const dfn = Array(n).fill(-1); // 节点的访问顺序
  const low = Array(n).fill(-1); // 节点能够回溯到的最早的节点
  const inStack = Array(n).fill(false);
  const stack = [];
  let time = 0;
  const SCCs = [];
  
  function dfs(u) {
    dfn[u] = low[u] = time++;
    stack.push(u);
    inStack[u] = true;
    
    for (const v of graph[u]) {
      if (dfn[v] === -1) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (inStack[v]) {
        low[u] = Math.min(low[u], dfn[v]);
      }
    }
    
    if (dfn[u] === low[u]) {
      const scc = [];
      let v;
      do {
        v = stack.pop();
        inStack[v] = false;
        scc.push(v);
      } while (v !== u);
      SCCs.push(scc);
    }
  }
  
  for (let u = 0; u < n; u++) {
    if (dfn[u] === -1) {
      dfs(u);
    }
  }
  
  return SCCs;
}
```

## 图算法的应用场景

1. **社交网络分析**：
   - 好友推荐
   - 社区发现
   - 影响力分析

2. **路由和导航**：
   - GPS导航
   - 网络路由
   - 路径规划

3. **依赖分析**：
   - 项目依赖管理
   - 编译顺序确定
   - 循环依赖检测

## 面试要点

### 1. 图的基本概念

1. **图的类型**：
   - 有向图vs无向图
   - 加权图vs无权图
   - 连通图vs非连通图

2. **图的表示方法**：
   - 邻接矩阵的优缺点
   - 邻接表的优缺点
   - 不同场景下的选择

### 2. 常见面试问题

1. **遍历方式的选择**：
   - DFS vs BFS的应用场景
   - 时间和空间复杂度
   - 实现方式的选择

2. **最短路径算法**：
   - Dijkstra算法的适用场景
   - Bellman-Ford算法的特点
   - Floyd-Warshall算法的应用

3. **图的连通性**：
   - 如何判断图是否连通
   - 如何找到所有连通分量
   - 如何处理强连通分量

## 总结

图算法是一个重要的算法领域，面试中需要注意：

1. **基础知识**：
   - 理解图的基本概念
   - 掌握不同类型的图
   - 熟悉常见算法

2. **实现技巧**：
   - 选择合适的数据结构
   - 处理边界情况
   - 优化算法性能

3. **应用场景**：
   - 理解实际应用
   - 分析问题特点
   - 选择合适算法

4. **代码质量**：
   - 代码的可读性
   - 边界条件处理
   - 错误处理机制
  }
  
  // 初始化距离数组
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0; // 源节点到自身的距离为0
  dist[0] = 0; // 忽略节点0（节点编号从1开始）
  
  // 优先队列（这里用数组模拟）
  const pq = [[0, k]]; // [距离, 节点]
  
  // Dijkstra算法
  while (pq.length) {
    // 找到当前距离最小的节点
    pq.sort((a, b) => a[0] - b[0]);
    const [distance, node] = pq.shift();
    
    // 如果已经找到更短的路径，跳过
    if (distance > dist[node]) continue;
    
    // 更新所有邻居的距离
    for (const [neighbor, weight] of graph[node]) {
      const newDist = distance + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  // 找到最大距离，即最长的最短路径
  const maxDist = Math.max(...dist);
  
  // 如果有节点无法到达，返回-1
  return maxDist === Infinity ? -1 : maxDist;
}
```

**复杂度分析**：
- 时间复杂度：O(E + N log N)，其中E是边数，N是节点数
- 空间复杂度：O(N + E)

**相关面试题**：
1. "如何处理有负权边的情况？"
2. "如何找到延迟时间最小的源节点？"

### 6. 所有可能的路径

**问题描述**：给一个有 n 个节点的有向无环图，找到所有从节点 0 到节点 n-1 的路径并输出（不要求按顺序）。图的表示方法为邻接表。

**示例**：
```
输入: [[1,2], [3], [3], []]
输出: [[0,1,3], [0,2,3]]
解释: 从节点 0 到节点 3 有两条路径: 0 -> 1 -> 3 和 0 -> 2 -> 3
```

**解题思路**：使用DFS遍历图，记录从起点到当前节点的路径。

```javascript
function allPathsSourceTarget(graph) {
  const n = graph.length;
  const result = [];
  
  // DFS函数，path记录当前路径
  function dfs(node, path) {
    // 如果到达目标节点，将当前路径添加到结果中
    if (node === n - 1) {
      result.push([...path]);
      return;
    }
    
    // 访问所有邻居
    for (const neighbor of graph[node]) {
      path.push(neighbor);
      dfs(neighbor, path);
      path.pop(); // 回溯
    }
  }
  
  dfs(0, [0]); // 从节点0开始，初始路径包含节点0
  return result;
}
```

**复杂度分析**：
- 时间复杂度：O(2^n * n)，最坏情况下可能有2^n条路径
- 空间复杂度：O(n)，递归深度最多为n

**相关面试题**：
1. "如何找到从起点到终点的最短路径？"
2. "如果图中存在环，如何修改算法？"

## 图算法的应用场景

1. **社交网络分析**：寻找朋友关系，社区发现
2. **网页排名**：PageRank算法
3. **路径规划**：导航系统中的最短路径
4. **依赖分析**：软件包依赖，构建系统
5. **网络流**：最大流问题，二分图匹配

## 常见图算法总结

1. **遍历算法**：
   - 深度优先搜索 (DFS)
   - 广度优先搜索 (BFS)

2. **最短路径算法**：
   - Dijkstra算法（非负权重）
   - Bellman-Ford算法（可处理负权重）
   - Floyd-Warshall算法（所有节点对之间的最短路径）

3. **最小生成树算法**：
   - Prim算法
   - Kruskal算法

4. **拓扑排序**：
   - Kahn算法（BFS）
   - DFS拓扑排序

5. **连通性算法**：
   - 强连通分量 (Kosaraju算法)
   - 割点和桥 (Tarjan算法)

## 面试中的常见问题

1. **DFS vs BFS**：
   - "在什么情况下你会选择DFS而不是BFS？"
   - "DFS和BFS在空间复杂度上有什么区别？"

2. **最短路径**：
   - "如何处理边权重为负的情况？"
   - "Dijkstra算法的优化方法有哪些？"

3. **图的表示**：
   - "邻接矩阵和邻接表各有什么优缺点？"
   - "在实际应用中如何选择适合的图表示方法？"

4. **算法复杂度**：
   - "在最坏情况下，BFS和DFS的时间复杂度是多少？"
   - "如何优化图算法以处理大规模图？"

## 实际应用中的优化技巧

1. **使用适当的数据结构**：例如，在Dijkstra算法中使用优先队列
2. **避免重复访问**：使用visited集合
3. **双向搜索**：从起点和终点同时开始搜索
4. **启发式搜索**：使用A*算法等启发式方法
5. **剪枝技术**：提前终止无法得到更优解的搜索分支

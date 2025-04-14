# 贪心算法

贪心算法（Greedy Algorithm）是一种在每一步选择中都采取当前状态下最好或最优的选择，从而希望导致结果是最好或最优的算法。

## 贪心算法的基本思想

贪心算法的核心是通过局部最优选择，来达到全局最优。它不像动态规划那样会考虑所有可能的解，而是在每一步都做出当前看起来最好的选择。

### 贪心算法的特点

1. 贪心选择性质：每一步的最优解都包含上一步的最优解
2. 最优子结构：问题的最优解包含子问题的最优解
3. 无后效性：某个状态以后的过程不会影响以前的状态

## 经典贪心问题

### 1. 活动选择问题

**问题描述**：给定 n 个活动，每个活动都有一个开始时间和结束时间。要求选择尽可能多的活动，使得所选活动互不重叠。

```javascript
function activitySelection(start, end) {
    // 按结束时间排序
    const activities = start.map((s, i) => ({
        start: s,
        end: end[i],
        index: i
    })).sort((a, b) => a.end - b.end);
    
    const result = [activities[0]];
    let lastEnd = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEnd) {
            result.push(activities[i]);
            lastEnd = activities[i].end;
        }
    }
    
    return result.map(activity => activity.index);
}
```

**面试要点**：
1. 为什么按结束时间排序是正确的？
2. 如何处理活动时间相等的情况？

### 2. 区间调度问题

**问题描述**：给定一系列区间 [start, end]，求最多能选出多少个互不重叠的区间。

```javascript
function intervalScheduling(intervals) {
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    
    return count;
}
```

**面试要点**：
1. 为什么不按开始时间排序？
2. 如何找出具体的区间序列？

### 3. 分发糖果

**问题描述**：n 个孩子站成一排，每个孩子有一个评分。要求每个孩子至少分得一颗糖果，且评分更高的孩子必须比他相邻的孩子获得更多的糖果。求最少需要多少颗糖果。

```javascript
function candy(ratings) {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    
    // 从左向右遍历
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    
    // 从右向左遍历
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    
    return candies.reduce((sum, num) => sum + num, 0);
}
```

### 4. 跳跃游戏

**问题描述**：给定一个非负整数数组，你最初位于数组的第一个位置。数组中的每个元素代表你在该位置可以跳跃的最大长度。判断你是否能够到达最后一个位置。

```javascript
function canJump(nums) {
    let maxReach = 0;
    
    for (let i = 0; i <= maxReach && i < nums.length; i++) {
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    
    return maxReach >= nums.length - 1;
}
```

**面试要点**：
1. 如何处理数组中有0的情况？
2. 如何优化时间复杂度？

## 贪心算法的应用场景

1. **任务调度**：
   - 作业调度
   - 会议室分配
   - CPU时间片分配

2. **网络设计**：
   - 最小生成树（Prim算法）
   - 最短路径（Dijkstra算法）
   - 网络流量控制

3. **资源分配**：
   - 内存分配
   - 磁盘调度
   - 带宽分配

4. **金融决策**：
   - 投资策略
   - 风险管理
   - 资产配置

## 面试常见问题

### 1. 如何判断问题是否适合使用贪心算法？

贪心算法适用的问题通常具有以下特征：
1. 具有贪心选择性质
2. 具有最优子结构
3. 局部最优解能导致全局最优解

### 2. 贪心算法与动态规划的区别？

1. **决策方式**：
   - 贪心：每步都做出当前最优选择
   - 动态规划：考虑所有可能的选择

2. **时间复杂度**：
   - 贪心：通常更低
   - 动态规划：通常更高

3. **适用范围**：
   - 贪心：适用范围较窄
   - 动态规划：适用范围更广

### 3. 贪心算法的优缺点？

**优点**：
1. 简单直观
2. 时间复杂度低
3. 易于实现

**缺点**：
1. 不一定能得到全局最优解
2. 适用范围有限
3. 需要证明其正确性

## 代码模板总结

1. **基本模板**：
```javascript
function greedyTemplate(arr) {
    // 1. 排序（如果需要）
    arr.sort((a, b) => someComparison(a, b));
    
    // 2. 初始化结果
    let result = initialValue;
    
    // 3. 贪心选择
    for (let i = 0; i < arr.length; i++) {
        if (isValid(arr[i])) {
            result = updateResult(result, arr[i]);
        }
    }
    
    return result;
}
```

2. **区间问题模板**：
```javascript
function intervalTemplate(intervals) {
    // 1. 按照特定规则排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    // 2. 初始化
    let result = 1;
    let end = intervals[0][1];
    
    // 3. 贪心选择
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= end) {
            result++;
            end = intervals[i][1];
        }
    }
    
    return result;
}
```

## 总结

贪心算法是一种重要的算法设计方法，在面试中要注意：

1. **问题分析**：
   - 证明贪心策略的正确性
   - 分析局部最优到全局最优的推导

2. **解题技巧**：
   - 合理设计贪心策略
   - 正确处理边界情况
   - 注意特殊情况

3. **代码实现**：
   - 保持代码简洁
   - 注意时间复杂度
   - 考虑空间优化

4. **实际应用**：
   - 理解应用场景
   - 掌握常见变体
   - 灵活运用策略

# 动态规划算法题

动态规划(Dynamic Programming，简称DP)是一种通过将复杂问题分解为更简单的子问题来解决问题的方法。它特别适合有重叠子问题和最优子结构的问题。

## 动态规划的基本思想

动态规划的核心思想是找到问题的状态表示和状态转移方程，通过解决子问题来构建整体解决方案。

## 动态规划的基本步骤

1. 定义状态（确定DP数组的含义）
2. 确定状态转移方程
3. 初始化状态（边界条件）
4. 确定计算顺序
5. 返回最终结果

## 高频面试题

### 1. 斐波那契数列

**问题描述**：计算斐波那契数列的第n个数。
- F(0) = 0, F(1) = 1
- F(n) = F(n-1) + F(n-2), 其中 n > 1

**解题思路**：使用动态规划避免递归的重复计算。

```javascript
// 递归解法（效率低）
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 动态规划解法
function fibonacci(n) {
  if (n <= 1) return n;
  
  // 定义DP数组
  const dp = new Array(n + 1);
  
  // 初始化
  dp[0] = 0;
  dp[1] = 1;
  
  // 状态转移
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 空间优化解法
function fibOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}
```

**复杂度分析**：
- 递归解法：时间复杂度O(2^n)，空间复杂度O(n)
- DP解法：时间复杂度O(n)，空间复杂度O(n)
- 优化解法：时间复杂度O(n)，空间复杂度O(1)

**相关面试题**：
1. "如何优化斐波那契数列的空间复杂度？"
2. "斐波那契数列有哪些实际应用？"

### 2. 爬楼梯

**问题描述**：假设你正在爬楼梯，需要n阶才能到达楼顶。每次你可以爬1或2个台阶，你有多少种不同的方法可以爬到楼顶？

**解题思路**：到达第n阶的方法数等于到达第n-1阶的方法数加上到达第n-2阶的方法数。

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  
  // 定义DP数组，dp[i]表示爬到第i阶的方法数
  const dp = new Array(n + 1);
  
  // 初始化
  dp[1] = 1; // 爬到第1阶有1种方法
  dp[2] = 2; // 爬到第2阶有2种方法
  
  // 状态转移
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 空间优化版本
function climbStairsOptimized(n) {
  if (n <= 2) return n;
  
  let prev = 1;
  let curr = 2;
  
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：优化版O(1)，未优化版O(n)

**相关面试题**：
1. "如果每次可以爬1、2或3个台阶，如何修改算法？"
2. "你注意到这个问题与斐波那契数列的关系了吗？"

### 3. 最大子数组和

**问题描述**：给定一个整数数组nums，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**解题思路**：使用动态规划，dp[i]表示以第i个元素结尾的连续子数组的最大和。

```javascript
function maxSubArray(nums) {
  if (nums.length === 0) return 0;
  
  // dp[i]表示以第i个元素结尾的连续子数组的最大和
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  let maxSum = dp[0];
  
  for (let i = 1; i < nums.length; i++) {
    // 状态转移方程：要么将当前元素加入前面的子数组，要么重新开始一个子数组
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    maxSum = Math.max(maxSum, dp[i]);
  }
  
  return maxSum;
}

// 空间优化版本
function maxSubArrayOptimized(nums) {
  if (nums.length === 0) return 0;
  
  let currentMax = nums[0];
  let globalMax = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  
  return globalMax;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：优化版O(1)，未优化版O(n)

**相关面试题**：
1. "如何找到具有最大和的连续子数组本身，而不仅仅是和？"
2. "这个问题可以使用分治法解决吗？比较两种方法的复杂度。"

### 4. 打家劫舍

**问题描述**：你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

**解题思路**：定义dp[i]为偷到第i个房子时能获得的最大金额。

```javascript
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  // dp[i]表示偷到第i个房子时能获得的最大金额
  const dp = new Array(nums.length);
  
  // 初始化
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  
  // 状态转移
  for (let i = 2; i < nums.length; i++) {
    // 两种选择：偷当前房子（dp[i-2] + nums[i]）或不偷当前房子（dp[i-1]）
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }
  
  return dp[nums.length - 1];
}

// 空间优化版本
function robOptimized(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);
  
  for (let i = 2; i < nums.length; i++) {
    const curr = Math.max(prev2 + nums[i], prev1);
    prev2 = prev1;
    prev1 = curr;
  }
  
  return prev1;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：优化版O(1)，未优化版O(n)

**相关面试题**：
1. "如果房屋是环形排列的，如何修改算法？"
2. "如果每个房屋除了金额还有其他限制条件，如何修改算法？"

### 5. 背包问题

**问题描述**：给定 n 个物品，每个物品都有自己的重量和价值。在限制的总重量内，我们如何选择，才能使得物品的总价值最高。

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][j] 表示前 i 个物品，背包容量为 j 时的最大价值
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= capacity; j++) {
      if (weights[i-1] <= j) {
        // 可以选择放入第 i 个物品
        dp[i][j] = Math.max(
          dp[i-1][j],  // 不放入
          dp[i-1][j-weights[i-1]] + values[i-1]  // 放入
        );
      } else {
        // 不能放入第 i 个物品
        dp[i][j] = dp[i-1][j];
      }
    }
  }
  
  return dp[n][capacity];
}

// 空间优化版本
function knapsackOptimized(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    for (let j = capacity; j >= weights[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j-weights[i]] + values[i]);
    }
  }
  
  return dp[capacity];
}
```

**复杂度分析**：
- 时间复杂度：O(n*capacity)
- 空间复杂度：优化版O(capacity)，未优化版O(n*capacity)

**相关面试题**：
1. "如何输出背包中放入了哪些物品？"
2. "如果物品可以重复选择，如何修改算法？"

### 6. 最长公共子序列

**问题描述**：给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}
```

**复杂度分析**：
- 时间复杂度：O(m*n)
- 空间复杂度：O(m*n)

**相关面试题**：
1. "如何输出最长公共子序列本身？"
2. "如果要求子序列必须连续，如何修改算法？"

## 实际应用场景

1. **路由规划**：
   - GPS导航中的最短路径规划
   - 网络流量路由优化

2. **生物信息学**：
   - DNA序列对齐
   - 蛇的基因序列分析

3. **金融应用**：
   - 投资组合优化
   - 风险管理策略

4. **计算机图形学**：
   - 图像分割
   - 路径规划

## 面试要点

1. **状态定义**：
   - 明确状态的含义
   - 选择合适的状态表示

2. **状态转移**：
   - 分析问题中的选择
   - 确定状态间的关系

3. **边界情况**：
   - 初始化条件
   - 特殊情况处理

4. **优化方法**：
   - 空间优化
   - 滚动数组
   - 状态压缩

## 常见面试题

1. **如何判断一个问题是否适合用动态规划？**
   - 最优子结构
   - 重叠子问题
   - 多阶段决策

2. **动态规划和其他算法的区别？**
   - 与贪心算法的区别
   - 与分治算法的区别
   - 与回溯算法的区别

3. **如何优化动态规划的空间复杂度？**
   - 滚动数组
   - 状态压缩
   - 内存复用

## 代码模板总结

1. **基本模板**：
```javascript
// 初始化DP数组
const dp = Array(n + 1).fill(0);

// 初始化边界条件
dp[0] = initialValue;

// 状态转移
for (let i = 1; i <= n; i++) {
  dp[i] = someFunction(dp[i-1]);
}
```

2. **二维DP模板**：
```javascript
// 初始化二维DP数组
const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

// 初始化边界条件
for (let i = 0; i <= m; i++) dp[i][0] = initialValue1;
for (let j = 0; j <= n; j++) dp[0][j] = initialValue2;

// 状态转移
for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    dp[i][j] = someFunction(dp[i-1][j], dp[i][j-1]);
  }
}
```

3. **空间优化模板**：
```javascript
// 使用滚动数组
let prev = initialValue1;
let curr = initialValue2;

for (let i = 2; i <= n; i++) {
  const next = someFunction(prev, curr);
  prev = curr;
  curr = next;
}
```

## 总结

动态规划是一个强大的算法设计方法，它的核心思想是：

1. **问题分解**：
   - 将原问题分解为子问题
   - 确定问题之间的关系

2. **状态设计**：
   - 选择合适的状态表示
   - 确定状态转移方程

3. **优化方法**：
   - 空间优化
   - 时间优化
   - 代码简化

在面试中，要特别注意：

1. **问题分析**：
   - 准确理解题意
   - 识别动态规划特征

2. **解题步骤**：
   - 明确状态定义
   - 推导转移方程
   - 注意边界情况

3. **代码实现**：
   - 结构清晰
   - 注释完善
   - 测试用例}

// 空间优化版本
function robOptimized(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);
  
  for (let i = 2; i < nums.length; i++) {
    const current = Math.max(prev2 + nums[i], prev1);
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：优化版O(1)，未优化版O(n)

**相关面试题**：
1. "如果房子排成一个环形，首尾相连，如何修改算法？"
2. "如何输出具体的偷窃方案，而不仅仅是最大金额？"

### 5. 最长递增子序列

**问题描述**：给定一个无序的整数数组，找到其中最长上升子序列的长度。（子序列不要求连续）

**解题思路**：dp[i]表示以第i个元素结尾的最长递增子序列的长度。

```javascript
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  
  // dp[i]表示以第i个元素结尾的最长递增子序列的长度
  const dp = new Array(nums.length).fill(1);
  let maxLength = 1;
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      // 如果当前元素大于前面的元素，可以将当前元素加到以j结尾的子序列后面
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }
  
  return maxLength;
}

// 优化方法：使用二分查找（时间复杂度O(nlogn)）
function lengthOfLISOptimized(nums) {
  if (nums.length === 0) return 0;
  
  // tails[i]表示长度为i+1的递增子序列的最小结尾元素
  const tails = [];
  
  for (const num of nums) {
    // 二分查找num应该插入的位置
    let left = 0;
    let right = tails.length;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    // 如果找到了合适的位置，更新tails数组
    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }
  
  return tails.length;
}
```

**复杂度分析**：
- DP解法：时间复杂度O(n²)，空间复杂度O(n)
- 优化解法：时间复杂度O(nlogn)，空间复杂度O(n)

**相关面试题**：
1. "如何输出最长递增子序列本身，而不仅仅是长度？"
2. "如何解决最长递减子序列问题？它与递增子序列有什么关系？"

### 6. 编辑距离

**问题描述**：给你两个单词word1和word2，请你计算出将word1转换成word2所使用的最少操作数。你可以对一个单词进行三种操作：插入一个字符、删除一个字符、替换一个字符。

**解题思路**：使用二维DP，dp[i][j]表示word1的前i个字符转换到word2的前j个字符需要的最少操作数。

```javascript
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  
  // 如果有一个字符串为空，直接返回另一个字符串的长度
  if (m === 0) return n;
  if (n === 0) return m;
  
  // 创建DP数组，dp[i][j]表示word1前i个字符转换到word2前j个字符所需的最少操作数
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // 初始化边界情况
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // 将word1的前i个字符转换为空字符串需要i次删除操作
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // 将空字符串转换为word2的前j个字符需要j次插入操作
  }
  
  // 填充DP数组
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // 如果当前字符相同，不需要额外操作
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 取三种操作（插入、删除、替换）的最小值 + 1
        dp[i][j] = Math.min(
          dp[i - 1][j],     // 删除word1当前字符
          dp[i][j - 1],     // 插入word2当前字符
          dp[i - 1][j - 1]  // 替换当前字符
        ) + 1;
      }
    }
  }
  
  return dp[m][n];
}
```

**复杂度分析**：
- 时间复杂度：O(m*n)，其中m和n分别是两个字符串的长度
- 空间复杂度：O(m*n)

**相关面试题**：
1. "如何优化编辑距离算法的空间复杂度？"
2. "如何输出从word1到word2的具体操作序列？"

### 7. 零钱兑换

**问题描述**：给定不同面额的硬币coins和一个总金额amount，计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回-1。

**解题思路**：dp[i]表示凑成金额i所需的最少硬币数。

```javascript
function coinChange(coins, amount) {
  // dp[i]表示凑成金额i所需的最少硬币数
  const dp = new Array(amount + 1).fill(Infinity);
  
  // 初始化：凑成金额0需要0个硬币
  dp[0] = 0;
  
  // 遍历每种硬币
  for (const coin of coins) {
    // 更新dp数组
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  
  // 如果dp[amount]仍然是Infinity，表示无法凑出amount
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**复杂度分析**：
- 时间复杂度：O(amount * n)，其中n是硬币的种类数
- 空间复杂度：O(amount)

**相关面试题**：
1. "如何输出具体的硬币组合，而不仅仅是最少硬币数？"
2. "如何解决零钱兑换的组合总数问题？"

### 8. 背包问题

#### 0-1背包问题

**问题描述**：有n个物品，每个物品有一个重量weight[i]和一个价值value[i]。现在有一个容量为W的背包，问如何选择装入背包的物品，使得背包内物品的总价值最大？每个物品只能选择一次。

**解题思路**：使用二维DP，dp[i][j]表示前i个物品放入容量为j的背包中能获得的最大价值。

```javascript
function knapsack01(weights, values, capacity) {
  const n = weights.length;
  
  // 创建DP数组
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  // 填充DP数组
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= capacity; j++) {
      // 当前物品重量大于背包容量，不能放入
      if (weights[i - 1] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // 两种选择：放入当前物品或不放入当前物品，取较大值
        dp[i][j] = Math.max(
          dp[i - 1][j],                                  // 不放入当前物品
          dp[i - 1][j - weights[i - 1]] + values[i - 1] // 放入当前物品
        );
      }
    }
  }
  
  return dp[n][capacity];
}

// 空间优化版本（一维DP）
function knapsack01Optimized(weights, values, capacity) {
  const n = weights.length;
  
  // 创建一维DP数组
  const dp = new Array(capacity + 1).fill(0);
  
  // 填充DP数组（必须逆序遍历容量）
  for (let i = 0; i < n; i++) {
    for (let j = capacity; j >= weights[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    }
  }
  
  return dp[capacity];
}
```

**复杂度分析**：
- 时间复杂度：O(n * capacity)
- 空间复杂度：优化版O(capacity)，未优化版O(n * capacity)

#### 完全背包问题

**问题描述**：有n个物品，每个物品有一个重量weight[i]和一个价值value[i]。现在有一个容量为W的背包，问如何选择装入背包的物品，使得背包内物品的总价值最大？每个物品可以选择多次。

**解题思路**：与0-1背包类似，但内层循环正序遍历。

```javascript
function unboundedKnapsack(weights, values, capacity) {
  const n = weights.length;
  
  // 创建DP数组
  const dp = new Array(capacity + 1).fill(0);
  
  // 填充DP数组（正序遍历容量）
  for (let i = 0; i < n; i++) {
    for (let j = weights[i]; j <= capacity; j++) {
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    }
  }
  
  return dp[capacity];
}
```

**复杂度分析**：
- 时间复杂度：O(n * capacity)
- 空间复杂度：O(capacity)

**相关面试题**：
1. "0-1背包和完全背包的区别是什么？为什么内层循环的遍历顺序不同？"
2. "如何解决多重背包问题（每个物品有限定数量）？"

## 动态规划的常见类型

1. **线性DP**：一维数组表示状态（如爬楼梯、打家劫舍）
2. **区间DP**：处理区间问题（如矩阵链乘法、戳气球）
3. **背包DP**：处理资源分配问题
4. **状态压缩DP**：使用二进制表示状态（如旅行商问题、集合划分）
5. **树形DP**：在树上进行动态规划（如树的最大独立集）

## 解题技巧总结

1. **识别DP问题的特征**：
   - 求最优解（最大值/最小值）
   - 有重叠子问题
   - 满足最优子结构

2. **定义状态的方法**：
   - 从子问题的角度思考
   - 明确状态所表示的含义
   - 考虑状态的维度

3. **寻找状态转移方程**：
   - 考虑当前状态与前一个状态的关系
   - 分析不同的选择对当前状态的影响

4. **优化空间复杂度**：
   - 滚动数组
   - 使用临时变量
   - 维度压缩

## 面试常见误区

1. 没有明确定义状态含义
2. 忽略边界条件
3. 状态转移方程错误
4. 遍历顺序不正确

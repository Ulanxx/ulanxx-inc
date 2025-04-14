# 背包问题

背包问题是一类经典的动态规划问题，包括 0-1 背包、完全背包、多重背包等变体。本文将详细介绍各种背包问题的解法和优化技巧。

## 1. 0-1 背包问题

### 1.1 基本问题

**问题描述**：有 n 个物品，每个物品有重量 w[i] 和价值 v[i]。现在有一个容量为 W 的背包，求解如何选择物品放入背包，使得物品的总价值最大。每个物品只能选择一次。

```javascript
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    // dp[i][j] 表示前 i 个物品，容量为 j 时的最大价值
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= capacity; j++) {
            if (weights[i-1] <= j) {
                // 可以放入第 i 个物品
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
```

### 1.2 空间优化

由于每个状态只依赖于上一行的状态，我们可以使用一维数组进行空间优化：

```javascript
function knapsack01Optimized(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (let j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(
                dp[j],
                dp[j - weights[i]] + values[i]
            );
        }
    }
    
    return dp[capacity];
}
```

### 1.3 输出选择的物品

```javascript
function knapsack01WithItems(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    const selected = Array(n).fill(false);
    
    // 填充 dp 数组
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= capacity; j++) {
            if (weights[i-1] <= j) {
                dp[i][j] = Math.max(
                    dp[i-1][j],
                    dp[i-1][j-weights[i-1]] + values[i-1]
                );
            } else {
                dp[i][j] = dp[i-1][j];
            }
        }
    }
    
    // 回溯找出选择的物品
    let i = n, j = capacity;
    while (i > 0 && j > 0) {
        if (dp[i][j] !== dp[i-1][j]) {
            selected[i-1] = true;
            j -= weights[i-1];
        }
        i--;
    }
    
    return {
        maxValue: dp[n][capacity],
        selected
    };
}
```

## 2. 完全背包问题

### 2.1 基本问题

**问题描述**：有 n 个物品，每个物品有重量 w[i] 和价值 v[i]。现在有一个容量为 W 的背包，每个物品可以选择无限次，求解如何选择物品放入背包，使得物品的总价值最大。

```javascript
function completePack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (let j = weights[i]; j <= capacity; j++) {
            dp[j] = Math.max(
                dp[j],
                dp[j - weights[i]] + values[i]
            );
        }
    }
    
    return dp[capacity];
}
```

### 2.2 完全背包的变体

#### 零钱兑换

**问题描述**：给定不同面额的硬币 coins 和一个总金额 amount，计算可以凑成总金额所需的最少的硬币个数。

```javascript
function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

## 3. 多重背包问题

**问题描述**：有 n 个物品，每个物品有重量 w[i]、价值 v[i] 和数量 k[i]。现在有一个容量为 W 的背包，求解如何选择物品放入背包，使得物品的总价值最大。

```javascript
function multiplePack(weights, values, counts, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 转换为 0-1 背包问题
        let num = counts[i];
        let weight = weights[i];
        let value = values[i];
        
        // 二进制优化
        for (let k = 1; num > 0; k <<= 1) {
            const amount = Math.min(k, num);
            const newWeight = weight * amount;
            const newValue = value * amount;
            
            // 0-1 背包
            for (let j = capacity; j >= newWeight; j--) {
                dp[j] = Math.max(
                    dp[j],
                    dp[j - newWeight] + newValue
                );
            }
            
            num -= amount;
        }
    }
    
    return dp[capacity];
}
```

## 4. 优化技巧

1. **状态压缩**：
   - 使用一维数组代替二维数组
   - 注意遍历顺序的区别

2. **二进制优化**：
   - 用于多重背包问题
   - 将 k 件物品转换为 log k 件物品

3. **初始化优化**：
   - 根据问题要求选择合适的初始值
   - 考虑边界情况的处理

## 5. 面试要点

1. **基本概念**：
   - 理解动态规划的状态定义
   - 掌握状态转移方程的推导
   - 理解不同类型背包问题的区别

2. **优化方法**：
   - 空间优化的思路和实现
   - 二进制优化的应用场景
   - 初始化和边界条件的处理

3. **变体问题**：
   - 零钱兑换
   - 物品组合
   - 最值问题

## 6. 常见面试题

### 6.1 分割等和子集

**问题描述**：给定一个只包含正整数的非空数组，判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

```javascript
function canPartition(nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    
    const target = sum / 2;
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        for (let i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    
    return dp[target];
}
```

### 6.2 目标和

**问题描述**：给定一个非负整数数组和一个目标值 S，现在可以在每个数字前加上 + 或 -，求所有使得和为 S 的添加符号的方法数。

```javascript
function findTargetSumWays(nums, target) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > sum) return 0;
    
    const dp = Array(2 * sum + 1).fill(0);
    dp[nums[0] + sum] = 1;
    dp[-nums[0] + sum] += 1;
    
    for (let i = 1; i < nums.length; i++) {
        const next = Array(2 * sum + 1).fill(0);
        for (let j = -sum; j <= sum; j++) {
            if (dp[j + sum] > 0) {
                next[j + nums[i] + sum] += dp[j + sum];
                next[j - nums[i] + sum] += dp[j + sum];
            }
        }
        dp.splice(0, dp.length, ...next);
    }
    
    return dp[target + sum];
}
```

## 总结

背包问题是动态规划中的经典问题，掌握其解题思路和优化技巧对于理解动态规划有很大帮助：

1. **问题分类**：
   - 0-1 背包：每个物品最多选择一次
   - 完全背包：每个物品可以选择无限次
   - 多重背包：每个物品有特定的数量限制

2. **核心思想**：
   - 状态定义
   - 状态转移
   - 边界处理
   - 空间优化

3. **实战技巧**：
   - 理解问题转化
   - 掌握优化方法
   - 灵活处理变体
# 股票买卖问题

股票买卖问题是算法面试中的经典问题，有多个变体。本文将介绍常见的股票买卖问题及其解决方案。

## 问题变体

1. **单次交易**：只能进行一次买卖
2. **多次交易**：可以进行多次买卖
3. **含冷冻期**：卖出后需要等待一天才能再次买入
4. **含手续费**：每次交易需要支付手续费
5. **最多k次交易**：最多只能进行k次买卖

## 1. 单次交易

**问题描述**：给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。

**示例**：
```
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5。
```

**解题思路**：遍历数组，记录历史最低价，计算当前价格与历史最低价的差值，更新最大利润。

```javascript
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (const price of prices) {
    // 更新历史最低价
    if (price < minPrice) {
      minPrice = price;
    }
    // 计算当前利润并更新最大利润
    else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  
  return maxProfit;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 2. 多次交易

**问题描述**：给定一个数组 prices，其中 prices[i] 表示一支给定股票第 i 天的价格。设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

**示例**：
```
输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）买入，在第 3 天（股票价格 = 5）卖出，利润 = 5-1 = 4。
     然后在第 4 天（股票价格 = 3）买入，在第 5 天（股票价格 = 6）卖出，利润 = 6-3 = 3。
     总利润 = 4 + 3 = 7。
```

**解题思路**：只要后一天的价格比前一天高，就进行交易。

```javascript
function maxProfit(prices) {
  let profit = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  
  return profit;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 3. 含冷冻期

**问题描述**：给定一个整数数组 prices，其中第 i 个元素代表了第 i 天的股票价格。设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）：
- 你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
- 卖出股票后，你无法在第二天买入股票（即冷冻期为 1 天）。

**示例**：
```
输入: [1,2,3,0,2]
输出: 3
解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
```

**解题思路**：使用动态规划，定义三个状态：持有股票、不持有股票且处于冷冻期、不持有股票且不处于冷冻期。

```javascript
function maxProfit(prices) {
  if (prices.length === 0) return 0;
  
  // 定义状态
  let hold = -prices[0]; // 持有股票
  let notHoldCool = 0;   // 不持有股票且处于冷冻期
  let notHold = 0;       // 不持有股票且不处于冷冻期
  
  for (let i = 1; i < prices.length; i++) {
    const prevHold = hold;
    const prevNotHoldCool = notHoldCool;
    const prevNotHold = notHold;
    
    // 当前持有股票：前一天就持有，或者今天买入（前一天不能处于冷冻期）
    hold = Math.max(prevHold, prevNotHold - prices[i]);
    
    // 当前不持有股票且处于冷冻期：前一天持有股票，今天卖出
    notHoldCool = prevHold + prices[i];
    
    // 当前不持有股票且不处于冷冻期：前一天不持有股票
    notHold = Math.max(prevNotHold, prevNotHoldCool);
  }
  
  return Math.max(notHold, notHoldCool);
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 4. 含手续费

**问题描述**：给定一个整数数组 prices，其中 prices[i] 表示第 i 天的股票价格；整数 fee 代表了交易股票的手续费用。你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了。返回获得利润的最大值。

**示例**：
```
输入: prices = [1, 3, 2, 8, 4, 9], fee = 2
输出: 8
解释: 能够达到的最大利润:  
在此处买入 prices[0] = 1
在此处卖出 prices[3] = 8
在此处买入 prices[4] = 4
在此处卖出 prices[5] = 9
总利润: ((8 - 1) - 2) + ((9 - 4) - 2) = 8.
```

**解题思路**：使用动态规划，定义两个状态：持有股票、不持有股票。

```javascript
function maxProfit(prices, fee) {
  let hold = -prices[0]; // 持有股票
  let notHold = 0;       // 不持有股票
  
  for (let i = 1; i < prices.length; i++) {
    const prevHold = hold;
    const prevNotHold = notHold;
    
    // 当前持有股票：前一天就持有，或者今天买入
    hold = Math.max(prevHold, prevNotHold - prices[i]);
    
    // 当前不持有股票：前一天就不持有，或者今天卖出（需要支付手续费）
    notHold = Math.max(prevNotHold, prevHold + prices[i] - fee);
  }
  
  return notHold;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 5. 最多k次交易

**问题描述**：给定一个整数数组 prices，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。

**示例**：
```
输入: k = 2, prices = [3,2,6,5,0,3]
输出: 7
解释: 在第 2 天（股票价格 = 2）买入，在第 3 天（股票价格 = 6）卖出，利润 = 6-2 = 4。
     然后在第 5 天（股票价格 = 0）买入，在第 6 天（股票价格 = 3）卖出，利润 = 3-0 = 3。
     总利润 = 4 + 3 = 7。
```

**解题思路**：使用动态规划，定义状态 dp[i][j] 表示第 i 天最多进行 j 次交易的最大利润。

```javascript
function maxProfit(k, prices) {
  const n = prices.length;
  if (n === 0) return 0;
  
  // 如果k大于n/2，相当于可以进行无限次交易
  if (k > n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }
  
  // 定义DP数组
  const dp = Array(k + 1).fill().map(() => Array(n).fill(0));
  
  for (let j = 1; j <= k; j++) {
    let maxDiff = -prices[0];
    for (let i = 1; i < n; i++) {
      dp[j][i] = Math.max(dp[j][i - 1], prices[i] + maxDiff);
      maxDiff = Math.max(maxDiff, dp[j - 1][i] - prices[i]);
    }
  }
  
  return dp[k][n - 1];
}
```

**复杂度分析**：
- 时间复杂度：O(k * n)
- 空间复杂度：O(k * n)

## 总结

股票买卖问题的核心是动态规划。通过定义不同的状态和状态转移方程，可以解决各种变体的问题。在面试中，理解这些变体之间的关系和区别非常重要。

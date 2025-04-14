# 编辑距离

编辑距离（Edit Distance）是一个经典的字符串问题，用于衡量两个字符串之间的相似度。本文将详细介绍编辑距离的原理、实现和应用。

## 1. 基本概念

编辑距离是指将一个字符串转换成另一个字符串所需的最少操作数。允许的操作包括：

1. **插入**：在字符串中插入一个字符
2. **删除**：删除字符串中的一个字符
3. **替换**：将字符串中的一个字符替换为另一个字符

## 2. 动态规划解法

### 2.1 状态定义

`dp[i][j]` 表示将 word1 的前 i 个字符转换为 word2 的前 j 个字符所需的最少操作数。

### 2.2 状态转移方程

```javascript
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // 创建 DP 表格
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 初始化边界情况
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    // 填充 DP 表格
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(
                    dp[i-1][j] + 1,    // 删除
                    dp[i][j-1] + 1,    // 插入
                    dp[i-1][j-1] + 1   // 替换
                );
            }
        }
    }
    
    return dp[m][n];
}
```

### 2.3 空间优化

由于每个状态只依赖于上一行的状态，我们可以使用两行来节省空间：

```javascript
function minDistanceOptimized(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // 只使用两行
    let dp = Array(n + 1).fill(0);
    let prevDp = Array(n + 1).fill(0);
    
    // 初始化第一行
    for (let j = 0; j <= n; j++) dp[j] = j;
    
    // 填充 DP 表格
    for (let i = 1; i <= m; i++) {
        prevDp = [...dp];
        dp[0] = i;
        
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[j] = prevDp[j-1];
            } else {
                dp[j] = Math.min(
                    prevDp[j] + 1,     // 删除
                    dp[j-1] + 1,       // 插入
                    prevDp[j-1] + 1    // 替换
                );
            }
        }
    }
    
    return dp[n];
}
```

## 3. 常见变体

### 3.1 一次编辑距离

**问题描述**：判断两个字符串是否可以通过一次编辑操作实现相等。

```javascript
function isOneEditDistance(s, t) {
    const m = s.length;
    const n = t.length;
    
    // 长度差超过 1，直接返回 false
    if (Math.abs(m - n) > 1) return false;
    
    // 确保 s 是较短的字符串
    if (m > n) return isOneEditDistance(t, s);
    
    for (let i = 0; i < m; i++) {
        if (s[i] !== t[i]) {
            if (m === n) {
                // 替换操作
                return s.slice(i + 1) === t.slice(i + 1);
            } else {
                // 插入操作
                return s.slice(i) === t.slice(i + 1);
            }
        }
    }
    
    // 如果所有字符都相同，检查长度差是否为 1
    return m + 1 === n;
}
```

### 3.2 最长公共子序列

**问题描述**：找出两个字符串中最长的公共子序列。

```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
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

## 4. 应用场景

1. **拼写检查**：检查单词是否拼写正确
2. **文本相似度**：计算两个文本的相似度
3. **DNA 序列对比**：比较两个 DNA 序列的相似度
4. **自动纠正**：自动纠正用户输入的文本

## 5. 面试要点

1. **状态定义**：
   - 理解 dp[i][j] 的含义
   - 根据问题需求设计状态

2. **状态转移**：
   - 理解不同操作的影响
   - 正确处理字符相等和不相等的情况

3. **空间优化**：
   - 使用滚动数组
   - 理解状态依赖

## 6. 常见面试题

### 6.1 最少操作次数

**问题描述**：给定两个字符串，每次可以删除一个字符，求使得两个字符串相等的最少操作次数。

```javascript
function minOperations(word1, word2) {
    const lcs = longestCommonSubsequence(word1, word2);
    return word1.length + word2.length - 2 * lcs;
}
```

### 6.2 正则表达式匹配

**问题描述**：实现一个简单的正则表达式匹配，其中 '.' 表示任意字符，'*' 表示前一个字符可以重复零次或多次。

```javascript
function isMatch(s, p) {
    const m = s.length;
    const n = p.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));
    dp[0][0] = true;
    
    // 初始化第一行
    for (let j = 1; j <= n; j++) {
        if (p[j-1] === '*') {
            dp[0][j] = dp[0][j-2];
        }
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j-1] === '*') {
                dp[i][j] = dp[i][j-2] || // 不使用 *
                    (dp[i-1][j] && (s[i-1] === p[j-2] || p[j-2] === '.')); // 使用 *
            } else {
                dp[i][j] = dp[i-1][j-1] && 
                    (s[i-1] === p[j-1] || p[j-1] === '.');
            }
        }
    }
    
    return dp[m][n];
}
```

## 总结

编辑距离是一个经典的动态规划问题，它的核心思想和解题技巧可以应用到很多实际场景中：

1. **基本思路**：
   - 状态定义和转移
   - 边界条件处理
   - 空间优化

2. **应用扩展**：
   - 文本相似度计算
   - 序列对齐
   - 模式匹配

3. **实战技巧**：
   - 理解问题变化
   - 掌握优化方法
   - 灵活处理变体
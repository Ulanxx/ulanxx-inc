# 字符串算法

字符串算法是面试中的高频考点，涉及字符串匹配、处理和转换等多个方面。本文将详细介绍常见的字符串算法及其应用。

## 1. 字符串匹配算法

### 1.1 KMP 算法

KMP算法是一种改进的字符串匹配算法，可以在 O(n+m) 的时间复杂度内实现两个字符串的匹配。

```javascript
function getNext(pattern) {
    const next = [0];
    let prefix = 0;
    let i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[prefix]) {
            prefix++;
            next[i] = prefix;
            i++;
        } else if (prefix === 0) {
            next[i] = 0;
            i++;
        } else {
            prefix = next[prefix - 1];
        }
    }
    
    return next;
}

function kmp(text, pattern) {
    if (!pattern) return 0;
    
    const next = getNext(pattern);
    let i = 0; // text 指针
    let j = 0; // pattern 指针
    
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        } else if (j > 0) {
            j = next[j - 1];
        } else {
            i++;
        }
        
        if (j === pattern.length) {
            return i - j; // 找到匹配，返回起始索引
        }
    }
    
    return -1; // 未找到匹配
}
```

**面试要点**：
1. 理解 next 数组的含义和构建过程
2. 掌握时间复杂度分析
3. 与暴力匹配的比较

### 1.2 Rabin-Karp 算法

Rabin-Karp 算法使用哈希函数来实现高效的字符串匹配。

```javascript
function rabinKarp(text, pattern) {
    const d = 256; // 字符集大小
    const q = 101; // 一个大质数
    const m = pattern.length;
    const n = text.length;
    let i, j;
    let p = 0; // pattern的哈希值
    let t = 0; // text当前窗口的哈希值
    let h = 1;
    
    // 计算 h = d^(m-1) % q
    for (i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    // 计算pattern和第一个窗口的哈希值
    for (i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }
    
    // 滑动窗口
    for (i = 0; i <= n - m; i++) {
        if (p === t) {
            // 哈希值匹配，验证字符
            for (j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) break;
            }
            if (j === m) return i;
        }
        
        if (i < n - m) {
            t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (t < 0) t += q;
        }
    }
    
    return -1;
}
```

## 2. 字符串处理

### 2.1 最长公共子串

```javascript
function longestCommonSubstring(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    let maxLength = 0;
    let endIndex = 0;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j];
                    endIndex = i - 1;
                }
            }
        }
    }
    
    return str1.substring(endIndex - maxLength + 1, endIndex + 1);
}
```

### 2.2 最长回文子串

```javascript
function longestPalindrome(s) {
    if (!s) return "";
    
    let start = 0;
    let maxLength = 1;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            const currentLength = right - left + 1;
            if (currentLength > maxLength) {
                start = left;
                maxLength = currentLength;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i); // 奇数长度
        expandAroundCenter(i, i + 1); // 偶数长度
    }
    
    return s.substring(start, start + maxLength);
}
```

## 3. 字符串压缩与解压

### 3.1 基本字符串压缩

```javascript
function compress(str) {
    if (!str) return "";
    
    let result = "";
    let count = 1;
    let current = str[0];
    
    for (let i = 1; i <= str.length; i++) {
        if (i < str.length && str[i] === current) {
            count++;
        } else {
            result += current + count;
            if (i < str.length) {
                current = str[i];
                count = 1;
            }
        }
    }
    
    return result.length < str.length ? result : str;
}
```

### 3.2 字符串解码

```javascript
function decode(s) {
    const stack = [];
    let currentString = '';
    let currentNum = 0;
    
    for (const char of s) {
        if (char >= '0' && char <= '9') {
            currentNum = currentNum * 10 + parseInt(char);
        } else if (char === '[') {
            stack.push(currentString);
            stack.push(currentNum);
            currentString = '';
            currentNum = 0;
        } else if (char === ']') {
            const num = stack.pop();
            const prevString = stack.pop();
            currentString = prevString + currentString.repeat(num);
        } else {
            currentString += char;
        }
    }
    
    return currentString;
}
```

## 4. 字符串匹配的实际应用

### 4.1 通配符匹配

```javascript
function isMatch(s, p) {
    const m = s.length;
    const n = p.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));
    
    // 空字符串匹配
    dp[0][0] = true;
    
    // 处理模式以*开头的情况
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 1];
        }
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
            } else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
        }
    }
    
    return dp[m][n];
}
```

## 5. 面试常见问题

### 5.1 字符串相关问题的解题思路

1. **双指针技巧**：
   - 从两端向中间移动
   - 快慢指针
   - 滑动窗口

2. **哈希表应用**：
   - 字符频率统计
   - 字符位置记录
   - 子串匹配

3. **动态规划方法**：
   - 最长公共子串/子序列
   - 编辑距离
   - 回文子串

### 5.2 常见面试题

1. **字符串去重**：
```javascript
function removeDuplicates(str) {
    return [...new Set(str)].join('');
}
```

2. **判断回文字符串**：
```javascript
function isPalindrome(str) {
    str = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return str === str.split('').reverse().join('');
}
```

3. **字符串反转**：
```javascript
function reverseWords(str) {
    return str.split(' ').reverse().join(' ');
}
```

## 6. 性能优化技巧

1. **预处理**：
   - 构建辅助数据结构
   - 计算前缀和或哈希值
   - 预处理模式串

2. **空间优化**：
   - 使用原地算法
   - 复用已有空间
   - 滚动数组

3. **时间优化**：
   - 使用合适的算法
   - 避免不必要的计算
   - 利用问题特性

## 总结

字符串算法是面试中的重要内容，需要注意：

1. **基础知识**：
   - 理解字符串的基本操作
   - 掌握常见算法的原理
   - 熟悉时间空间复杂度

2. **实现技巧**：
   - 正确处理边界情况
   - 考虑特殊输入
   - 注意代码简洁性

3. **优化方法**：
   - 选择合适的算法
   - 利用问题特性
   - 考虑实际应用场景

4. **面试准备**：
   - 理解问题的本质
   - 分析多种解决方案
   - 比较不同方法的优劣

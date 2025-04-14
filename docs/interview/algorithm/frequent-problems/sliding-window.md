# 滑动窗口算法题

滑动窗口是处理数组/字符串的一种重要技巧，特别适用于查找满足特定条件的连续子数组或子字符串。

## 滑动窗口的基本思想

滑动窗口通过维护一个可变大小的"窗口"，在数组或字符串上滑动，避免了暴力解法中的重复计算，将时间复杂度从O(n²)降至O(n)。

## 滑动窗口的基本模板

```javascript
function slidingWindowTemplate(s) {
  // 初始化窗口边界和结果
  let left = 0, right = 0;
  let result = 初始值;
  
  // 扩展右边界
  while (right < s.length) {
    // 添加 s[right] 到窗口
    更新窗口内数据
    
    // 根据条件收缩左边界
    while (需要收缩窗口的条件) {
      // 移除 s[left] 从窗口
      更新窗口内数据
      left++;
    }
    
    // 更新结果
    更新 result
    
    // 扩展右边界
    right++;
  }
  
  return result;
}
```

## 高频面试题

### 1. 无重复字符的最长子串

**问题描述**：给定一个字符串，找出其中不含有重复字符的最长子串的长度。

**示例**：
- 输入: "abcabcbb"
- 输出: 3（最长子串是 "abc"）

**解题思路**：使用滑动窗口和哈希集合跟踪窗口内的字符。

```javascript
function lengthOfLongestSubstring(s) {
  // 哈希集合，记录窗口中的字符
  const charSet = new Set();
  let left = 0, right = 0;
  let maxLength = 0;
  
  while (right < s.length) {
    // 如果窗口中不包含当前字符，扩大窗口
    if (!charSet.has(s[right])) {
      charSet.add(s[right]);
      maxLength = Math.max(maxLength, right - left + 1);
      right++;
    } 
    // 否则，移除窗口最左侧字符，缩小窗口
    else {
      charSet.delete(s[left]);
      left++;
    }
  }
  
  return maxLength;
}
```

**复杂度分析**：
- 时间复杂度：O(n)，其中n是字符串长度
- 空间复杂度：O(min(m, n))，其中m是字符集大小

**相关面试题**：
1. "如果我们只关心英文字母，如何优化空间复杂度？"
2. "如何找到所有长度为k且不含重复字符的子串？"

### 2. 最小覆盖子串

**问题描述**：给你一个字符串S、一个字符串T，请在S中找出包含T所有字符的最小子串。

**示例**：
- 输入: S = "ADOBECODEBANC", T = "ABC"
- 输出: "BANC"

**解题思路**：使用滑动窗口结合哈希表，跟踪窗口中是否包含T的所有字符。

```javascript
function minWindow(s, t) {
  // 如果s比t短，不可能包含所有字符
  if (s.length < t.length) return "";
  
  // 目标字符计数器
  const targetCounter = {};
  for (const char of t) {
    targetCounter[char] = (targetCounter[char] || 0) + 1;
  }
  
  let requiredChars = Object.keys(targetCounter).length;
  let formedChars = 0;
  
  // 窗口内字符计数器
  const windowCounter = {};
  
  // 结果变量
  let minLen = Infinity;
  let result = "";
  
  // 滑动窗口
  let left = 0, right = 0;
  
  while (right < s.length) {
    // 添加字符到窗口
    const cRight = s[right];
    windowCounter[cRight] = (windowCounter[cRight] || 0) + 1;
    
    // 判断当前字符是否在目标中且数量一致
    if (cRight in targetCounter && windowCounter[cRight] === targetCounter[cRight]) {
      formedChars++;
    }
    
    // 尝试收缩窗口
    while (left <= right && formedChars === requiredChars) {
      // 更新结果
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        result = s.substring(left, right + 1);
      }
      
      // 移除字符
      const cLeft = s[left];
      windowCounter[cLeft]--;
      
      // 如果移除的字符导致窗口不再包含所有目标字符
      if (cLeft in targetCounter && windowCounter[cLeft] < targetCounter[cLeft]) {
        formedChars--;
      }
      
      left++;
    }
    
    right++;
  }
  
  return minLen === Infinity ? "" : result;
}
```

**复杂度分析**：
- 时间复杂度：O(|S| + |T|)
- 空间复杂度：O(|S| + |T|)

**相关面试题**：
1. "如何优化算法以处理超大规模的输入？"
2. "如果T中可能有重复字符，算法需要做什么调整？"

### 3. 字符串的排列

**问题描述**：给定两个字符串s1和s2，写一个函数来判断s2是否包含s1的排列。

**示例**：
- 输入: s1 = "ab", s2 = "eidbaooo"
- 输出: true（s2包含s1的排列"ba"）

**解题思路**：使用固定大小的滑动窗口，窗口大小等于s1的长度。

```javascript
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  
  // 构建字符计数器
  const s1Counter = new Array(26).fill(0);
  const s2Counter = new Array(26).fill(0);
  
  // 初始化窗口
  for (let i = 0; i < s1.length; i++) {
    s1Counter[s1.charCodeAt(i) - 97]++;
    s2Counter[s2.charCodeAt(i) - 97]++;
  }
  
  // 比较第一个窗口
  if (s1Counter.every((count, i) => count === s2Counter[i])) {
    return true;
  }
  
  // 滑动窗口
  for (let i = s1.length; i < s2.length; i++) {
    // 添加新字符
    s2Counter[s2.charCodeAt(i) - 97]++;
    // 移除旧字符
    s2Counter[s2.charCodeAt(i - s1.length) - 97]--;
    
    // 比较
    if (s1Counter.every((count, j) => count === s2Counter[j])) {
      return true;
    }
  }
  
  return false;
}
```

**优化版本**：使用差异计数器
```javascript
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  
  // 差异计数器
  const counter = new Array(26).fill(0);
  for (let i = 0; i < s1.length; i++) {
    counter[s1.charCodeAt(i) - 97]++;
    counter[s2.charCodeAt(i) - 97]--;
  }
  
  // 检查是否所有计数都为0
  if (counter.every(count => count === 0)) return true;
  
  // 滑动窗口
  for (let i = s1.length; i < s2.length; i++) {
    // 添加新字符
    counter[s2.charCodeAt(i) - 97]--;
    // 移除旧字符
    counter[s2.charCodeAt(i - s1.length) - 97]++;
    
    // 检查是否所有计数都为0
    if (counter.every(count => count === 0)) return true;
  }
  
  return false;
}
```

**复杂度分析**：
- 时间复杂度：O(l1 + (l2-l1) * 26)，其中l1是s1的长度，l2是s2的长度
- 空间复杂度：O(1)，因为计数器大小固定为26

**相关面试题**：
1. "如果不限制为小写字母，如何修改算法？"
2. "如何找出s2中所有包含s1排列的子串的起始索引？"

### 4. 找到字符串中所有字母异位词

**问题描述**：给定一个字符串s和一个非空字符串p，找到s中所有是p的字母异位词的子串，返回这些子串的起始索引。

**示例**：
- 输入: s = "cbaebabacd", p = "abc"
- 输出: [0, 6]（"cba"和"bac"是"abc"的字母异位词）

**解题思路**：与上题类似，使用固定大小的滑动窗口和计数器。

```javascript
function findAnagrams(s, p) {
  if (s.length < p.length) return [];
  
  const result = [];
  const sCount = new Array(26).fill(0);
  const pCount = new Array(26).fill(0);
  
  // 初始化p的计数器
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - 97]++;
  }
  
  // 滑动窗口
  for (let i = 0; i < s.length; i++) {
    // 添加当前字符
    sCount[s.charCodeAt(i) - 97]++;
    
    // 移除最早进入窗口的字符
    if (i >= p.length) {
      sCount[s.charCodeAt(i - p.length) - 97]--;
    }
    
    // 判断窗口内的字符是否和p匹配
    if (i >= p.length - 1 && arraysEqual(sCount, pCount)) {
      result.push(i - p.length + 1);
    }
  }
  
  return result;
  
  // 辅助函数：判断两个数组是否相等
  function arraysEqual(arr1, arr2) {
    for (let i = 0; i < 26; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
}
```

**复杂度分析**：
- 时间复杂度：O(n)，其中n是s的长度
- 空间复杂度：O(1)

**相关面试题**：
1. "如何处理包含unicode字符的输入？"
2. "能否优化arraysEqual函数以提高效率？"

### 5. 最大连续1的个数 III

**问题描述**：给定一个由若干0和1组成的数组A，我们最多可以将K个值从0变成1，返回仅包含1的最长子数组的长度。

**示例**：
- 输入: A = [1,1,1,0,0,0,1,1,1,1,0], K = 2
- 输出: 6（[1,1,1,0,0,1,1,1,1,1,1]）

**解题思路**：使用滑动窗口，窗口内最多包含K个0。

```javascript
function longestOnes(nums, k) {
  let left = 0, right = 0;
  let zeros = 0; // 窗口内0的数量
  let maxOnes = 0;
  
  while (right < nums.length) {
    // 如果添加的是0，增加0的计数
    if (nums[right] === 0) {
      zeros++;
    }
    
    // 如果窗口内0的数量超过k，移动左指针
    while (zeros > k) {
      if (nums[left] === 0) {
        zeros--;
      }
      left++;
    }
    
    // 更新最大长度
    maxOnes = Math.max(maxOnes, right - left + 1);
    
    // 扩展窗口
    right++;
  }
  
  return maxOnes;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

**相关面试题**：
1. "如果要求最多包含K个不同数字的最长子数组，如何修改算法？"
2. "如果题目变成'最多可以将K个值从1变成0'，需要做什么调整？"

## 滑动窗口的常见变体

1. **固定大小的窗口**：窗口大小保持不变，适用于"连续k个元素"的问题
2. **可变大小的窗口**：窗口大小根据条件调整，适用于"最长/最短子数组"的问题
3. **双指针滑动窗口**：同向双指针，左右边界分别控制

## 技巧总结

1. **合理使用数据结构**：
   - 哈希表/计数器：跟踪元素频率
   - 队列/双端队列：维护窗口元素顺序

2. **窗口扩展与收缩时机**：
   - 何时扩展：通常在每次循环都扩展右边界
   - 何时收缩：当窗口不满足条件时收缩左边界

3. **结果更新时机**：
   - 每次窗口变化后检查
   - 只在窗口满足特定条件时更新

## 常见误区和边界情况

1. 忘记更新结果
2. 窗口边界条件处理错误
3. 未正确处理空输入
4. 窗口收缩条件不正确

## 面试答题框架

1. 明确是否适合滑动窗口：是否需要查找连续子数组/子字符串
2. 确定窗口的含义和维护的变量
3. 确定窗口扩展和收缩的条件
4. 确定结果的更新时机
5. 分析时间和空间复杂度

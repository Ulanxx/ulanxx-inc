# nSum 问题

nSum 问题是一系列经典的数组问题，包括两数之和（2Sum）、三数之和（3Sum）等。这类问题在面试中非常常见，本文将详细介绍各种变体及其解法。

## 1. 两数之和（2Sum）

### 1.1 基本问题

**问题描述**：给定一个整数数组 nums 和一个目标值 target，找出数组中两个数之和等于目标值的两个数的下标。

```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

### 1.2 变体：有序数组的两数之和

**问题描述**：给定一个已按升序排序的整数数组，找出两个数之和等于目标值的两个数的下标。

```javascript
function twoSumSorted(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
            return [left + 1, right + 1]; // 1-based index
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 2. 三数之和（3Sum）

### 2.1 基本问题

**问题描述**：给定一个包含 n 个整数的数组，找出所有和为 0 的三元组。

```javascript
function threeSum(nums) {
    const result = [];
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < nums.length - 2; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                // 跳过重复元素
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

**复杂度分析**：
- 时间复杂度：O(n²)
- 空间复杂度：O(1)（不考虑返回值的空间）

### 2.2 三数之和最接近

**问题描述**：给定一个包含 n 个整数的数组和一个目标值，找出数组中和最接近目标值的三个数。

```javascript
function threeSumClosest(nums, target) {
    nums.sort((a, b) => a - b);
    let closest = nums[0] + nums[1] + nums[2];
    
    for (let i = 0; i < nums.length - 2; i++) {
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === target) return sum;
            
            if (Math.abs(sum - target) < Math.abs(closest - target)) {
                closest = sum;
            }
            
            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return closest;
}
```

## 3. 四数之和（4Sum）

**问题描述**：给定一个包含 n 个整数的数组和一个目标值，找出所有和为目标值的四元组。

```javascript
function fourSum(nums, target) {
    const result = [];
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < nums.length - 3; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        for (let j = i + 1; j < nums.length - 2; j++) {
            // 跳过重复元素
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            let left = j + 1;
            let right = nums.length - 1;
            
            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];
                
                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    // 跳过重复元素
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    
    return result;
}
```

## 4. 通用解法：kSum

对于 k 数之和问题，我们可以使用递归来实现一个通用解法：

```javascript
function kSum(nums, target, k, start = 0) {
    const result = [];
    
    // 特殊情况处理
    if (k === 2) {
        return twoSumSorted(nums, target, start);
    }
    
    for (let i = start; i < nums.length - k + 1; i++) {
        // 跳过重复元素
        if (i > start && nums[i] === nums[i - 1]) continue;
        
        const subResults = kSum(nums, target - nums[i], k - 1, i + 1);
        for (const subResult of subResults) {
            result.push([nums[i], ...subResult]);
        }
    }
    
    return result;
}

function twoSumSorted(nums, target, start) {
    const result = [];
    let left = start;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            result.push([nums[left], nums[right]]);
            while (left < right && nums[left] === nums[left + 1]) left++;
            while (left < right && nums[right] === nums[right - 1]) right--;
            left++;
            right--;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return result;
}
```

## 5. 优化技巧

1. **排序预处理**：
   - 对数组进行排序可以帮助跳过重复元素
   - 排序后可以使用双指针技巧

2. **剪枝优化**：
   - 当当前和已经大于目标值时，可以提前结束
   - 利用排序特性跳过重复元素

3. **空间优化**：
   - 对于两数之和，可以使用双指针代替哈希表
   - 对于其他情况，通常需要额外空间存储结果

## 6. 面试要点

1. **解题思路**：
   - 理解双指针技巧的应用
   - 掌握去重的方法
   - 理解递归和迭代的实现差异

2. **复杂度分析**：
   - 两数之和：O(n) 时间，O(n) 空间
   - 三数之和：O(n²) 时间，O(1) 空间
   - 四数之和：O(n³) 时间，O(1) 空间

3. **常见变体**：
   - 找出所有解 vs 找出一个解
   - 返回下标 vs 返回元素值
   - 数组有序 vs 数组无序

## 总结

nSum 问题是一类重要的算法问题，主要考察以下几个方面：

1. **基本功**：
   - 数组操作
   - 双指针技巧
   - 哈希表应用

2. **优化能力**：
   - 去重处理
   - 剪枝优化
   - 空间优化

3. **举一反三**：
   - 理解通用解法
   - 灵活处理变体
   - 分析不同方案的优劣
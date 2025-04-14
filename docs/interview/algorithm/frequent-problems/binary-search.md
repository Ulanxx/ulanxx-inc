# 二分查找算法题

二分查找是一种高效的查找算法，适用于有序数组。它的时间复杂度为O(log n)，这使它比线性查找O(n)快得多，尤其是对于大型数据集。

## 二分查找的基本思想

二分查找通过将查找区间分成两半并确定目标值在哪一半，从而每次将搜索空间减半。

## 二分查找的基本模板

```javascript
// 基本二分查找模板
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    // 计算中间索引（避免整数溢出）
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
      // 找到目标值
      return mid;
    } else if (nums[mid] < target) {
      // 目标在右半部分
      left = mid + 1;
    } else {
      // 目标在左半部分
      right = mid - 1;
    }
  }
  
  // 未找到目标值
  return -1;
}
```

## 二分查找的变体

### 1. 寻找左侧边界

当数组中存在多个目标值时，返回最左侧的目标值索引。

```javascript
function binarySearchLeftBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] < target) {
      // 目标在右半部分
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 目标在左半部分
      right = mid - 1;
    } else {
      // 找到目标，但继续向左寻找
      right = mid - 1;
    }
  }
  
  // 检查是否找到目标
  if (left >= nums.length || nums[left] !== target) {
    return -1;
  }
  
  return left;
}
```

### 2. 寻找右侧边界

当数组中存在多个目标值时，返回最右侧的目标值索引。

```javascript
function binarySearchRightBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] < target) {
      // 目标在右半部分
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 目标在左半部分
      right = mid - 1;
    } else {
      // 找到目标，但继续向右寻找
      left = mid + 1;
    }
  }
  
  // 检查是否找到目标
  if (right < 0 || nums[right] !== target) {
    return -1;
  }
  
  return right;
}
```

## 高频面试题

### 1. 搜索一个数

**问题描述**：给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

**示例**：
- 输入: nums = [-1,0,3,5,9,12], target = 9
- 输出: 4 (nums[4] = 9)

**解题思路**：使用标准的二分查找。

```javascript
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
```

**复杂度分析**：
- 时间复杂度：O(log n)
- 空间复杂度：O(1)

**相关面试题**：
1. "如果数组中有重复元素，如何找到目标值的所有索引？"
2. "二分查找的递归实现与迭代实现相比有什么优缺点？"

### 2. 搜索插入位置

**问题描述**：给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

**示例**：
- 输入: nums = [1,3,5,6], target = 5
- 输出: 2 (nums[2] = 5)
- 输入: nums = [1,3,5,6], target = 2
- 输出: 1 (应该插入到索引1的位置)

**解题思路**：使用二分查找，最终left指针会指向目标值应该插入的位置。

```javascript
function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  // 当循环结束时，left > right
  // left指向的是插入位置
  return left;
}
```

**复杂度分析**：
- 时间复杂度：O(log n)
- 空间复杂度：O(1)

**相关面试题**：
1. "如何修改这个算法，使其同时返回目标元素的个数？"
2. "如何设计一个数据结构，能够高效支持插入操作并保持有序？"

### 3. 在旋转排序数组中搜索

**问题描述**：假设按照升序排序的数组在预先未知的某个点上进行了旋转（例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] ）。搜索一个给定的目标值，如果数组中存在这个目标值，则返回它的索引，否则返回 -1。你可以假设数组中不存在重复的元素。

**示例**：
- 输入: nums = [4,5,6,7,0,1,2], target = 0
- 输出: 4 (nums[4] = 0)

**解题思路**：在旋转数组中，至少有一半是有序的。我们可以先判断哪一半是有序的，然后决定在哪一半中继续搜索。

```javascript
function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // 判断哪一半是有序的
        if (nums[left] <= nums[mid]) {
            // 左半部分有序
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半部分有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

### 4. 寻找峰值

**问题描述**：峰值元素是指其值严格大于左右相邻值的元素。给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。

```javascript
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] > nums[mid + 1]) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}
```

### 5. 寻找两个正序数组的中位数

**问题描述**：给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的中位数。

```javascript
function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    const total = m + n;
    const half = Math.floor((total + 1) / 2);
    
    let left = 0;
    let right = m;
    
    while (left <= right) {
        const i = Math.floor((left + right) / 2);
        const j = half - i;
        
        const nums1Left = i === 0 ? -Infinity : nums1[i - 1];
        const nums1Right = i === m ? Infinity : nums1[i];
        const nums2Left = j === 0 ? -Infinity : nums2[j - 1];
        const nums2Right = j === n ? Infinity : nums2[j];
        
        if (nums1Left <= nums2Right && nums2Left <= nums1Right) {
            if (total % 2 === 0) {
                return (Math.max(nums1Left, nums2Left) + 
                        Math.min(nums1Right, nums2Right)) / 2;
            } else {
                return Math.max(nums1Left, nums2Left);
            }
        } else if (nums1Left > nums2Right) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
}
```

## 实际应用场景

1. **数据库索引查找**：
   - B树和B+树的查找过程就是二分查找的变体
   - 用于快速定位记录

2. **版本控制**：
   - Git bisect 命令使用二分查找定位引入 bug 的提交
   - 快速在版本历史中定位问题

3. **机器学习**：
   - 在决策树中进行特征分割
   - 在KD树中进行空间划分

4. **系统设计**：
   - 负载均衡器的一致性哈希算法
   - 分布式系统中的数据分片

## 面试常见问题

1. **为什么用 left + (right - left) / 2 而不是 (left + right) / 2？**
   - 避免整数溢出
   - 当 left 和 right 都很大时，它们的和可能超出整数范围

2. **二分查找的局限性是什么？**
   - 要求数组有序
   - 需要随机访问能力
   - 不适合频繁插入删除的场景

3. **如何处理重复元素？**
   - 寻找左边界：当找到目标值时继续向左搜索
   - 寻找右边界：当找到目标值时继续向右搜索
   - 需要明确定义返回第一个还是最后一个匹配项

## 代码模板总结

1. **标准二分查找**：
```javascript
while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

2. **寻找左边界**：
```javascript
while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= target) right = mid - 1;
    else left = mid + 1;
}
return left;
```

3. **寻找右边界**：
```javascript
while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] <= target) left = mid + 1;
    else right = mid - 1;
}
return right;
```

## 优化技巧

1. **预处理**：
   - 对输入数据进行排序（如果需要）
   - 处理边界情况
   - 验证输入有效性

2. **二分边界**：
   - 明确搜索空间的定义
   - 正确处理边界条件
   - 避免死循环

3. **效率提升**：
   - 使用位运算代替除法
   - 避免重复计算
   - 合理使用缓存

## 总结

二分查找是一个看似简单但实际上细节很多的算法，面试中需要注意：

1. **基本功**：
   - 理解基本原理
   - 掌握常见变体
   - 熟练处理边界情况

2. **实战技巧**：
   - 灵活运用模板
   - 处理特殊情况
   - 优化代码效率

3. **进阶应用**：
   - 结合实际场景
   - 理解算法局限
   - 掌握优化方法

**解题思路**：使用二分查找，但需要判断哪一部分是有序的，然后确定搜索区间。

```javascript
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
      return mid;
    }
    
    if (nums[left] <= nums[mid]) {
      // 左半部分有序
      if (nums[left] <= target && target < nums[mid]) {
        // 目标在左半部分
        right = mid - 1;
      } else {
        // 目标在右半部分
        left = mid + 1;
      }
    } else {
      // 右半部分有序
      if (nums[mid] < target && target <= nums[right]) {
        // 目标在右半部分
        left = mid + 1;
      } else {
        // 目标在左半部分
        right = mid - 1;
      }
    }
  }
  
  return -1;
}
```

**复杂度分析**：
- 时间复杂度：O(log n)
- 空间复杂度：O(1)

**相关面试题**：
1. "如果数组中可能包含重复元素，算法需要做什么调整？"
2. "如何找到旋转数组的最小元素？"

### 4. 寻找峰值

**问题描述**：峰值元素是指其值大于左右相邻值的元素。给定一个输入数组nums，其中 nums[i] ≠ nums[i+1]，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。你可以假设 nums[-1] = nums[n] = -∞。

**示例**：
- 输入: nums = [1,2,3,1]
- 输出: 2 (nums[2] = 3是峰值元素)

**解题思路**：使用二分查找。如果中间元素比右边元素小，则右边一定有峰值；否则左边一定有峰值。

```javascript
function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] < nums[mid + 1]) {
      // 右边一定有峰值
      left = mid + 1;
    } else {
      // 左边一定有峰值（包括mid可能是峰值）
      right = mid;
    }
  }
  
  // 当left == right时，找到了峰值
  return left;
}
```

**复杂度分析**：
- 时间复杂度：O(log n)
- 空间复杂度：O(1)

**相关面试题**：
1. "如何证明这个算法的正确性？"
2. "如果允许相等元素，算法需要做什么调整？"

### 5. 搜索二维矩阵

**问题描述**：编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target。该矩阵具有以下特性：
- 每行中的整数从左到右按升序排列。
- 每行的第一个整数大于前一行的最后一个整数。

**示例**：
```
矩阵：
[
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
]
目标值：3
输出：true
```

**解题思路**：将二维矩阵视为一维有序数组，使用二分查找。

```javascript
function searchMatrix(matrix, target) {
  if (!matrix.length || !matrix[0].length) return false;
  
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    // 将一维索引转换为二维坐标
    const row = Math.floor(mid / n);
    const col = mid % n;
    
    if (matrix[row][col] === target) {
      return true;
    } else if (matrix[row][col] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return false;
}
```

**复杂度分析**：
- 时间复杂度：O(log(m*n))
- 空间复杂度：O(1)

**相关面试题**：
1. "如果矩阵的性质变为每行递增且每列递增，但不保证行与行之间的关系，如何解决？"
2. "这种二维转一维的技巧还可以应用在哪些问题上？"

### 6. 寻找两个正序数组的中位数

**问题描述**：给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。找出这两个正序数组的中位数，并且要求算法的时间复杂度为 O(log(m+n))。

**示例**：
- 输入: nums1 = [1,3], nums2 = [2]
- 输出: 2.0 (中位数是2.0)

**解题思路**：使用二分查找，将问题转化为寻找两个有序数组中的第k小元素。

```javascript
function findMedianSortedArrays(nums1, nums2) {
  const total = nums1.length + nums2.length;
  
  // 如果总长度为奇数，中位数就是第(total/2+1)小的元素
  if (total % 2 === 1) {
    return findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2) + 1);
  }
  // 如果总长度为偶数，中位数就是第(total/2)小和第(total/2+1)小的元素的平均值
  else {
    return (
      findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2)) +
      findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2) + 1)
    ) / 2;
  }
}

// 查找两个有序数组中的第k小元素
function findKthElement(nums1, i, nums2, j, k) {
  // 如果nums1为空，返回nums2中的第k小元素
  if (i >= nums1.length) {
    return nums2[j + k - 1];
  }
  // 如果nums2为空，返回nums1中的第k小元素
  if (j >= nums2.length) {
    return nums1[i + k - 1];
  }
  // 如果k=1，返回两个数组首元素中的较小者
  if (k === 1) {
    return Math.min(nums1[i], nums2[j]);
  }
  
  // 比较两个数组中第k/2小的元素
  const midVal1 = i + Math.floor(k / 2) - 1 < nums1.length ? 
    nums1[i + Math.floor(k / 2) - 1] : Infinity;
  const midVal2 = j + Math.floor(k / 2) - 1 < nums2.length ? 
    nums2[j + Math.floor(k / 2) - 1] : Infinity;
  
  // 如果nums1的第k/2小元素小于nums2的第k/2小元素，
  // 则nums1的前k/2个元素不可能包含第k小元素
  if (midVal1 < midVal2) {
    return findKthElement(nums1, i + Math.floor(k / 2), nums2, j, k - Math.floor(k / 2));
  } else {
    return findKthElement(nums1, i, nums2, j + Math.floor(k / 2), k - Math.floor(k / 2));
  }
}
```

**复杂度分析**：
- 时间复杂度：O(log(min(m,n)))
- 空间复杂度：O(log(min(m,n)))，递归调用栈的空间

**相关面试题**：
1. "如何优化此算法以减少递归调用？"
2. "如何使用类似的二分思想解决数组第k大元素的问题？"

## 二分查找的应用场景

1. **有序数组查找**：查找特定元素、查找插入位置
2. **旋转/部分有序数组查找**：处理特殊的有序情况
3. **求平方根等数值计算**：通过二分逼近答案
4. **二分答案**：将判定问题转化为优化问题

## 二分查找的常见误区

1. **边界条件处理**：
   - while条件：`left <= right` vs `left < right`
   - 更新mid：`left = mid + 1` vs `left = mid`

2. **循环不变量的选择**：
   - [left, right]：闭区间
   - [left, right)：左闭右开区间

3. **整数溢出**：
   - 正确：`mid = left + (right - left) / 2`
   - 错误：`mid = (left + right) / 2`（可能溢出）

4. **无限循环**：
   - 当`left = mid`时，确保条件能使right减小
   - 当`right = mid`时，确保条件能使left增大

## 面试答题框架

1. **问题分析**：确定问题是否适合使用二分查找（有序或部分有序）
2. **确定搜索空间**：定义clear、mid和right，以及循环条件
3. **设计循环不变量**：明确搜索区间的含义和更新规则
4. **处理边界情况**：考虑空数组、单元素数组、重复元素等
5. **编写代码并分析复杂度**

## 常见问题与解答

1. **为什么二分查找的时间复杂度是O(log n)?**
   - 每次操作将搜索空间减半，最坏情况下需要log₂n次操作。

2. **二分查找的局限性是什么?**
   - 要求数组有序或部分有序
   - 需要随机访问能力（链表不适用）
   - 不适用于频繁插入删除的数据结构

3. **二分查找在实际应用中的优化技巧?**
   - 使用插值查找改进（估计位置而不是中间点）
   - 三分查找（适用于凸函数的极值查找）
   - 指数搜索（当边界未知时）

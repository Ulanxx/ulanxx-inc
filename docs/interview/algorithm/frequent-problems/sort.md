# 排序算法

排序算法是计算机科学的基础，也是面试中的高频考点。本文将介绍常见的排序算法及其 JavaScript 实现。

## 常见排序算法对比

| 排序算法 | 平均时间复杂度   | 最坏时间复杂度 | 空间复杂度 | 稳定性 |
| -------- | ---------------- | -------------- | ---------- | ------ |
| 冒泡排序 | O(n²)            | O(n²)          | O(1)       | 稳定   |
| 选择排序 | O(n²)            | O(n²)          | O(1)       | 不稳定 |
| 插入排序 | O(n²)            | O(n²)          | O(1)       | 稳定   |
| 希尔排序 | O(nlogn) ~ O(n²) | O(n²)          | O(1)       | 不稳定 |
| 归并排序 | O(nlogn)         | O(nlogn)       | O(n)       | 稳定   |
| 快速排序 | O(nlogn)         | O(n²)          | O(logn)    | 不稳定 |
| 堆排序   | O(nlogn)         | O(nlogn)       | O(1)       | 不稳定 |
| 计数排序 | O(n+k)           | O(n+k)         | O(k)       | 稳定   |
| 桶排序   | O(n+k)           | O(n²)          | O(n+k)     | 稳定   |
| 基数排序 | O(nk)            | O(nk)          | O(n+k)     | 稳定   |

> 注：n 是数据规模，k 是数据范围（计数排序中）或桶的数量（桶排序中）。

## 高频排序算法实现

### 1. 冒泡排序

**原理**：重复遍历数组，比较相邻元素并交换位置，每轮将最大元素冒泡到末尾。

```javascript
function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    // 设置标志位，如果一轮比较中没有交换，说明数组已排序
    let swapped = false;

    // 每轮比较，将最大的元素移到末尾
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果没有交换，说明数组已排序，提前退出
    if (!swapped) break;
  }

  return arr;
}
```

**优化点**：

1. 使用标志位提前退出
2. 记录最后一次交换的位置，下一轮只需比较到该位置

**适用场景**：小数据量且基本有序的情况

**面试相关问题**：

1. "为什么冒泡排序是稳定的？"
2. "冒泡排序的时间复杂度是多少？如何优化？"

### 2. 选择排序

**原理**：每轮从未排序区间选择最小元素，放到已排序区间的末尾。

```javascript
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // 假设当前索引的元素就是最小的
    let minIndex = i;

    // 在未排序区间寻找最小元素
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 如果找到了更小的元素，交换位置
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}
```

**优化点**：同时找最大值和最小值，可以减少一半的遍历次数

**适用场景**：对交换操作敏感的情况（因为选择排序的交换次数较少）

**面试相关问题**：

1. "为什么选择排序是不稳定的？"
2. "选择排序与冒泡排序相比有什么优缺点？"

### 3. 插入排序

**原理**：维护一个已排序区间，每次将一个新元素插入到已排序区间的适当位置。

```javascript
function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    // 当前要插入的元素
    const current = arr[i];

    // 从已排序区间的末尾开始，找到插入位置
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      // 移动元素
      arr[j + 1] = arr[j];
      j--;
    }

    // 插入元素
    arr[j + 1] = current;
  }

  return arr;
}
```

**优化点**：

1. 使用二分查找快速找到插入位置
2. 基于链表实现，可以降低移动元素的成本

**适用场景**：小规模数据或基本有序的数据

**面试相关问题**：

1. "为什么插入排序在几乎有序的情况下表现很好？"
2. "如何证明插入排序的最好时间复杂度是 O(n)？"

### 4. 归并排序

**原理**：分治法，将数组分成两半，递归排序，然后合并两个有序数组。

```javascript
function mergeSort(arr) {
  // 基础情况：数组长度小于等于1时已排序
  if (arr.length <= 1) {
    return arr;
  }

  // 分割数组
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 递归排序两半
  return merge(mergeSort(left), mergeSort(right));
}

// 合并两个有序数组
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // 比较两个数组的元素，按序放入结果数组
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // 处理剩余元素
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
```

**优化点**：

1. 小规模子数组使用插入排序
2. 避免数组切割，使用索引范围
3. 避免重复创建临时数组

**适用场景**：需要稳定排序且对时间复杂度有要求的情况

**面试相关问题**：

1. "归并排序的时间复杂度是多少？如何证明？"
2. "如何优化归并排序的空间复杂度？"

### 5. 快速排序

**原理**：选择一个基准元素，将数组分为小于基准和大于基准的两部分，递归排序。

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // 获取分区点
    const pivotIndex = partition(arr, left, right);

    // 递归排序左右子数组
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }

  return arr;
}

// 分区函数
function partition(arr, left, right) {
  // 选择最右元素作为基准
  const pivot = arr[right];
  let i = left - 1;

  // 将小于基准的元素移到左侧
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 将基准元素放到正确位置
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];

  // 返回基准元素的索引
  return i + 1;
}
```

**优化点**：

1. 随机选择基准元素，避免最坏情况
2. 三数取中法选择基准
3. 处理重复元素（三路快排）
4. 小规模子数组使用插入排序

**适用场景**：一般用途的排序，平均性能最好

**面试相关问题**：

1. "快速排序的最坏情况是什么？如何避免？"
2. "为什么快速排序在实践中比其他 O(nlogn)的排序算法更快？"

### 6. 堆排序

**原理**：利用堆（完全二叉树）的性质，将数组视为堆，进行排序。

```javascript
function heapSort(arr) {
  const n = arr.length;

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 一个个从堆顶取出元素
  for (let i = n - 1; i > 0; i--) {
    // 将堆顶元素（最大值）与当前末尾元素交换
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // 对剩余元素重新堆化
    heapify(arr, i, 0);
  }

  return arr;
}

// 堆化过程
function heapify(arr, size, rootIndex) {
  let largest = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  // 找出根、左子节点和右子节点中的最大值
  if (left < size && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < size && arr[right] > arr[largest]) {
    largest = right;
  }

  // 如果最大值不是根节点，交换并继续堆化
  if (largest !== rootIndex) {
    [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
    heapify(arr, size, largest);
  }
}
```

**优化点**：

1. 非递归实现堆化过程
2. 自底向上构建堆

**适用场景**：大数据量排序，要求稳定的 O(nlogn)时间复杂度

**面试相关问题**：

1. "堆排序与快速排序相比有什么优缺点？"
2. "如何使用堆排序实现一个优先队列？"

### 7. 计数排序

**原理**：统计每个元素出现的次数，然后按顺序重建数组。

```javascript
function countingSort(arr) {
  if (arr.length <= 1) return arr;

  // 找出最大值和最小值
  let max = arr[0],
    min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  // 创建计数数组
  const range = max - min + 1;
  const countArray = new Array(range).fill(0);

  // 计数每个元素出现的次数
  for (let i = 0; i < arr.length; i++) {
    countArray[arr[i] - min]++;
  }

  // 根据计数数组重建原数组
  let sortedIndex = 0;
  for (let i = 0; i < range; i++) {
    while (countArray[i] > 0) {
      arr[sortedIndex++] = i + min;
      countArray[i]--;
    }
  }

  return arr;
}
```

**优化点**：

1. 使用累加计数，实现稳定排序
2. 对范围较大但分布集中的数据，可以结合桶排序

**适用场景**：数据范围有限的整数排序

**面试相关问题**：

1. "计数排序的时间复杂度和空间复杂度是多少？"
2. "计数排序有什么局限性？如何处理负数？"

### 8. 桶排序

**原理**：将数据分散到有限数量的桶中，每个桶单独排序，再合并。

```javascript
function bucketSort(arr, bucketSize = 5) {
  if (arr.length <= 1) return arr;

  // 找出最大值和最小值
  let max = arr[0],
    min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  // 计算桶的数量
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount);
  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }

  // 将数据分配到桶中
  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    buckets[bucketIndex].push(arr[i]);
  }

  // 对每个桶进行排序，并合并结果
  let sortedIndex = 0;
  for (let i = 0; i < bucketCount; i++) {
    // 可以使用任何排序算法，这里用插入排序
    insertionSort(buckets[i]);

    for (let j = 0; j < buckets[i].length; j++) {
      arr[sortedIndex++] = buckets[i][j];
    }
  }

  return arr;
}
```

**优化点**：

1. 根据数据分布动态调整桶的大小和数量
2. 选择适合的子排序算法

**适用场景**：数据分布均匀的大规模排序

**面试相关问题**：

1. "如何选择桶的数量和大小？"
2. "桶排序在什么情况下会退化到 O(n²)？"

## 常见排序算法应用场景

1. **快速排序**：通用排序，适用于大多数场景
2. **归并排序**：需要稳定排序且对时间复杂度有严格要求
3. **堆排序**：需要优先队列或寻找最大/最小的 k 个元素
4. **计数排序/桶排序**：数据范围有限且集中的整数排序

## 排序算法的稳定性

**稳定性定义**：如果排序前后，相等元素的相对顺序不变，则称该排序算法是稳定的。

**稳定的排序**：冒泡排序、插入排序、归并排序、计数排序、桶排序、基数排序
**不稳定的排序**：选择排序、希尔排序、快速排序、堆排序

**面试要点**：

1. 什么场景需要稳定排序？（例如：先按分数排序，再按姓名排序）
2. 如何将不稳定排序改造为稳定排序？（通常需要额外空间）

## 面试中的常见问题

1. **排序算法的选择**：

   - "在实际情况下，你会如何选择排序算法？"
   - "JavaScript 的 Array.sort()底层使用什么排序算法？为什么？"

2. **复杂度分析**：

   - "如何证明排序算法的时间复杂度下界是 Ω(nlogn)？"
   - "为什么计数排序、桶排序和基数排序能突破这个下界？"

3. **混合排序**：

   - "如何结合多种排序算法的优点设计更高效的排序方法？"
   - "什么是 TimSort，它的优势在哪里？"

4. **特殊情况处理**：
   - "如何对基本有序的数组进行排序？"
   - "如何对包含大量重复元素的数组进行排序？"

## 前端面试重点：JavaScript 排序 API

1. **Array.prototype.sort()**：

   - 不同浏览器实现可能不同（V8 引擎使用 TimSort，结合插入排序和归并排序）
   - 默认按照字符串 Unicode 码点升序
   - 支持自定义比较函数：`arr.sort((a, b) => a - b)`

2. **稳定性注意事项**：

   - ES2019 后，规范要求 sort()必须是稳定的
   - 老浏览器实现可能不稳定

3. **性能优化**：
   - 对于大型数组，考虑使用 Web Workers 并行排序
   - 特殊场景下，可以实现自定义排序而不使用内置 API

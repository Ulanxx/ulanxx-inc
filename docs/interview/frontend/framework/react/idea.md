# React 快速响应

我们日常使用 App，浏览网页时，有两类场景会制约 快速响应：

- 大计算量的操作或者设备性能不足导致的页面掉帧和卡顿。
- 发送网络请求后，由于等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

> CPU 的瓶颈
> IO 的瓶颈

React18 通过 Concurrent Mode 来解决这两类问题，它们可以通过新的更新机制：异步更新和批处理来解决。

## 无阻塞渲染

### useTransition

useTransition 是 React 18 中引入的一个新的 Hook，用于标记状态更新为非紧急的过渡更新。它的主要作用包括：

1. 优先级控制：允许将某些更新标记为低优先级，让更重要的更新（如用户输入）优先进行。

2. 并发渲染：支持在后台准备新的 UI 状态，而不会阻塞当前的 UI 渲染。

3. 性能优化：通过延迟非紧急更新，可以避免不必要的渲染和计算，提高应用性能。

4. 用户体验改善：在处理大量数据或复杂计算时，可以显示加载状态，保持 UI 的响应性。

5. 中断和恢复：允许 React 中断低优先级的渲染，优先处理更重要的任务，然后再恢复低优先级任务。

在这个例子中，useTransition 用于处理搜索操作，确保输入框保持响应，同时在后台进行搜索结果的计算和更新。

```jsx
// useTransition 示例
function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const performExpensiveSearch = (query) => {
    // 模拟一个耗时的搜索操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
          { id: 3, name: "Item 3" },
        ]);
      }, 2000);
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      // 模拟一个耗时的搜索操作
      const searchResults = performExpensiveSearch(value);
      setResults(searchResults);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2.2 useDeferredValue

useDeferredValue 是 React 18 中引入的另一个用于优化性能的 Hook。它允许我们延迟更新某些不太重要的部分，以保持 UI 的响应性。主要特点包括：

1. 延迟更新：可以推迟渲染不太重要的 UI 部分，优先处理更重要的更新。
2. 自动优化：React 会自动决定何时更新延迟值，无需手动控制。
3. 性能提升：在处理大量数据或复杂计算时特别有用。
4. 无需额外 UI：不像 useTransition，useDeferredValue 不需要额外的加载状态 UI。

以下是一个使用 useDeferredValue 的示例：

```jsx
import React, { useState, useDeferredValue } from "react";

function SearchResults() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // 模拟耗时的搜索操作
  const searchResults = performExpensiveSearch(deferredQuery);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {searchResults.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

function performExpensiveSearch(query) {
  // 实际应用中，这里可能是一个复杂的搜索算法
  // 这里用简单的模拟数据代替
  return [
    { id: 1, name: `Result 1 for ${query}` },
    { id: 2, name: `Result 2 for ${query}` },
    { id: 3, name: `Result 3 for ${query}` },
  ];
}
```

在这个例子中，useDeferredValue 用于延迟更新搜索结果，保证输入框的响应性，同时在后台进行搜索结果的计算和更新。

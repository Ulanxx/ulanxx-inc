### 第五套面试题

1. 问微信为什么出了小程序，微信小程序为什么成功？（从产品思维上考虑）

- 想考小程序相比于 h5 的优点？有点没弄明白

2. 问小程序单线程模型和双线程模型的区别，单线程模型的话当页面切换，再返回时是如何记录前一个页面的状态的？

3. 双线程模型为什么被称为双线程模型？分别是哪两个线程？

4. 跨端的运行时方案和编译时的方案各有什么优缺点？

5. 为什么编译时方案会对 react 部分特性会受限？基于源码编译成小程序代码？如果引入三方包已经经过编译了，那如何识别？
6. 在 js 中 this 是什么？this 在 class 中的指向是什么？如果不通过 bind(this)在 class 组件中要如何绑定作用域？（也不能用箭头函数）
7. call，bind ，apply 的区别？
8. 判断数据类型的方法有哪些？

- type of
- instanceOf
- Object.prototype.toString.call() 为什么要用 call？

9. 如何用 async await 做请求条件判断。如请求 A 若 A 成功 请求 B， 若 A 失败请求 C

```jsx
// fetch 返回的是个Promise
async function foo(){
	try {
		await fetchA()
		try{
			await fetchB()  // 这里加一个捕获是防止B请求失败也请求C
		} catch(){
			// log
		}
	} catch(){
		await fetch C
	}
}
```

- fetch 方法返回一个 Promise，请问如下写法第二个 then 中返回什么，为什么？

```jsx
fetchA
  .then((res1) => {
    console.log(res1);
  })
  .then((res2) => {
    console.log(res2);
  });

const promise1 = fetchA.then((res) => {});

const promise2 = fetchA.then((res) => {}).then((res) => {});

console.log(promise1 === promise2);
```

- 第二个.then 返回的 Promise 和第一个返回的 Promise 是一个 Promise 吗
  - A：新的 Promise ✔️
  - B：同一个 Promise
  - C：会根据前一个 Promise 的状态来判断返回的是同一个还是不同个
- 如何证明第一个 then 和第二个 then 返回的不是同一个 promise

10. 在 react hooks 中 setInterval 来修改状态如下写法会因为闭包问题执行失败，应该如何解决

```jsx
const Index = () => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    setInterval(() => {
      setCount((count) => count + 1);
    });
  }, []);
  return <div>{count}</div>;
};

// 为什么每次执行都会是2，要如何解决
// 答用useRef 缓存count ,这样的原理是什么
// 答 还可以在全局加一个变量, 全局加一个变量的坏处是什么？（当组件被多次引用时变量会冲突）
// 官方文档写法:
import { useState, useEffect } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((c) => c + 1); // ✅ 传递一个 state 更新器
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅现在 count 不是一个依赖项
  return <h1>{count}</h1>;
}
```

11. useCallback 是做什么的？他是为了解决什么在 hooks 下的有的问题而 class 组件下不存在的问题？如下代码，若添加了 useCallback，父组件的其他 state 更新了，父组件重新渲染了，子组件会重新渲染吗？如果没有添加 useCallback 子组件会重新渲染吗？

解决的问题：

`useCallback` 主要用于优化以下问题：

- **函数引用变化引起的子组件重新渲染**：如果父组件重新渲染时传递给子组件的函数是一个新的引用，子组件会认为 props 发生了变化，导致重新渲染。`useCallback` 可以确保函数在依赖项不变时不会创建新的引用，避免不必要的子组件渲染。
- **优化 `useEffect` 和 `useMemo` 的依赖项**：函数、对象或数组作为依赖项传递给 `useEffect` 或 `useMemo` 时，如果每次渲染时都会创建新的引用，依赖项就会不断变化，导致这些副作用或计算函数被反复调用。`useCallback` 可以帮助确保只有真正需要重新创建的函数才会更新。

```jsx
const Parent (){
	// 有其他的state
	const add = () => 1
	// return <Children add={add}></Children>
	return <Children add={useCallback(add,[])}></Children>
}
```

12. git 相关问题

- 有两个分支 A 和 B，如果 A 提交了 commit，B 提交了 commit，在合并时冲突了怎么办？手动解决冲突
- 如果 A 提交了 5 个 commit，其中 B 误把 commit 提交到了 A 分支，那 A 分支该如何将 B 剥离出去，B 如何将误提交到 A 上的 commit 合并回来？
  - chrry-pick
- 有 ABCDE5 个分支，都测试合并了 release 分支，若此时希望将 A 分支剥离出去应该如何做？
  - revert A 的 MR？那如果 A 和其他分支共同修改了同一份代码，如果直接 revert 会导致其他合并过的代码还需要重新合并？此时如何解决？ BCDE 重新合并一个新的分支

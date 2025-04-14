# React 数据通信

### 一、组件间通信

#### 1. **父组件向子组件通信**

- **通过 Props 传递数据**

  ```jsx
  function Parent() {
    const data = "Hello";
    return <Child message={data} />;
  }

  function Child({ message }) {
    return <div>{message}</div>;
  }
  ```

#### 2. **子组件向父组件通信**

- **通过回调函数传递数据**

  ```jsx
  function Parent() {
    const handleData = (data) => {
      console.log(data);
    };
    return <Child onSendData={handleData} />;
  }

  function Child({ onSendData }) {
    return <button onClick={() => onSendData("Hello")}>Send</button>;
  }
  ```

#### 3. **兄弟组件通信**

- **通过共同的父组件传递数据**

  ```jsx
  function Parent() {
    const [data, setData] = useState("");

    return (
      <>
        <ChildA onSendData={setData} />
        <ChildB message={data} />
      </>
    );
  }

  function ChildA({ onSendData }) {
    return <button onClick={() => onSendData("Hello")}>Send</button>;
  }

  function ChildB({ message }) {
    return <div>{message}</div>;
  }
  ```

---

### 二、跨层级通信

#### 1. **使用 Context API**

- **创建 Context**
  ```jsx
  const MyContext = React.createContext();
  ```
- **提供数据**
  ```jsx
  function Parent() {
    const value = "Hello";
    return (
      <MyContext.Provider value={value}>
        <Child />
      </MyContext.Provider>
    );
  }
  ```
- **消费数据**
  ```jsx
  function Child() {
    const value = useContext(MyContext);
    return <div>{value}</div>;
  }
  ```

#### 2. **使用 Redux**

- **创建 Store**

  ```jsx
  import { createStore } from "redux";

  const initialState = { message: "" };
  function reducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE_MESSAGE":
        return { ...state, message: action.payload };
      default:
        return state;
    }
  }

  const store = createStore(reducer);
  ```

- **提供 Store**

  ```jsx
  import { Provider } from "react-redux";

  function App() {
    return (
      <Provider store={store}>
        <Child />
      </Provider>
    );
  }
  ```

- **消费数据**

  ```jsx
  import { useSelector, useDispatch } from "react-redux";

  function Child() {
    const message = useSelector((state) => state.message);
    const dispatch = useDispatch();

    return (
      <div>
        <div>{message}</div>
        <button
          onClick={() => dispatch({ type: "UPDATE_MESSAGE", payload: "Hello" })}
        >
          Update
        </button>
      </div>
    );
  }
  ```

---

### 三、状态管理工具

#### 1. **Recoil**

- **定义状态**

  ```jsx
  import { atom, useRecoilState } from "recoil";

  const messageState = atom({
    key: "messageState",
    default: "",
  });
  ```

- **使用状态**
  ```jsx
  function Child() {
    const [message, setMessage] = useRecoilState(messageState);
    return (
      <div>
        <div>{message}</div>
        <button onClick={() => setMessage("Hello")}>Update</button>
      </div>
    );
  }
  ```

#### 2. **MobX**

- **定义 Store**

  ```jsx
  import { makeAutoObservable } from "mobx";

  class MessageStore {
    message = "";
    constructor() {
      makeAutoObservable(this);
    }
    setMessage(value) {
      this.message = value;
    }
  }

  const messageStore = new MessageStore();
  ```

- **使用 Store**

  ```jsx
  import { observer } from "mobx-react-lite";

  const Child = observer(() => {
    return (
      <div>
        <div>{messageStore.message}</div>
        <button onClick={() => messageStore.setMessage("Hello")}>Update</button>
      </div>
    );
  });
  ```

---

### 四、常见面试问题与解决方案

#### 1. **如何避免 Props Drilling？**

- **使用 Context API**：将数据提升到全局，避免逐层传递。
- **使用状态管理工具**：如 Redux、Recoil、MobX。

#### 2. **如何实现兄弟组件通信？**

- **通过共同的父组件**：将状态提升到父组件，通过 Props 和回调函数传递。
- **使用状态管理工具**：如 Redux、Recoil。

#### 3. **Context API 和 Redux 的区别？**

- **Context API**：适合小型应用或局部状态管理。
- **Redux**：适合大型应用，提供更强大的状态管理和调试工具。

#### 4. **如何优化 Context 的性能？**

- **拆分 Context**：将不同状态拆分为多个 Context，避免不必要的渲染。
- **使用 `useMemo` 和 `useCallback`**：缓存值和回调函数。

#### 5. **Redux 中间件的作用是什么？**

- **处理异步操作**：如 `redux-thunk` 或 `redux-saga`。
- **日志记录**：如 `redux-logger`。

---

### 五、综合示例

以下是一个使用 Context API 和 Redux 的综合示例：

```jsx
// Context API 示例
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      style={{ background: theme === "light" ? "#fff" : "#333" }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Toggle Theme
    </button>
  );
}

// Redux 示例
import { createStore } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";

const initialState = { count: 0 };
function reducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);

function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>Increment</button>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

---

### 六、总结

React 中的数据通信方式包括：

1. **组件间通信**：Props、回调函数、Context API
2. **跨层级通信**：Context API、Redux、Recoil、MobX
3. **状态管理工具**：Redux（适合大型应用）、Recoil（轻量级）、MobX（响应式）

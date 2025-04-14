# React 核心概念 - 面试指南

## 1. React 的设计思想

### 1.1 核心理念

React 的核心理念包括：

1. **声明式编程**

```jsx
// 问题：声明式和命令式编程的区别？
// 答：声明式关注"做什么"，命令式关注"怎么做"

// 声明式（React方式）
function Welcome() {
  return <h1>Hello, React</h1>;
}

// 命令式（传统方式）
function Welcome() {
  const element = document.createElement("h1");
  element.innerHTML = "Hello, React";
  return element;
}
```

2. **组件化**

```jsx
// 问题：React 组件化的优势是什么？
// 答：复用性、可维护性、关注点分离

// 可复用的组件示例
function Button({ type, onClick, children }) {
  return (
    <button className={`btn-${type}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 组件组合
function App() {
  return (
    <div>
      <Button type="primary" onClick={() => {}}>
        提交
      </Button>
      <Button type="danger" onClick={() => {}}>
        删除
      </Button>
    </div>
  );
}
```

3. **单向数据流**

```jsx
// 问题：为什么 React 强调单向数据流？
// 答：可预测性、易于调试、数据流向清晰

function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}
```

### 1.2 Virtual DOM

```jsx
// 问题：Virtual DOM 的工作原理是什么？
// 答：
// 1. 生成虚拟 DOM 树
// 2. diff 算法比较差异
// 3. 批量更新真实 DOM

function Example() {
  const [list, setList] = useState(["A", "B"]);

  return (
    <ul>
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Virtual DOM 的优势：
// 1. 跨平台
// 2. 批量更新
// 3. 性能优化
```

## 2. React 组件化开发

### 2.1 组件类型与使用

> 面试题：React 中的组件类型有哪些？如何选择合适的组件类型？

```jsx
// 🤔 问题：函数组件和类组件的区别是什么？各自的优缺点？
// ✅ 答案：
// 1. 函数组件优势：
//    - 代码简洁，易于理解和测试
//    - 更好的性能优化（无实例化开销）
//    - 支持 Hooks，更灵活的状态管理
//    - 更好的代码复用和逻辑提取
// 2. 类组件优势：
//    - 完整的生命周期
//    - 内部状态管理
//    - 适合复杂组件

// 1. 函数组件（推荐）
function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  // 使用 Hooks 处理副作用
  useEffect(() => {
    document.title = `${user.name}'s Profile`;
    return () => {
      document.title = "React App";
    };
  }, [user.name]);

  return (
    <div>
      <h2>{user.name}</h2>
      {isEditing ? (
        <EditForm user={user} />
      ) : (
        <button onClick={() => setIsEditing(true)}>编辑资料</button>
      )}
    </div>
  );
}

// 2. 类组件
class UserList extends React.Component {
  state = {
    users: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const users = await api.getUsers();
    this.setState({ users, loading: false });
  };

  render() {
    const { users, loading } = this.state;
    if (loading) return <Loading />;

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }
}
```

### 2.2 组件通信方式

> 面试题：React 组件间如何进行通信？各种通信方式的优缺点是什么？

```jsx
// 🤔 问题：React 中有哪些组件通信方式？如何选择？
// ✅ 答案：
// 1. Props：父子组件通信的基本方式
// 2. Context：跨层级组件通信
// 3. 状态管理库：复杂应用的状态管理
// 4. 发布订阅：组件间的事件通信
// 5. Ref：直接操作子组件

// 1. Props 通信
function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}

// 2. Context 通信
const ThemeContext = React.createContext("light");

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <MainContent />
      <Footer />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      切换主题
    </button>
  );
}

// 3. 状态管理（Redux 示例）
const Counter = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({ type: "INCREMENT" })}>
      Count: {count}
    </button>
  );
};
```

### 2.3 组件设计模式

> 面试题：React 中常用的组件设计模式有哪些？

```jsx
// 🤔 问题：如何设计可复用的组件？常用的设计模式有哪些？
// ✅ 答案：
// 1. 复合组件模式
// 2. 高阶组件（HOC）
// 3. Render Props
// 4. 自定义 Hooks

// 1. 复合组件模式
function Select({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="select">
      <Select.Trigger onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <Select.Options>{children}</Select.Options>}
    </div>
  );
}

Select.Trigger = function Trigger({ onClick }) {
  return <button onClick={onClick}>选择</button>;
};

Select.Options = function Options({ children }) {
  return <div className="options">{children}</div>;
};

// 2. 高阶组件（HOC）
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Loading />;
    return <WrappedComponent {...props} />;
  };
}

// 3. Render Props
class Mouse extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// 4. 自定义 Hooks
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```

### 2.4 最佳实践

1. **组件职责单一**
2. **保持组件纯函数特性**
3. **合理使用 Props 类型检查**
4. **避免过度设计**
5. **注意性能优化**

## 3. JSX 是什么，它和 JS 有什么区别

### 3.1 JSX 基本概念

> 面试题：什么是 JSX？为什么要使用 JSX？

```jsx
// 🤔 问题：JSX 和普通 JavaScript 有什么区别？
// ✅ 答案：
// 1. JSX 是 JavaScript 的语法扩展
// 2. 允许在 JS 中编写类 HTML 代码
// 3. 最终会被编译为普通的 JavaScript 函数调用
// 4. 提供了声明式的视图描述方式

// JSX 语法
const element = <div className="greeting">Hello, {formatName(user)}</div>;

// 编译后的 JavaScript
const element = React.createElement(
  "div",
  { className: "greeting" },
  "Hello, ",
  formatName(user)
);
```

### 3.2 JSX 特性

1. **表达式嵌入**：

```jsx
// 🤔 问题：JSX 中如何嵌入 JavaScript 表达式？
// ✅ 答案：使用花括号 {} 嵌入任何有效的 JavaScript 表达式

function Greeting({ user }) {
  return (
    <div>
      {/* 条件渲染 */}
      {user ? <h1>Welcome back, {user.name}!</h1> : <h1>Please log in.</h1>}

      {/* 列表渲染 */}
      <ul>
        {user.permissions.map((perm) => (
          <li key={perm.id}>{perm.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

2. **属性定义**：

```jsx
// 🤔 问题：JSX 中的属性与 HTML 属性有什么区别？
// ✅ 答案：
// 1. 使用 camelCase 命名
// 2. class 变为 className
// 3. 可以使用表达式赋值
// 4. 某些属性名称不同（如：for -> htmlFor）

function Button({ isActive, onClick }) {
  return (
    <button
      className={`btn ${isActive ? "active" : ""}`}
      onClick={onClick}
      disabled={!isActive}
      data-testid="custom-button"
    >
      点击我
    </button>
  );
}
```

### 3.3 JSX 编译过程

```jsx
// 🤔 问题：JSX 是如何被转换成 JavaScript 的？
// ✅ 答案：
// 1. Babel 等工具将 JSX 转换为 React.createElement() 调用
// 2. React 17+ 使用新的 JSX 转换，无需显式引入 React
// 3. 最终生成虚拟 DOM 对象

// 原始 JSX
function App() {
  return (
    <div>
      <h1 className="title">Hello</h1>
      <p style={{ color: "red" }}>World</p>
    </div>
  );
}

// 转换后的代码（React 17 之前）
function App() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "title" }, "Hello"),
    React.createElement("p", { style: { color: "red" } }, "World")
  );
}

// React 17+ 的新 JSX 转换
import { jsx as _jsx } from "react/jsx-runtime";

function App() {
  return _jsx("div", {
    children: [
      _jsx("h1", { className: "title", children: "Hello" }),
      _jsx("p", { style: { color: "red" }, children: "World" }),
    ],
  });
}
```

### 3.4 JSX 最佳实践

```jsx
// 🤔 问题：使用 JSX 时应该注意什么？
// ✅ 答案：
// 1. 始终使用适当的键值
// 2. 避免复杂的内联表达式
// 3. 适当拆分组件
// 4. 注意 JSX 的限制

// ✅ 好的实践
function GoodExample() {
  const items = ["A", "B", "C"];
  const handleClick = useCallback(() => {
    // 处理点击
  }, []);

  return (
    <div>
      {/* 使用 key */}
      {items.map((item, index) => (
        <ListItem key={item} data={item} />
      ))}

      {/* 提取复杂逻辑 */}
      <ComplexComponent onClick={handleClick} />
    </div>
  );
}

// ❌ 不好的实践
function BadExample() {
  return (
    <div>
      {/* 避免复杂的内联表达式 */}
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            // 复杂的内联处理逻辑
            doSomething();
            doSomethingElse();
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

## 4. React 事件机制

### 4.1 事件系统概述

> 面试题：React 的事件系统是如何工作的？与原生 DOM 事件有什么不同？

```jsx
// 🤔 问题：React 事件和原生 DOM 事件有什么区别？
// ✅ 答案：
// 1. 事件委托：React 统一在 root 节点监听
// 2. 事件合成：React 封装了事件对象
// 3. 命名规范：使用 camelCase
// 4. 跨浏览器兼容：React 统一了事件处理

// React 事件示例
function Button() {
  const handleClick = (e) => {
    // e 是 React 的合成事件对象
    e.preventDefault();
    console.log("按钮被点击");
  };

  return <button onClick={handleClick}>点击我</button>;
}
```

### 4.2 事件委托机制

```jsx
// 🤔 问题：React 为什么要使用事件委托？有什么优势？
// ✅ 答案：
// 1. 提高性能：减少事件监听器数量
// 2. 节省内存：统一管理事件
// 3. 动态元素：自动处理新增元素的事件

function TodoList() {
  const handleItemClick = (id) => {
    console.log(`点击了项目 ${id}`);
  };

  return (
    <ul>
      {/* 所有 li 的点击事件都委托到父元素处理 */}
      {items.map((item) => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
```

### 4.3 合成事件（SyntheticEvent）

```jsx
// 🤔 问题：什么是合成事件？为什么需要合成事件？
// ✅ 答案：
// 1. 跨浏览器标准化
// 2. 性能优化
// 3. 统一的事件处理方式

function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止默认行为
    const syntheticEvent = e; // React 合成事件
    const nativeEvent = e.nativeEvent; // 原生 DOM 事件

    console.log(syntheticEvent.target); // 当前元素
    console.log(syntheticEvent.currentTarget); // 事件处理绑定元素
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(e) => {
          // e.persist(); // React 17+ 不再需要
          console.log(e.target.value);
        }}
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

### 4.4 事件处理最佳实践

```jsx
// 🤔 问题：React 事件处理的最佳实践有哪些？
// ✅ 答案：
// 1. 使用事件委托
// 2. 避免内联函数
// 3. 适当的事件绑定方式
// 4. 注意事件清理

function GoodPractice() {
  // 1. 使用 useCallback 缓存事件处理函数
  const handleClick = useCallback((e) => {
    console.log("按钮点击");
  }, []);

  // 2. 事件处理函数命名规范
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    // 处理提交
  }, []);

  // 3. 清理副作用
  useEffect(() => {
    const handleScroll = () => {
      console.log("滚动");
    };

    window.addEventListener("scroll", handleScroll);

    // 清理事件监听
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* 避免内联函数 */}
      <button onClick={handleClick}>点击</button>

      <form onSubmit={handleSubmit}>
        <button type="submit">提交</button>
      </form>
    </div>
  );
}
```

### 4.5 常见问题和解决方案

```jsx
// 🤔 问题：React 事件处理中的常见问题有哪些？

// 1. 事件绑定中的 this 问题
class ClassComponent extends React.Component {
  // 推荐：使用箭头函数
  handleClick = () => {
    console.log("this is:", this);
  };

  // 或者在构造函数中绑定
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return <button onClick={this.handleClick}>点击</button>;
  }
}

// 2. 事件参数传递
function EventParams() {
  // 传递额外参数
  const handleClick = useCallback((id, e) => {
    console.log("ID:", id);
    console.log("Event:", e);
  }, []);

  return <button onClick={(e) => handleClick("123", e)}>点击</button>;
}

// 3. 事件冒泡控制
function StopPropagation() {
  return (
    <div onClick={() => console.log("外层点击")}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 阻止冒泡
          console.log("按钮点击");
        }}
      >
        点击
      </button>
    </div>
  );
}
```

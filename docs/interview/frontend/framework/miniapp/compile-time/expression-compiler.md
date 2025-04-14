# expression-compiler 实现原理与关键代码

### 1. 整体架构

expression-compiler 是小程序开发框架中的表达式编译器，用于处理模板中的数据绑定表达式（如 {{ user }}、{{ a + b }}）。它将这些表达式编译成可在运行时高效执行的 JavaScript 代码。

编译器采用经典的三阶段编译流程：

- 词法分析（Tokenizer）：将表达式字符串拆分为标记（Token）序列
- 语法分析（Parser）：将标记序列转换为抽象语法树（AST）
- 代码生成（Generator）：将抽象语法树转换为 JavaScript 代码

### 2. 核心实现

#### 2.1 编译入口

compiler 函数作为主入口，协调整个编译过程：

```typescript
export const compiler = (input: string, options: Options = {}) => {
  // 1. 词法分析：将输入字符串转换为标记流
  const tokens = tokenizer(input, options);

  // 2. 语法分析：将标记流构建为抽象语法树
  const ast = parser(tokens);

  // 3. 代码生成：将抽象语法树转换为 JavaScript 代码
  const { expression, ...rest } = generator(ast);

  // 4. 验证生成的表达式是否有语法错误
  const code =
    "function **EXPRESSION**(v){}; function **EXP**(v){}; function **ARG**(v){}; return " +
    expression;
  try {
    new Function("ctx", code);
  } catch (e) {
    throw new SyntaxError(`Invalid expression: '${input}'`);
  }

  return { ...rest, expression };
};
```

#### 2.2 词法分析器 (Tokenizer)

词法分析器负责识别表达式中的各种语法元素，如变量、运算符、分隔符等，并将它们转换为标记：

```typescript
export function tokenizer(input: string, options?: Options): TNode[] {
  // 创建解析上下文
  const context = createParseContext(input);
  const nodes: TNode[] = [];

  // 逐字符分析输入字符串
  while (!isEnd(context)) {
    // 识别表达式边界 {{ ... }}
    if (isExpressionStart(context)) {
      const node = tokenizerExp(context);
      pushNode(nodes, node);
    } else if (isExpressionEnd(context)) {
      const node = { type: NodeTypes.Expression, close: true };
      pushNode(nodes, node);
      advanceBy(context, close.length);
    }
    // 识别更多的标记类型...
    else if (getCurrentChar(context) === SYMBOLS.LEFT_PAREN) {
      const node = tokenizerGroup(context);
      pushNode(nodes, node);
    }
    // 其他标记类型的处理...
    else {
      // 处理普通表达式内容
      const node = tokenizerExpNode(context);
      pushNode(nodes, node);
    }
  }

  return nodes;
}
```

词法分析器定义了多种标记类型，包括：

- Identifier：标识符（变量名）
- Literal：字符串字面量
- NumberLiteral：数字字面量
- Operator：运算符
- Expression：表达式边界
- 以及其他类型，如对象、数组、模板字符串等

#### 2.3 语法分析器 (Parser)

语法分析器将标记流转换为抽象语法树，识别表达式的结构和语义：

```typescript
export function parser(tokens: TNode[]): AstNode {
  let current = 0;
  const tokensLen = tokens.length;

  function walk(): AstNode {
    let token = tokens[current];
    const { isSpreadTarget } = token;
    const node: AstNode = {};

    if (isSpreadTarget) {
      node.isSpreadTarget = true;
    }

    // 根据不同的标记类型构建 AST 节点
    if (token.type === NodeTypes.Expression && token.open) {
      // 处理表达式
      Object.assign(node, { type: AstTypes.Expression, params: [] });
      token = tokens[++current];
      while (token.type !== NodeTypes.Expression) {
        const astNode = walk();
        node.params.push(astNode);
        token = tokens[current];
      }
      current++;
    } else if (token.type === NodeTypes.Identifier) {
      // 处理标识符和属性访问
      const nextToken = getNextTokenNotSpace();
      if (
        (nextToken &&
          [NodeTypes.Dot, NodeTypes.ArrayExpression].includes(
            nextToken.type
          )) ||
        !nextToken
      ) {
        // 处理属性访问链，如 a.b.c 或 a[b]
        Object.assign(node, {
          type: AstTypes.DataExpression,
          elements: [token.text],
        });
        token = tokens[++current];
        while (
          token &&
          [
            NodeTypes.MemberIdentifier,
            NodeTypes.MethodIdentifier,
            NodeTypes.Dot,
            NodeTypes.ArrayExpression,
          ].includes(token.type)
        ) {
          // 处理属性访问链的各部分
          // ...
        }
      } else {
        // 处理单独的标识符
        current++;
        if (/^([.\d]+)$/.test(token.text)) {
          // 数字
          Object.assign(node, {
            type: AstTypes.NumberLiteral,
            value: token.text,
          });
        } else if (/^(false|true)$/.test(token.text)) {
          // 布尔值
          Object.assign(node, {
            type: AstTypes.BooleanLiteral,
            value: token.text,
          });
        } else if (BUILTIN_OBJECT.test(token.text)) {
          // 内置对象
          Object.assign(node, {
            type: AstTypes.BuiltinLiteral,
            value: token.text,
          });
        } else {
          // 变量
          Object.assign(node, {
            type: AstTypes.DataExpression,
            elements: [token.text],
          });
        }
      }
    }
    // 处理更多标记类型...

    return node;
  }

  // 开始解析
  return walk();
}
```

语法分析器引入了更多的 AST 类型，包括：

- DataExpression：数据访问表达式（如 user）
- IndexExpression：索引访问表达式（如 array[index]）
- ObjectExpression：对象表达式（如 {a: 1, b: 2}）
- ArrayExpression：数组表达式（如 [1, 2, 3]）

#### 2.4 代码生成器 (Generator)

代码生成器将 AST 转换为可执行的 JavaScript 代码，并收集表达式中使用的变量名：

```typescript
export function generator(node: AstNode) {
  exps.clear();
  const expression = codeGenerator(node);
  return {
    expression,
    exps: Array.from(exps).filter((n) => !["i18n", "I18n"].includes(n)),
  };
}

function codeGenerator(
  node: AstNode | string,
  siblingNodes?: Array<AstNode | string>,
  nodeIndex?: number,
  expType?: ExpType
): string {
  // 根据节点类型生成代码
  const type = node.type;

  if (type === AstTypes.Text) {
    // 文本节点生成字符串字面量
    return JSON.stringify(node.value);
  } else if (type === AstTypes.DataExpression) {
    // 数据访问表达式，如 user
    const codeFrame = node.elements.map((item, index) => {
      return codeGenerator(item, node.elements, index, ExpType.DataExpression);
    });
    exps.add(JSON.parse(codeFrame[0])); // 收集变量名
    const code = `__EXP__(${codeFrame.join(",")})`;
    return code;
  } else if (type === AstTypes.Expression) {
    // 完整表达式
    const nodes = node.params;
    let codeFrame = nodes
      .map((node, index) => codeGenerator(node, nodes, index))
      .join("");
    if (!codeFrame.trim()) {
      codeFrame = "undefined";
    }
    return `__EXPRESSION__(${codeFrame})`;
  }
  // 处理更多 AST 节点类型...
}
```

代码生成器具有一些特殊的处理：

- 收集表达式中使用的变量名，用于后续的依赖追踪
- 使用特殊函数 **EXP** 包装属性访问，实现安全的属性访问
- 使用特殊函数 **EXPRESSION** 包装整个表达式
- 对方法调用添加可选链操作符 ?.，避免空对象调用方法时的错误

### 3. 核心技术特点

#### 3.1 安全的属性访问

expression-compiler 通过将属性访问表达式转换为特殊函数调用，实现了安全的属性访问，避免了常见的 "Cannot read property of undefined" 错误：

```javascript
// 原始表达式
{{ user.profile }}

// 编译后
**EXPRESSION**(**EXP**("user", "profile"))
```

在运行时，**EXP** 函数会检查每一层属性是否存在，避免访问 undefined 的属性。

#### 3.2 方法调用安全

对于方法调用，编译器添加了可选链操作符 ?.，确保在方法不存在时不会抛出错误：

```javascript
// 原始表达式
{{ user.getFullName() }}

// 编译后
**EXPRESSION**(**EXP**("user", "getFullName")?.())
```

#### 3.3 表达式变量收集

编译器会收集表达式中使用的所有变量名，用于后续的依赖追踪和响应式更新：

```javascript
// 收集变量名
exps.add(JSON.parse(codeFrame[0]));

// 返回结果
return {
  expression,
  exps: Array.from(exps).filter((n) => !["i18n", "I18n"].includes(n)),
};
```

这使得框架可以知道哪些数据变化会影响当前表达式，从而精确地触发更新。

#### 3.4 错误处理和语法验证

编译器通过尝试创建函数来验证生成的 JavaScript 代码是否有语法错误：

```javascript
const code =
  "function **EXPRESSION**(v){}; function **EXP**(v){}; function **ARG**(v){}; return " +
  expression;
try {
  new Function("ctx", code);
} catch (e) {
  throw new SyntaxError(`Invalid expression: '${input}'`);
}
```

这确保了只有语法正确的表达式才会被编译通过。

### 4. 使用示例

#### 4.1 简单的数据绑定

```javascript
// 模板中的表达式
{{ user }}

// 编译后的代码
**EXPRESSION**(**EXP**("user"))

// 收集的变量
["user"]
```

#### 4.2 复杂表达式

```javascript
// 模板中的表达式
{{ user.age > 18 ? '成年' : '未成年' }}

// 编译后的代码
**EXPRESSION**(**EXP**("user", "age") > 18 ? "成年" : "未成年")

// 收集的变量
["user"]
```

#### 4.3 方法调用

```javascript
// 模板中的表达式
{{ user.getName(firstName, lastName) }}

// 编译后的代码
**EXPRESSION**(**EXP**("user", "getName")?.(firstName, lastName))

// 收集的变量
["user", "firstName", "lastName"]
```

### 5. 总结

expression-compiler 是小程序框架中关键的表达式处理组件，它通过词法分析、语法分析和代码生成三个阶段，将模板中的表达式转换为可安全执行的 JavaScript 代码。其主要特点包括：

- 完整的编译流程：包含词法分析、语法分析和代码生成三个阶段
- 安全的属性访问：避免访问 undefined 的属性时报错
- 变量依赖收集：收集表达式中使用的变量，用于响应式更新
- 丰富的表达式支持：支持对象、数组、方法调用等复杂表达式
- 语法错误检测：在编译阶段就能发现表达式的语法错误

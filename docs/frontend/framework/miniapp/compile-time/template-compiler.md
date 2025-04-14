# Template-Compiler 实现原理

template-compiler 是小程序构建器的核心组件之一，负责将小程序模板文件（tyml）编译成可执行的 JavaScript 代码。从代码分析来看，它实现了一个完整的模板编译流水线，主要包括以下几个关键步骤：

### 1. 词法分析 (Tokenizer)

在 tokenizer.ts 中实现，主要功能：

- 对模板源码进行字符级扫描，将其转换为标记流（Token Stream）
- 识别和分类不同类型的标记，包括：
  - Tag（标签）：如 `<view>`
  - Text（文本内容）
  - Space（空格）
  - Comment（注释）
  - Attribute（属性）：如 `class="btn"`
  - Operator（操作符）：如 `=`
- 处理标签的开闭合、自闭合等结构
- 特殊处理安全脚本标签（如 `sjs`）
- 使用上下文（Context）对象追踪解析状态和位置

核心方法包括：

- `tokenizer(input, options)`: 主入口函数
- `tokenizerTag`, `tokenizerTagEnd`: 处理标签开始和结束
- `tokenizerSjs`: 处理 `sjs` 脚本标签
- `tokenizerTemplate`: 处理模板字符串

### 2. 语法分析 (Parser)

在 parser.ts 中实现，主要功能：

- 接收 tokenizer 生成的标记流，构建抽象语法树（AST）
- 验证标签嵌套和闭合是否合法（tokenVerify 函数）
- 处理特殊指令，如条件渲染 (`ty:if`, `ty:elif`, `ty:else`) 和列表渲染 (`ty:for`)
- 识别和处理事件绑定，如 `bind:tap`、`catch:tap`
- 处理属性绑定与数据绑定表达式

整个解析过程采用递归下降的方式（walk 函数），构建树状结构：

- 以 `program` 为根节点
- 包含 `tag`（标签）和 `text`（文本）等节点类型
- 属性被归类为 `attributes`、`events`、`directive`、`change` 四种类型

### 3. 代码生成 (Generator)

在 Generator/index.ts 中实现，主要功能：

- 将 AST 转换为可执行的 JavaScript 代码
- 处理模板中的表达式求值（通过 `@ulanxx/expression-compiler`）
- 处理安全脚本（SJS）的导入和转换（通过 `@ulanxx/transform-sjs-code`）
- 生成模块导入代码、模板包含代码
- 实现标签收集器，优化标签名称的存储
- 支持条件渲染、列表渲染等复杂指令的代码生成
- 实现事件处理器的代码生成
- 处理样式和属性的标准化（normalizeStyle、normalizeProps）

关键功能实现：

- 表达式处理：wrapExpression, runExpression, expressionCode
- 条件渲染：condition, elseCondition
- 列表渲染：forLoop
- 事件处理：eventHandler
- 标签管理：TagCollector 类

### 4. 整体流程

整个编译过程的入口在 index.ts 中的 compiler 函数：

- 首先调用 tokenizer 进行词法分析，生成标记流
- 然后调用 parser 进行语法分析，构建 AST
- 最后调用 codeGenerator 进行代码生成，输出可执行的 JavaScript 代码

编译器支持一些配置选项：

- `directivePrefix`: 指令前缀，默认为 `['ty:']`
- `safeScriptTag`: 安全脚本标签，默认为 `['sjs']`

### 5. 技术亮点

- 模块化设计：将编译过程分为词法分析、语法分析、代码生成三个独立模块
- 可扩展性：支持自定义指令前缀和安全脚本标签
- 安全性考虑：专门处理 SJS（安全脚本）代码，将其转换为运行时可用的格式
- 表达式编译：与独立的表达式编译器集成，处理复杂的数据绑定表达式
- 错误处理：提供详细的编译错误信息，便于开发者调试

### 6. 关键代码

#### 6.1 入口

```typescript
export function compiler(template: string, options?: CompilerOptions) {
  const tokenizer = new Tokenizer(template, options);
  const parser = new Parser(tokenizer);
  const codeGenerator = new CodeGenerator(parser);
  return codeGenerator.generate();
}
```

#### 6.2 词法分析器 (tokenizer.ts)

词法分析的主函数，将模板字符串转换为标记流：

```typescript
export class Tokenizer {
  private readonly tokenizer: Tokenizer;
  private readonly tokenizerTag: TokenizerTag;
  private readonly tokenizerTagEnd: TokenizerTagEnd;
  private readonly tokenizerSjs: TokenizerSjs;
  private readonly tokenizerTemplate: TokenizerTemplate;

  constructor(template: string, options?: CompilerOptions) {
    this.tokenizer = new Tokenizer(template, options);
    this.tokenizerTag = new TokenizerTag(options);
    this.tokenizerTagEnd = new TokenizerTagEnd(options);
    this.tokenizerSjs = new TokenizerSjs(options);
    this.tokenizerTemplate = new TokenizerTemplate(options);
  }

  public tokenize(): Token[] {
    return this.tokenizer.tokenize();
  }

  public tokenizer(
    input: string,
    options?: { safeScriptTag: string[] }
  ): TNode[] {
    const { safeScriptTag = ["sjs"] } = options || {};
    const context = createParseContext(input);
    const nodes: TNode[] = [];

    while (!isEnd(context)) {
      const char = getCurrentChar(context);

      // 处理标签开始
      if (char === SYMBOLS.openTag && getNextChar(context) === "/") {
        const ts = tokenizerTagEnd(context);
        pushNode(nodes, ts);
      } else if (char === SYMBOLS.openTag && isTagStart(context)) {
        const ts = tokenizerTag(context);
        pushNode(nodes, ts);
      } else if (afterSjsTag(nodes, safeScriptTag)) {
        // 处理 sjs 标签内容
        const ts = tokenizerSjs(context, safeScriptTag);
        pushNode(nodes, ts);
      } else if (char === "{") {
        // 处理模板表达式 {{...}}
        const ts = tokenizerTemplate(context);
        pushNode(nodes, ts);
      } else {
        // 处理普通文本
        const token: TNode = { type: NodeTypes.Text, text: char };
        pushNode(nodes, token);
        advanceBy(context, 1);
      }
    }

    return nodes;
  }
}
```

#### 6.3 语法分析器 (Parser)

```typescript
export function parser(
  tokens: TNode[],
  options?: { directivePrefix: string[] }
): TAstNode {
  const { directivePrefix = ["ty:"] } = options || {};
  const RRG_DIRECTIVE = new RegExp(
    `^(${directivePrefix.join("|")})(if|else|elif|for|for-item|for-index|key)$`
  );

  tokenVerify(tokens); // 验证标签嵌套是否合法

  let current = 0;
  const node: TAstNode = { type: "program" };

  // 递归下降解析函数
  function walk(parentNode: TAstNode): TAstNode {
    let token = tokens[current];

    if (token.type === NodeTypes.Text) {
      current++;
      return { type: "text", text: token.text };
    } else if (token.type === NodeTypes.Tag && token.open) {
      // 处理标签节点
      const node: TAstNode = { type: "tag", name: token.name };
      const nodeStack = [];
      nodeStack.push(token.name);
      token = tokens[++current];

      // 直到节点结束
      while (nodeStack.length > 0) {
        const childNode = walk(node);
        pushNode(node, childNode);

        if (token.type === NodeTypes.Tag && token.end) {
          nodeStack.pop();
        }
        token = tokens[current];
      }
      return node;
    } else if (token.type === NodeTypes.Attribute) {
      current++;
      // 处理属性
      let name = token.name;
      let attrType: "attributes" | "events" | "directive" | "change" =
        "attributes";

      if (REG_EVENT.test(name)) {
        attrType = "events";
        // 处理事件属性
      } else if (RRG_DIRECTIVE.test(name)) {
        attrType = "directive";
        // 处理指令属性
      }

      // 设置属性值
      parentNode[attrType] = parentNode[attrType] || {};
      parentNode[attrType][name] = token.operator ? token.value || "" : true;
    }
    // 其他情况处理...
  }

  while (current < tokens.length) {
    const childNode = walk(node);
    pushNode(node, childNode);
  }

  return node;
}
```

#### 6.4. 代码生成器 (Generator/index.ts)

将 AST 转换为 JavaScript 代码的核心方法：

```typescript
export class Generator {
  // 类成员初始化略...

  generate(ast: TAstNode): string {
    // 处理根节点
    if (ast.type !== "program") {
      throw new Error("[Compiler] AST rootNode must be program type");
    }

    // 处理子节点
    let code = this.generateChildren(ast.children);

    // 整合代码
    return `
      ${this.templateImportCode()}
      ${this.templateIncludeCode()}
      ${this.safeScriptImportCode()}
      
      export default function template(ctx) {
        // 模板变量定义
        var SAFE_SCRIPT = {};
        var templateUsage = {};
        var templateExport = {};
        var ROOT_NODES = [];
        ${this.tagsCode()}
        
        // 模板函数
        ${code}
        
        // 安全脚本处理
        ${this.safeScriptAssignCode()}
        ${this.safeScriptInlineCode()}
        
        // 模板模块处理
        ${this.templateModuleCode()}
        
        return ROOT_NODES;
      };
    `;
  }

  // 处理节点
  private generateNode(node: TAstNode) {
    if (node.type === "tag") {
      // 处理标签节点
      return this.generateTag(node);
    } else if (node.type === "text") {
      // 处理文本节点
      return this.generateText(node);
    }
  }

  // 处理标签节点
  private generateTag(node: TAstNode) {
    const tagId = this.tagCollector.add(node.name);
    let attrs = "UNDEF";
    let events = "UNDEF";

    // 处理属性
    if (node.attributes) {
      const { codeFrame, isStatic } = this.expressionCode(node.attributes);
      attrs = codeFrame;
    }

    // 处理事件
    if (node.events) {
      events = this.generateEventHandlers(node.events);
    }

    // 处理条件渲染
    if (
      node.directive &&
      ("if" in node.directive || "elif" in node.directive)
    ) {
      // 条件渲染代码生成...
    }

    // 处理列表渲染
    if (node.directive && "for" in node.directive) {
      // 列表渲染代码生成...
    }

    // 普通节点渲染
    return `
      var node_${this.tid()} = __CREATE_ELEMENT__(
        TAGS[${tagId}],
        ${attrs},
        ${events},
        ${this.generateChildren(node.children)}
      );
    `;
  }

  // 处理表达式
  private runExpression(expression: string | boolean, clearSetValue = true) {
    return `__RUN_EXPRESSION__(ctx, SAFE_SCRIPT, ${this.wrapExpression(
      expression
    )}, ${clearSetValue})`;
  }

  private wrapExpression(expression: string | boolean) {
    return `function(__EXP__, __EXPRESSION__){ return ${expression} }`;
  }
}
```

#### 6.5 指令处理示例 (ty:if 条件渲染)

```typescript
// Parser 中处理条件指令
if (child.directive && ('else' in child.directive || 'elif' in child.directive)) {
  let idx = parent.children.length;
  if (idx == 0) {
    throw new Error(`[Compiler] template parse error, "else" or "elif" must be after "if" condition expression`);
  }

  // 收集前面的条件
  while (idx) {
    idx--;
    const prevNode = parent.children[idx];
    if (prevNode.directive && 'elif' in prevNode.directive) {
      condition.push(prevNode.directive['elif']);
    } else if (prevNode.directive && 'if' in prevNode.directive) {
      condition.push(prevNode.directive['if']);
      break;
    } else {
      throw new Error(`[Compiler] template parse error, "else" or "elif" must be after "if" condition expression`);
    }
  }

  // 设置反向条件
  child.directive['not-if'] = condition;
}

// Generator 中生成条件渲染代码
private condition(node: TAstNode, children: string) {
  const condition = node.directive.if;
  const { expression } = expressionCompiler({ input: condition });

  return `
    if (${this.runExpression(expression)}) {
      ${children}
    }
  `;
}
```

#### 6.6 表达式处理

```typescript
// 处理表达式编译
private expressionCode(attributes: Record<string, string | boolean>) {
  let isStatic = true;
  if (!attributes) {
    return { codeFrame: 'UNDEF', isStatic };
  }

  let codeFrame = `{`;
  Object.keys(attributes).forEach((key) => {
    const { expression, exps } = expressionCompiler({ input: attributes[key] });
    if (exps.length === 0) {
      // 静态表达式
      if (key === 'style') {
        codeFrame += `"${key}": ${this.wrapExpression(`_normalizeStyle(${expression})`)},`;
      } else {
        codeFrame += `"${key}": ${this.wrapExpression(expression)},`;
      }
    } else {
      // 动态表达式
      isStatic = false;
      if (key === 'style') {
        codeFrame += `"${key}": ${this.wrapExpression(`_normalizeStyle(_normalizeProps(${expression}))`)},`;
      } else {
        codeFrame += `"${key}": ${this.wrapExpression(`_normalizeProps(${expression})`)},`;
      }
    }
  });
  codeFrame += '}';

  return { codeFrame, isStatic };
}
```

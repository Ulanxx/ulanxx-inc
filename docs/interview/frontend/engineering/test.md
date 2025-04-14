# 前端测试

## **1. 前端测试有哪几种类型？它们的区别是什么？**

✅ **考察点**：测试分类、适用场景。

✅ **示例回答**：
前端测试主要分为以下几种：

1. **单元测试（Unit Test）**
   - 测试**单个函数/组件**，保证核心逻辑正确。
   - 工具：Jest、Vitest、Mocha
2. **集成测试（Integration Test）**
   - 测试**多个模块协同工作**，例如 Redux Store 和 API 交互。
   - 工具：Jest + React Testing Library
3. **端到端测试（E2E Test）**
   - 模拟真实用户操作（点击、输入等），测试整个应用流程。
   - 工具：Cypress、Playwright
4. **UI 组件测试（Snapshot Test）**
   - 确保 UI 组件的渲染结果不变。
   - 工具：Jest + react-test-renderer
5. **性能测试（Performance Test）**
   - 监控页面加载、交互响应时间，找出性能瓶颈。
   - 工具：Lighthouse、WebPageTest
6. **代码覆盖率测试（Coverage Test）**
   - 检测代码有多少被测试覆盖，避免遗漏关键逻辑。
   - 工具：Jest（`--coverage`）、Istanbul

---

## **2. 为什么要做单元测试？**

✅ **考察点**：单元测试的作用、必要性。

✅ **示例回答**：

1. **提升代码质量**：单元测试可以尽早发现 bug，避免线上崩溃。
2. **提升维护性**：有测试的代码更容易重构，不怕改动导致意外 bug。
3. **减少回归测试成本**：自动化测试减少手工测试，提升 CI/CD 效率。
4. **增强信心**：团队可以更放心地发布新功能，而不担心旧功能被破坏。

---

## **3. 你如何测试一个 React 组件？**

✅ **考察点**：React 组件的测试方法。

✅ **示例回答**：

1. **使用 React Testing Library 进行渲染和交互测试**：

   ```tsx
   import { render, screen, fireEvent } from "@testing-library/react";
   import Button from "./Button";

   test("按钮点击后触发回调", () => {
     const handleClick = jest.fn();
     render(<Button onClick={handleClick}>点击我</Button>);

     fireEvent.click(screen.getByText("点击我"));
     expect(handleClick).toHaveBeenCalledTimes(1);
   });
   ```

2. **使用快照测试（Snapshot Testing）**：

   ```tsx
   import renderer from "react-test-renderer";
   import Button from "./Button";

   test("按钮 UI 不能变更", () => {
     const tree = renderer.create(<Button>点击</Button>).toJSON();
     expect(tree).toMatchSnapshot();
   });
   ```

---

## **4. 端到端（E2E）测试和单元测试的区别？**

✅ **考察点**：E2E 和单元测试的侧重点。

✅ **示例回答**：
| 对比项 | 单元测试（Unit Test） | 端到端测试（E2E Test） |
|--------------|------------------|------------------|
| 关注点 | 测试**单个模块** | 测试**整个应用** |
| 运行速度 | **快**（毫秒级） | **慢**（秒级） |
| 依赖的环境 | **无依赖**（Mock API） | 需要真实服务器 |
| 适用场景 | 组件、函数逻辑测试 | 用户行为模拟 |
| 主要工具 | Jest、Mocha | Cypress、Playwright |

示例：

- **单元测试**：
  ```ts
  test("加法函数", () => {
    expect(add(1, 2)).toBe(3);
  });
  ```
- **E2E 测试**（Cypress）：
  ```js
  cy.visit("/login");
  cy.get("input[name=username]").type("admin");
  cy.get("input[name=password]").type("123456");
  cy.get("button").click();
  cy.contains("欢迎 admin").should("exist");
  ```

---

## **5. 代码覆盖率测试（Coverage Test）是什么？如何提高覆盖率？**

✅ **考察点**：代码覆盖率指标、优化策略。

✅ **示例回答**：
**代码覆盖率**指测试代码覆盖了多少业务代码，主要有：

1. **行覆盖率（Line Coverage）**：代码的执行行数比例。
2. **分支覆盖率（Branch Coverage）**：if/else 等逻辑是否被覆盖。
3. **函数覆盖率（Function Coverage）**：所有函数是否被调用。
4. **语句覆盖率（Statement Coverage）**：所有语句是否执行。

**提高覆盖率的方法**：

- **Mock 复杂依赖**，减少环境依赖：
  ```ts
  jest.mock("./api", () => ({
    fetchData: jest.fn(() => Promise.resolve({ data: "mocked data" })),
  }));
  ```
- **测试异常分支**：
  ```ts
  test("异常处理", () => {
    expect(() => myFunction(null)).toThrow();
  });
  ```

**执行覆盖率测试**：

```sh
jest --coverage
```

示例输出：

```
Statements   : 85.2% ( 92/108 )
Branches     : 78.6% ( 33/42 )
Functions    : 90% ( 18/20 )
Lines        : 85% ( 85/100 )
```

---

## **6. 如何进行前端性能测试？**

✅ **考察点**：性能优化、测试工具。

✅ **示例回答**：

1. **使用 Lighthouse 进行 Web 性能分析**：
   ```sh
   npx lighthouse https://example.com
   ```
2. **监控 Web Vitals（如 LCP、FID、CLS）**：
   ```ts
   import { getCLS, getLCP, getFID } from "web-vitals";
   getLCP(console.log);
   getFID(console.log);
   getCLS(console.log);
   ```
3. **使用 Puppeteer 模拟页面加载**：
   ```js
   const puppeteer = require("puppeteer");
   (async () => {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     await page.goto("https://example.com");
     console.log(await page.metrics());
     await browser.close();
   })();
   ```

---

## **7. 你如何在 CI/CD 流程中集成前端测试？**

✅ **考察点**：测试自动化、CI/CD。

✅ **示例回答**：

1. **Jest 单元测试 + 代码覆盖率**：
   ```yaml
   jobs:
     test:
       script:
         - npm install
         - npm test -- --coverage
   ```
2. **Cypress E2E 测试**：
   ```yaml
   jobs:
     e2e:
       script:
         - npm run cypress:run
   ```

---

## **8. 如何 Mock API 请求？**

✅ **考察点**：测试独立性。

✅ **示例回答**：
使用 `msw`（Mock Service Worker）：

```ts
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/user", (req, res, ctx) => {
    return res(ctx.json({ name: "Mocked User" }));
  })
);
```

---

## **9. 如何避免 flaky test（不稳定的测试）？**

✅ **考察点**：测试稳定性。

✅ **示例回答**：

1. **等待特定元素出现**：
   ```js
   cy.get("#loading", { timeout: 5000 }).should("not.exist");
   ```
2. **确保数据种子一致**：
   ```sh
   npm run seed-db
   ```

---

## **10. 你如何测试前端错误处理逻辑？**

✅ **考察点**：异常捕获测试。

✅ **示例回答**：

```ts
test("异常处理", () => {
  expect(() => myFunction(null)).toThrow("Invalid input");
});
```

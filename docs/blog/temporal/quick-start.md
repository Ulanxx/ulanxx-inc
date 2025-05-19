# Temporal 快速上手指南 🚀

### 一个实践案例

[deepseek-node-temporal-openinsight](https://github.com/Ulanxx/deepseek-node-temporal-openinsight)。

## 什么是 Temporal？

Temporal 是一个强大的**分布式工作流引擎**，专为构建可靠、长时间运行的应用程序而设计。它通过持久化工作流状态，提供了一种编写复杂业务逻辑的方式，使得应用程序能够在各种情况下（包括服务器故障、代码更新等）可靠地执行。

![Temporal架构图](https://temporal.io/assets/visual-overview-c9bf85c6bb5a5dd06ce839deaa2e5f42.svg)

## 核心价值与应用场景 💡

如果您的系统中有以下需求，Temporal 可能是理想的解决方案：

- **跨服务、跨时间周期**的复杂业务流程
- **业务工作流建模**（BPM - Business Process Management）
- **DevOps 自动化工作流**
- **Saga 分布式事务**处理
- **BigData 数据处理**和分析 Pipeline
- **Serverless 函数编排**

这些场景的共同点是：需要可靠的**编排**（Orchestration）。

### 🤔 深度思考：编排的本质

编排的本质是将**多个服务**、**多个时间周期**的业务流程组合在一起，形成一个完整、可靠的业务流程。Temporal 让这一过程变得简单而强大。

> **MQ 与 Temporal 的区别？**
>
> 消息队列（MQ）主要用于**解耦服务**，实现**异步通信**。
>
> Temporal 则专注于**工作流编排**，管理复杂业务流程的整个生命周期。
>
> 简单类比：
> - MQ 像是传递纸条的邮递员
> - Temporal 像是管理整个项目的项目经理

## 真实应用案例：电商订单处理 🛒

想象一个电商平台的订单处理流程：

1. 🔹 调用**支付接口**，扣减用户余额
2. 🔹 调用**库存接口**，扣减商品库存
3. 🔹 调用**物流接口**，创建物流订单
4. 🔹 调用**订单接口**，创建订单记录

在传统架构中，这个流程很容易在任何一步出错后变得混乱。使用 Temporal，整个流程可以被定义为一个工作流，即使中途失败也能从失败点恢复。

---

## Temporal 核心概念 ⚙️

### Workflow

工作流是 Temporal 的核心概念，它定义了业务逻辑的协调流程。

- 每个工作流类型在服务端注册为一个 **WorkflowType**
- 每个工作流类型可以创建多个运行实例（**WorkflowExecution**）
- 每个执行实例有唯一的 **WorkflowID**
- 工作流可以包含条件分支、循环，甚至可以嵌套子工作流

### Activity

活动是工作流中执行实际工作的任务单元。

- 活动通常执行**外部系统交互**，如API调用、数据库操作等
- 可以使用标准编程结构（if/for/while）来编排活动调用
- 活动支持**自动重试**、**超时**和**错误处理**

### Signal

信号允许外部事件影响正在运行的工作流。

- 向运行中的工作流发送带参数的消息
- 工作流可以等待或处理信号
- 允许动态控制工作流执行逻辑

---

## Temporal 架构组件详解 🏗️

### Client 和 Worker

Temporal 架构中，Client 和 Worker 是两个关键组件，扮演不同但互补的角色。

### 🔷 Client

Client 是应用程序与 Temporal 服务器交互的接口，负责启动、查询和管理工作流。

#### Client 的核心职责：

- **工作流生命周期管理**：
  - 启动新的工作流执行
  - 查询工作流状态
  - 发送信号
  - 取消或终止工作流
  - 获取执行结果

#### Client 代码示例：

```typescript
import { Connection, Client } from "@temporalio/client";
import { myWorkflow } from "./workflows";

async function run() {
  // 创建连接
  const connection = await Connection.connect();
  
  // 初始化客户端
  const client = new Client({ connection });

  // 启动工作流
  const handle = await client.workflow.start(myWorkflow, {
    args: ["参数"],
    taskQueue: "my-task-queue",
    workflowId: "workflow-" + Date.now(),
  });

  console.log(`启动工作流: ${handle.workflowId}`);
  
  // 等待并获取结果
  const result = await handle.result();
  console.log(`工作流结果: ${result}`);
  
  // 其他操作示例
  // const state = await handle.query("queryName");
  // await handle.signal("signalName", signalData);
  // await handle.cancel();
}
```

#### 🌟 Client 最佳实践：

1. **连接池管理**：在高吞吐量应用中使用连接池
2. **完善的错误处理**：特别是网络相关错误
3. **合理的超时设置**：避免无限等待
4. **唯一 WorkflowId**：确保命名空间内唯一性

### 🔷 Worker

Worker 是执行工作流和活动的运行时环境，连接业务逻辑与 Temporal 服务器。

#### Worker 的核心职责：

1. **工作流执行**：
   - 注册并执行工作流代码
   - 维护工作流状态
   - 处理工作流决策任务

2. **活动执行**：
   - 执行活动函数
   - 报告执行状态和结果
   - 处理活动任务队列

#### Worker 代码示例：

```typescript
import { Worker } from "@temporalio/worker";
import * as activities from "./activities";

async function runWorker() {
  try {
    // 创建 Worker
    const worker = await Worker.create({
      workflowsPath: require.resolve("./workflows"),
      activities,
      taskQueue: "my-task-queue",
    });

    // 优雅关闭处理
    process.on("SIGINT", () => worker.shutdown());
    process.on("SIGTERM", () => worker.shutdown());

    // 启动 Worker
    console.log("Worker 已启动，正在监听任务队列...");
    await worker.run();
  } catch (error) {
    console.error("Worker 启动失败:", error);
    process.exit(1);
  }
}

runWorker();
```

#### Worker 内部架构：

Worker 内部包含多个关键组件：

1. **Workflow Worker**：
   - 在隔离环境中执行工作流代码
   - 确保工作流代码的确定性
   - 管理工作流状态和历史

2. **Activity Worker**：
   - 在主进程中执行活动代码
   - 处理重试和错误策略
   - 报告活动进度和结果

3. **任务处理器**：
   - 从任务队列获取任务
   - 调度任务执行
   - 管理并发和负载

#### 🌟 Worker 最佳实践：

- **水平扩展**：部署多个 Worker 实例处理高负载
- **资源隔离**：使用不同任务队列隔离不同类型的工作流和活动
- **监控与度量**：收集性能指标，如处理延迟、错误率
- **优雅关闭**：确保任务完成后再退出
- **健康检查**：定期检查 Worker 状态，自动重启异常实例

### Client 和 Worker 的交互模式

Temporal 的分布式架构建立在 Client 和 Worker 的协同工作上：

- **分离的职责**：Client 发起请求，Worker 执行任务
- **松耦合设计**：可以在不同服务、不同机器上运行
- **任务队列作为桥梁**：实现组件间的通信

这种设计带来的优势：

- **弹性扩展**：独立扩展 Client 和 Worker
- **故障隔离**：一方故障不影响另一方
- **版本管理**：支持代码平滑升级
- **语言多样性**：支持多种编程语言实现

---

## 第二步：创建您的第一个 Workflow 应用

我们可以选择语言（Go、Java、TypeScript/Node.js）来实现。你希望用哪种语言？我推荐使用 TypeScript（适合前端/全栈），或者 Go（性能好、部署简单）。

### 使用 TypeScript

1. 安装 Temporal CLI 和 SDK

```bash
npm install -g @temporalio/cli
npm init -y
npm install @temporalio/client @temporalio/worker
```

2. 初始化项目结构

```bash
npx @temporalio/create@latest
```

选择模板，例如 hello-world。

3. 示例代码结构（TS）

- workflows.ts：定义 Workflow
- activities.ts：定义 Activity
- worker.ts：Worker 启动文件
- client.ts：启动一个 workflow 实例的客户端

workflows.ts

```ts
import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export async function myWorkflow(name: string): Promise<string> {
  return await greet(name);
}
```

activities.ts

```ts
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}
```

worker.ts

```ts
import { Worker } from "@temporalio/worker";

async function run() {
  await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activities: require("./activities"),
    taskQueue: "my-task-queue",
  }).then((w) => w.run());
}

run().catch(console.error);
```

client.ts

```ts
import { Connection, Client } from "@temporalio/client";
import { myWorkflow } from "./workflows";

async function run() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  const handle = await client.workflow.start(myWorkflow, {
    args: ["World"],
    taskQueue: "my-task-queue",
    workflowId: "workflow-" + Date.now(),
  });

  console.log("Started workflow:", handle.workflowId);
  console.log("Result:", await handle.result());
}

run().catch(console.error);
```

✅ 第三步：运行项目
启动 Temporal Server（用 docker-compose）：

```bash
curl -O https://raw.githubusercontent.com/temporalio/docker-compose/main/docker-compose.yml
docker-compose up
```

运行 worker：

```bash
node worker.js
```

启动 workflow：

```bash
node client.js
```

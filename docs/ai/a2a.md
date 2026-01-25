## Google A2A (Agent-to-Agent) 协议概述

### 什么是 A2A 协议

A2A 是 Google 推出的一个开放标准协议，旨在解决 AI agent 生态系统中的一个关键问题：**让不同平台、不同框架构建的 AI agent 能够无缝通信和协作**。

### 核心特征

1. **标准化通信**：基于 JSON-RPC 2.0 over HTTP(S)
2. **Agent 发现**：通过"Agent Cards"展示能力和连接信息
3. **灵活交互**：支持同步请求/响应、流式传输(SSE)和异步推送通知
4. **丰富数据交换**：处理文本、文件和结构化 JSON 数据
5. **企业级安全**：内置安全性、身份验证和可观察性

### 解决的问题

- **打破孤岛**：连接不同生态系统中的 agent
- **启用复杂协作**：让专业化的 agent 协同工作处理单个 agent 无法独立完成的任务
- **促进开放标准**：推动社区驱动的 agent 通信方式
- **保持透明性**：允许 agent 协作而无需共享内部记忆、专有逻辑或具体工具实现

### 技术架构

#### Agent Card（代理卡片）

每个使用 A2A 的 agent 都有一个"Agent Card" - 相当于 AI agent 的名片，包含：

- agent 名称和描述
- 版本信息
- 支持的技能列表
- 输入/输出模式
- 连接信息

#### 通信机制

```json
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "task": {
      "messages": [
        {
          "role": "user",
          "parts": [
            {
              "kind": "text",
              "text": "Hello, can you help me?"
            }
          ]
        }
      ]
    }
  },
  "id": "unique-request-id"
}
```

#### 任务生命周期

- **submitted**：任务已提交
- **working**：agent 正在处理
- **input-required**：需要更多输入
- **completed/failed**：任务完成或失败

### 实际应用场景

1. **软件开发助手**

   - 代码生成 agent
   - 测试 agent
   - 文档 agent
   - 部署 agent

2. **智能客服系统**

   - 意图识别 agent
   - 知识库 agent
   - 对话 agent

3. **内容创作平台**
   - 研究 agent
   - 写作 agent
   - 编辑 agent
   - SEO 优化 agent

### 与其他协议的关系

**A2A vs MCP (Model Context Protocol)**：

- **MCP**：agent 与工具的连接（Tools）
- **A2A**：agent 与 agent 的连接（Teammates）
- 两者互补，常常配合使用

### 技术实现

#### Python SDK 示例

```python
from a2a.types import AgentCard, AgentSkill

# 定义agent技能
skill = AgentSkill(
    id="hello_world",
    name="Returns hello world",
    description="Just returns hello world"
)

# 定义agent卡片
agent_card = AgentCard(
    name="Hello World Agent",
    description="Just a hello world agent",
    url="http://localhost:9999/",
    skills=[skill]
)
```

### 支持的组织

目前有 50 多家技术公司支持 A2A 协议，包括：

- Google
- Atlassian
- Cohere
- Salesforce
- 等等

### 未来发展

A2A 协议代表了 AI 系统互操作性的重要进展，预计将成为：

- AI agent 通信的标准协议
- 构建复杂多 agent 系统的基础
- 推动 AI 生态系统从孤立向协作转变的催化剂

这个协议的推出标志着我们正在进入一个 AI agent 可以跨平台、跨组织无缝协作的新时代。

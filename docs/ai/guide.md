# DeepSeek 指北

## 什么是模型蒸馏？

大模型蒸馏（Model Distillation）是一种**知识蒸馏（Knowledge Distillation, KD）**技术，旨在将大模型（Teacher Model）中的知识压缩到一个更小的模型（Student Model），以减少计算成本、提高推理速度，同时尽可能保持模型的性能。

## Function Calling 机制？

Function Calling 机制可以让大模型审时度势地调用由人类提供的外部工具，从而解决上述问题。

## Agent?

Agent 简单来说不是一个技术，而是一种 AI 设计模式，一种让大模型变得更聪明的套路，是一种方法论，相当于是一个产品，可以达到自己的业务目的。

Agent 处理问题会将大问题拆分成一个个的小问题，分别选择相应的工具去解决问题。因此作为实际工具调用者的我们，就需要配合大模型完成多轮工具的调用，直到大模型反馈 Final Answer，因此这是一个多轮对话的模式。我们可以用死循环来实现多轮对话，死循环的结束条件是检测到大模型输出 Final Answer。

https://api.deepseek.com

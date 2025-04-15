# automa 介绍

[`automa`](https://www.automa.site/) 是一个 chrome 扩展，通过拖拽 0 代码实现工作流，模拟网页的各种点击、表单填写等操作，使用时点击插件脚本一键执行，或者设置定时执行，从而简化我们的工作。

![workflow](/automa/workflow.png)

`automa` 提供 4 类操作，分别是：

- **通用操作**：Trigger 触发、Delay 延迟、导出数据（ JSON / CSV / Plain text 纯文本 ）、Repeat task 重复任务
- **浏览器操作**：Active tab、New tab、Go back 后退、Go forward 前进、Close tab 关闭、Take screenshot 截图
- **Web 元素操作**：Click element 点击、Get text 获取文本、Scroll element 滚动、Link 链接、Attribute value 元素属性值、Forms 提交表单、JS 脚本执行、Trigger event 触发事件
- **条件操作**：Conditions 条件判断、Element exists 元素存在

需要指出的是，`automa` 还提供了网页元素选择器定位功能，只需要点击插件界面的「 Element Selector 」图标，然后选择目标控件，左下角就会显示控件的选择器

PS：另外 `automa` 插件还提供了快速获取父元素、子元素选择器的功能

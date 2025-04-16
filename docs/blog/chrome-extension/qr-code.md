# Chrome 扩展开发实战教程：二维码生成与扫描工具

代码仓库地址：[https://github.com/Ulanxx/qr-code-extension](https://github.com/Ulanxx/qr-code-extension)

## 学习目标

本教程将带领你从零开始创建一个功能完善的 Chrome 扩展，该扩展可以生成二维码并从网页图片中扫描二维码。在这个过程中，你将学习：

- Chrome 扩展的核心概念和架构
- 使用 Vue 3 构建扩展的弹出界面
- 使用 Vite 打包和构建扩展
- 实现右键菜单功能
- 在扩展中使用内容脚本和后台脚本
- 浏览器 API 的使用（存储、消息传递等）
- 使用开源库进行二维码生成和扫描

## 目录

1. [基础知识与环境配置](#1-基础知识与环境配置)
2. [项目创建与结构解析](#2-项目创建与结构解析)
3. [构建弹出界面与二维码生成功能](#3-构建弹出界面与二维码生成功能)
4. [实现二维码扫描功能](#4-实现二维码扫描功能)
5. [使用 Vite 打包扩展](#5-使用-vite-打包扩展)
6. [调试与常见问题解决](#6-调试与常见问题解决)
7. [发布与分发](#7-发布与分发)

## 1. 基础知识与环境配置

### 1.1 Chrome 扩展基础

Chrome 扩展是用于增强 Chrome 浏览器功能的小程序，使用 HTML、CSS 和 JavaScript 构建。一个完整的 Chrome 扩展通常包含以下几个关键部分：

- **manifest.json**：扩展的配置文件，定义扩展的元数据、权限、资源等
- **弹出界面(Popup)**：点击扩展图标时显示的界面
- **后台脚本(Background Script)**：在浏览器后台持续运行的脚本
- **内容脚本(Content Script)**：注入到网页中执行的脚本，可以访问和修改网页内容

### 1.2 环境要求

要开发我们的二维码扩展，你需要准备以下工具：

- **Node.js**：推荐使用 v16 或更高版本
- **包管理器**：npm、pnpm 或 yarn
- **代码编辑器**：VS Code 或其他编辑器
- **Chrome 浏览器**

### 1.3 初始环境安装

我们将使用 pnpm 作为包管理器，如果你还没有安装，可以运行：

```bash
npm install -g pnpm
```

安装脚手架和构建工具：

```bash
pnpm install -g vite create-vite
```

## 2. 项目创建与结构解析

### 2.1 项目初始化

我们首先创建一个新的项目：

```bash
# 创建项目文件夹
mkdir qr-code-extension
cd qr-code-extension

# 初始化项目
pnpm init
```

### 2.2 安装依赖

安装我们需要的主要依赖：

```bash
pnpm add vue qrcode jsqr
pnpm add -D vite @vitejs/plugin-vue
```

- **vue**：用于构建用户界面
- **qrcode**：用于生成二维码
- **jsqr**：用于扫描和解析二维码
- **vite**：现代前端构建工具
- **@vitejs/plugin-vue**：Vite 的 Vue 插件

### 2.3 项目结构设计

我们的扩展将有以下文件结构：

```
/
├── dist/             # 编译后的扩展文件
├── src/
│   ├── background.js   # 后台脚本
│   ├── content.js      # 用于二维码扫描的内容脚本
│   ├── popup/
│       ├── Popup.vue     # 弹出式 UI 组件
│       ├── popup.js     # 弹出式入口点
├── popup.html       # 弹出式 HTML
├── script/          # 构建脚本
├── vite.config.js   # Vite 配置
├── manifest.json     # 扩展清单文件
```

### 2.4 创建清单文件

在项目根目录下创建 `manifest.json` 文件：

```json
{
  "manifest_version": 3,
  "name": "QR Code Generator & Scanner",
  "version": "1.0.0",
  "description": "Generate and scan QR codes with a retro pixel art UI",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "QR Code Tool"
  },
  "permissions": ["storage", "contextMenus"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

这个清单文件定义了扩展的基本信息、图标、权限以及各种脚本的入口点。

## 3. 构建弹出界面与二维码生成功能

在这一节中，我们将创建扩展的弹出界面并实现二维码生成功能，这是我们扩展的核心部分之一。

### 3.1 创建弹出页面 HTML

首先，我们需要创建一个 HTML 页面作为扩展的弹出界面。在项目根目录下创建 `popup.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QR码生成器</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/popup/popup.js"></script>
  </body>
</html>
```

这是一个简单的 HTML 结构，我们将使用 Vue 来渲染 #app 容器内的内容。

### 3.2 创建 Vue 组件

接下来，我们需要创建 Vue 组件来实现二维码生成功能。

首先，创建 `src/popup` 目录，然后在其中创建 `popup.js` 作为入口文件：

```javascript
import { createApp } from "vue";
import Popup from "./Popup.vue";

createApp(Popup).mount("#app");

console.log("Popup script loaded");
```

然后创建 `src/popup/Popup.vue` 组件：

```vue
<template>
  <div class="container">
    <h1 class="title">二维码生成器</h1>

    <form @submit.prevent="generateQRCode" class="form">
      <div class="form-group">
        <input
          id="text-input"
          type="text"
          v-model="text"
          placeholder="输入文本或URL"
          class="input"
          autofocus
        />
      </div>

      <button type="submit" class="button primary-button">生成二维码</button>
    </form>

    <div v-show="qrGenerated" class="qr-container">
      <div class="canvas-container">
        <canvas ref="qrCanvas" width="200" height="200"></canvas>
      </div>

      <div class="button-group">
        <button @click="downloadQRCode" class="button primary-button small">
          下载
        </button>

        <button
          @click="copyQRCodeToClipboard"
          class="button secondary-button small"
        >
          复制
        </button>
      </div>

      <div v-if="copySuccess" class="success-message">已复制到剪贴板</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import QRCode from "qrcode";

const text = ref("");
const qrCanvas = ref(null);
const qrGenerated = ref(false);
const copySuccess = ref(false);

// 加载保存的文本数据
onMounted(() => {
  // 检查是否在扩展环境中
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["lastQRText"], (result) => {
      if (result.lastQRText) {
        text.value = result.lastQRText;
        generateQRCode();
      }
    });
  } else {
    // 开发环境的备用方案
    const savedText = localStorage.getItem("lastQRText");
    if (savedText) {
      text.value = savedText;
      generateQRCode();
    }
  }
});

// 生成二维码
const generateQRCode = async () => {
  if (!text.value) return;

  try {
    // 先设置状态，确保元素显示
    qrGenerated.value = true;

    // 使用nextTick确保DOM已更新再绘制二维码
    await nextTick();

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, text.value, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      console.log("QR code generated", text.value);
      // 保存文本到存储
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ lastQRText: text.value });
      } else {
        // 开发环境备用方案
        localStorage.setItem("lastQRText", text.value);
      }
    } else {
      console.error("Canvas element not found");
    }
  } catch (error) {
    console.error("Failed to generate QR code:", error);
  }
};

// 下载二维码
const downloadQRCode = () => {
  if (!qrCanvas.value) return;

  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = qrCanvas.value.toDataURL("image/png");
  link.click();
};

// 复制二维码到剪贴板
const copyQRCodeToClipboard = async () => {
  if (!qrCanvas.value) return;

  try {
    const dataUrl = qrCanvas.value.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};
</script>

<style>
/* 像素风科技绿 */
:root {
  --primary: #0f0;
  --primary-dim: #0a0;
  --dark: #000;
  --light: #ffffff;
  --border: #0f0;
  --text: #0f0;
  --highlight: #00ff66;
  --background: #001800;
}

@font-face {
  font-family: "Pixel";
  src: local("Silkscreen"), local("Press Start 2P"), local("VT323"), local("Courier New");
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  image-rendering: pixelated;
}

body {
  font-family: "Pixel", monospace;
  background-color: var(--dark);
  color: var(--text);
}

.container {
  width: 320px;
  height: 450px;
  padding: 8px;
  background-color: var(--dark);
  background-image: linear-gradient(
      0deg,
      rgba(0, 24, 0, 0.97),
      rgba(0, 24, 0, 0.97)
    ), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(
          0,
          255,
          0,
          0.03
        ) 2px, rgba(0, 255, 0, 0.03) 4px);
  border: 2px solid var(--primary);
  position: relative;
  overflow: hidden;
}

/* 其他样式省略，完整代码可在项目仓库中查看 */
</style>
```

上面的 Vue 组件实现了以下功能：

1. 一个简单的表单，用于输入文本或 URL
2. 生成二维码的按钮
3. 显示生成的二维码
4. 下载二维码为 PNG 图片
5. 复制二维码到剪贴板
6. 像素风格的 UI 设计

### 3.3 实现数据持久化

注意到在 onMounted 钩子中，我们使用了 Chrome 的 storage.local API 来存储和检索最后使用的文本。这使得用户在重新打开扩展时能够看到上次生成的二维码。

```javascript
// 加载保存的文本数据
onMounted(() => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["lastQRText"], (result) => {
      if (result.lastQRText) {
        text.value = result.lastQRText;
        generateQRCode();
      }
    });
  } else {
    // 开发环境备用方案
    const savedText = localStorage.getItem("lastQRText");
    if (savedText) {
      text.value = savedText;
      generateQRCode();
    }
  }
});
```

我们同时提供了一个备用方案，使用 localStorage，这样在开发环境中也能测试这个功能。

### 3.4 实现二维码生成

二维码生成功能主要通过 qrcode 库实现。在 generateQRCode 方法中：

```javascript
const generateQRCode = async () => {
  if (!text.value) return;

  try {
    qrGenerated.value = true;
    await nextTick();

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, text.value, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // 保存文本到存储
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ lastQRText: text.value });
      } else {
        localStorage.setItem("lastQRText", text.value);
      }
    }
  } catch (error) {
    console.error("Failed to generate QR code:", error);
  }
};
```

这里我们使用 QRCode.toCanvas 方法将二维码直接渲染到 Canvas 元素上，设置宽度和颜色等选项。

### 3.5 下载和复制功能

下载功能通过创建一个临时的 `<a>` 元素，设置其 download 属性和 href 属性（使用 Canvas 的 toDataURL 方法获取数据 URL），然后模拟点击来触发下载：

```javascript
const downloadQRCode = () => {
  if (!qrCanvas.value) return;

  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = qrCanvas.value.toDataURL("image/png");
  link.click();
};
```

复制功能使用现代的 Clipboard API，将 Canvas 内容转换为 Blob 对象，然后使用 navigator.clipboard.write 方法复制到剪贴板：

```javascript
const copyQRCodeToClipboard = async () => {
  if (!qrCanvas.value) return;

  try {
    const dataUrl = qrCanvas.value.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};
```

注意，在某些环境中（如扩展的后台脚本），Clipboard API 可能不可用，需要使用替代方法。

## 4. 实现二维码扫描功能

在这一节中，我们将实现扩展的二维码扫描功能，包括右键菜单集成、内容脚本注入和背景脚本处理。这部分功能允许用户右键点击网页上的图片，然后通过上下文菜单选择"扫描二维码"选项来识别图片中的二维码内容。

### 4.1 创建后台脚本

首先，我们需要创建一个后台脚本 `background.js` 来处理右键菜单的创建和消息传递：

```javascript
// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanQRCode",
    title: "扫描二维码",
    contexts: ["image"],
  });

  console.log("Context menu created");
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanQRCode") {
    // 向内容脚本发送消息，传递图片 URL
    chrome.tabs
      .sendMessage(tab.id, {
        action: "scanQRCode",
        imageUrl: info.srcUrl,
      })
      .catch((error) => {
        console.error("Error sending message to content script:", error);
      });
  }
});

// 处理来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "qrCodeScanned") {
    // 处理扫描结果
    console.log("QR Code content:", message.content);

    // 存储扫描结果
    chrome.storage.local.set({ lastScannedQR: message.content });

    // 显示通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "二维码已扫描",
      message: message.content,
    });

    // 可选：复制到剪贴板
    if (message.copyToClipboard) {
      try {
        // 注意：在后台脚本中，navigator.clipboard API 可能不可用
        // 使用替代方法处理剪贴板操作
        sendResponse({ success: true });
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        sendResponse({ success: false, error: error.message });
      }
    }
  }

  return true; // 保持消息通道开放以支持异步响应
});
```

### 4.2 实现内容脚本

接下来，我们创建 content.js 内容脚本，用于处理图片扫描和二维码解析：

```javascript
// 全局变量，用于存储当前处理的图片 URL
let currentImageUrl = null;

// 设置右键菜单上下文
function setupContextMenu() {
  // 监听来自后台脚本的消息
  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "scanQRCode") {
        currentImageUrl = message.imageUrl;
        scanQRCode(currentImageUrl);
      }
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
  }
}

// 扫描二维码
async function scanQRCode(imageUrl) {
  try {
    // 创建一个图片元素
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = function () {
      // 创建Canvas并绘制图片
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 使用jsQR库解析二维码
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log("QR Code detected:", code.data);

        // 向后台脚本发送扫描结果
        try {
          chrome.runtime.sendMessage({
            action: "qrCodeScanned",
            content: code.data,
            copyToClipboard: true,
          });

          // 显示扫描结果
          showScanResult(code.data);
        } catch (error) {
          console.error("Error sending scan result:", error);

          // 扩展上下文失效时的备用方案
          alert(`扫描到二维码: ${code.data}`);
          copyTextToClipboard(code.data);
        }
      } else {
        alert("未在图片中检测到二维码");
      }
    };

    img.onerror = function () {
      console.error("Failed to load image:", imageUrl);
      alert("无法加载图片，请检查图片URL或跨域访问权限");
    };

    // 加载图片
    img.src = imageUrl;
  } catch (error) {
    console.error("Error scanning QR code:", error);
    alert("扫描二维码时出错: " + error.message);
  }
}

// 显示扫描结果
function showScanResult(content) {
  // 创建一个浮动结果框
  const resultBox = document.createElement("div");
  resultBox.style.cssText = `    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    background-color: #000;
    color: #0f0;
    border: 2px solid #0f0;
    z-index: 9999;
    font-family: monospace;
    max-width: 300px;
    word-break: break-all;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
 `;

  resultBox.innerHTML = `    <div style="margin-bottom: 10px; font-weight: bold;">扫描结果:</div>
    <div style="margin-bottom: 15px;">${content}</div>
    <button id="qr-copy-btn" style="background: #0f0; color: #000; border: none; padding: 5px 10px; cursor: pointer; margin-right: 5px;">复制</button>
    <button id="qr-close-btn" style="background: #333; color: #0f0; border: 1px solid #0f0; padding: 5px 10px; cursor: pointer;">关闭</button>
 `;

  document.body.appendChild(resultBox);

  // 添加按钮事件
  document.getElementById("qr-copy-btn").addEventListener("click", () => {
    copyTextToClipboard(content);
    document.getElementById("qr-copy-btn").textContent = "已复制!";
  });

  document.getElementById("qr-close-btn").addEventListener("click", () => {
    document.body.removeChild(resultBox);
  });

  // 自动消失
  setTimeout(() => {
    if (document.body.contains(resultBox)) {
      document.body.removeChild(resultBox);
    }
  }, 10000);
}

// 复制文本到剪贴板（兼容内容脚本环境）
function copyTextToClipboard(text) {
  try {
    // 尝试使用现代 Clipboard API
    navigator.clipboard.writeText(text).catch((err) => {
      // 如果现代 API 失败，使用备用方法
      fallbackCopyTextToClipboard(text);
    });
  } catch (err) {
    // 如果 API 不可用，使用备用方法
    fallbackCopyTextToClipboard(text);
  }
}

// 备用的剪贴板复制方法
function fallbackCopyTextToClipboard(text) {
  // 创建临时文本区域
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 设置样式使其不可见
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  // 执行复制命令
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard using fallback method");
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
  }

  // 清理
  document.body.removeChild(textArea);
}

// 初始化
function init() {
  // 导入 jsQR 库
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("jsqr.js");
  script.onload = function () {
    console.log("jsQR library loaded");
    setupContextMenu();
  };
  document.head.appendChild(script);
}

// 当页面加载完成时初始化
window.addEventListener("load", () => {
  try {
    init();
  } catch (error) {
    console.error("Error initializing content script:", error);
  }
});
```

### 4.3 处理跨域问题

在实现二维码扫描功能时，我们可能会遇到跨域问题，因为内容脚本尝试加载和处理来自不同域的图片。为了解决这个问题，我们采取了以下措施：

1. 在图片加载时设置 `crossOrigin = "Anonymous"`
2. 在 `manifest.json` 中添加适当的权限和跨域访问策略
3. 对于无法通过常规方法处理的跨域图片，我们可以考虑通过后台脚本进行代理请求

### 4.4 优化用户体验

为了提供更好的用户体验，我们实现了以下功能：

1. 扫描结果显示在网页上的浮动窗口中，而不是简单的 alert
2. 提供一键复制功能，方便用户获取二维码内容
3. 添加错误处理和用户反馈，确保用户了解当前操作状态
4. 在扩展的后台脚本中存储最近扫描的结果，便于后续访问

### 4.5 处理扩展上下文失效问题

在扩展开发中，一个常见的问题是`Extension context invalidated`错误，这通常发生在扩展被重新加载或更新时。为了解决这个问题，我们在代码中添加了适当的错误处理：

```javascript
try {
  chrome.runtime.sendMessage({
    action: "qrCodeScanned",
    content: code.data,
    copyToClipboard: true,
  });
} catch (error) {
  console.error("Error sending scan result:", error);

  // 扩展上下文失效时的备用方案
  alert(`扫描到二维码: ${code.data}`);
  copyTextToClipboard(code.data);
}
```

## 5. 使用 Vite 打包扩展

在本节中，我们将详细介绍如何使用 Vite 构建和打包 Chrome 扩展。Vite 是一个现代化的前端构建工具，它提供了极快的开发体验和高效的生产构建。对于我们的 Chrome 扩展项目，我们需要特殊的配置来确保各个部分能够正确打包。

### 5.1 Vite 配置文件设计

我们的扩展包含多个入口点（popup、background、content），每个部分都需要单独打包。我们创建了一个灵活的 `vite.config.js` 文件来处理这些需求：

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// 主配置（popup.html + background.js）
const mainConfig = defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});

// content.js 配置（内联所有依赖）
const contentConfig = defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/content.js"),
      output: {
        entryFileNames: "content.js",
        format: "iife",
        inlineDynamicImports: true, // 强制打包成单文件
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});

// 默认导出主配置（兼容 `vite build` 直接运行）
export default mainConfig;
```

这个配置文件的关键点：

1. 我们定义了两个不同的配置：`mainConfig` 和 `contentConfig`
2. `mainConfig` 处理 popup 界面和 background 脚本
3. `contentConfig` 专门处理 content.js，并将其所有依赖内联到一个文件中
4. 我们设置 `emptyOutDir: false` 以防止每次构建时清空输出目录
5. 为 content.js 设置 `inlineDynamicImports: true`，确保所有依赖打包到一个文件中

### 5.2 自定义构建脚本

为了更好地控制构建过程，我们创建了一个自定义构建脚本 `script/build.mjs`：

```javascript
// 构建脚本 - 分别构建主配置和 content.js
import { build } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const watch = process.argv.includes("--watch");

async function buildExtension() {
  try {
    console.log("🏗 Building main files (popup + background)...");
    await build({
      build: {
        watch: watch ? {} : undefined,
      },
    });

    console.log("📦 Building content.js (bundled)...");
    // 创建 content.js 的配置
    const contentConfig = {
      build: {
        watch: watch ? {} : undefined,
        outDir: "dist",
        emptyOutDir: false,
        rollupOptions: {
          input: resolve(__dirname, "../src/content.js"),
          output: {
            entryFileNames: "content.js",
            format: "iife",
            inlineDynamicImports: true, // 强制打包成单文件
          },
        },
        commonjsOptions: {
          include: [/node_modules/],
          transformMixedEsModules: true,
        },
      },
    };

    await build(contentConfig);

    console.log("✅ All builds completed!");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

buildExtension();
```

这个脚本的主要功能：

1. 先构建主配置（popup 和 background）
2. 然后构建 content.js，确保它被打包成一个独立的文件
3. 支持 `--watch` 参数，方便开发时实时重新构建
4. 提供友好的控制台输出，显示构建进度和结果

### 5.3 配置 NPM 脚本

在 `package.json` 中，我们添加了便捷的脚本命令：

```json
{
  "scripts": {
    "dev": "node script/build.mjs --watch",
    "build": "node script/build.mjs"
  }
}
```

这样，我们可以使用 `pnpm dev` 进行开发（启用监视模式），或使用 `pnpm build` 进行生产构建。

### 5.4 处理依赖打包的挑战

在 Chrome 扩展开发中，一个常见的挑战是确保所有 JavaScript 文件都能独立运行，特别是 content.js，它需要包含所有依赖。我们通过以下方式解决这个问题：

1. 使用 `inlineDynamicImports: true` 确保所有动态导入都被内联到一个文件中
2. 配置 `commonjsOptions` 来正确处理 node_modules 中的依赖
3. 为 content.js 使用 IIFE（立即调用函数表达式）格式，确保它在内容脚本环境中正确运行
4. 避免使用代码分割，因为这会导致多个文件，可能会使扩展加载变得复杂

这种配置确保了我们的扩展在 Chrome 中能够正确加载和运行，同时保持了代码的模块化和可维护性。

### 5.5 优化构建输出

为了优化最终的扩展包，我们采取了以下措施：

1. 使用明确的文件命名策略，保持输出文件结构清晰
2. 确保 CSS 和其他资源正确打包和引用
3. 避免不必要的代码分割，减少扩展加载时的网络请求
4. 保留源码映射以便于调试，但在最终发布版本中可以移除它们

通过这些优化，我们的扩展不仅加载速度更快，而且更容易维护和调试。

## 6. 调试与常见问题解决

在 Chrome 扩展开发过程中，我们可能会遇到各种问题。本节将介绍一些常见问题及其解决方案，帮助你更高效地调试扩展。

### 6.1 扩展调试工具

Chrome 提供了强大的扩展调试工具，可以通过以下步骤访问：

1. 在浏览器地址栏输入 `chrome://extensions`
2. 确保开发者模式已开启（右上角切换按钮）
3. 点击你的扩展卡片上的"背景页"链接，打开开发者工具
4. 对于弹出窗口，可以右键点击扩展图标，选择"检查弹出内容"
   这些工具让你能够：
   - 查看控制台日志和错误信息
   - 检查网络请求
   - 使用断点调试 JavaScript
   - 分析性能问题

### 6.2 处理 Extension Context Invalidated 错误

在我们的扩展开发中，一个常见的问题是 "Extension context invalidated" 错误，这通常发生在以下情况：

1. 扩展被重新加载或更新
2. 扩展被禁用或卸载
3. 浏览器重启后扩展上下文发生变化

我们通过以下方式解决这个问题：

```javascript
try {
  chrome.runtime.sendMessage({
    action: "qrCodeScanned",
    content: code.data,
    copyToClipboard: true,
  });
} catch (error) {
  console.error("Error sending scan result:", error);

  // 扩展上下文失效时的备用方案
  alert(`扫描到二维码: ${code.data}`);
  copyTextToClipboard(code.data);
}
```

这种方法确保即使扩展上下文失效，用户仍然能够获取扫描结果，提高了扩展的可靠性。

### 6.3 解决剪贴板 API 兼容性问题

在不同的扩展环境中，剪贴板 API 的行为可能有所不同：

1. 内容脚本中的问题：在内容脚本中使用 `navigator.clipboard.writeText()` 可能会遇到 "NotAllowedError: Failed to execute 'writeText' on 'Clipboard': Document is not focused" 错误。
2. 后台脚本中的问题：在后台脚本中，`navigator.clipboard` API 可能完全不可用，导致 "Cannot read properties of undefined (reading 'writeText')" 错误。

我们通过实现一个兼容性更好的备用方法解决这些问题：

```javascript
function fallbackCopyTextToClipboard(text) {
  // 创建临时文本区域
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 设置样式使其不可见
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  // 执行复制命令
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard using fallback method");
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
  }

  // 清理
  document.body.removeChild(textArea);
}
```

这种方法使用较旧但兼容性更好的 `document.execCommand('copy')` API，确保在各种环境中都能正常工作。

### 6.4 处理跨域图片扫描问题

扫描网页上的图片时，我们可能会遇到跨域问题，特别是当图片来自不同域时。解决方法包括：

1. 在图片加载时设置 `crossOrigin = "Anonymous"`：

```javascript
const img = new Image();
img.crossOrigin = "Anonymous";
img.src = imageUrl;
```

2. 在 manifest.json 中添加适当的权限：

```json
"permissions": ["<all_urls>"],
```

3. 对于仍然无法加载的图片，提供清晰的错误信息：

```javascript
img.onerror = function () {
  console.error("Failed to load image:", imageUrl);
  alert("无法加载图片，请检查图片 URL 或跨域访问权限");
};
```

### 6.5 调试技巧与最佳实践

以下是一些有用的调试技巧：

1. 使用详细的日志记录：在关键点添加 console.log 语句，记录变量值和执行流程。
2. 分离关注点：将复杂功能分解为更小的函数，使调试更容易。
3. 使用 try-catch 块：捕获并处理可能的错误，特别是在与 Chrome API 交互时。
4. 增量测试：每实现一个小功能就进行测试，而不是等到整个扩展完成。
5. 使用条件断点：在开发者工具中设置条件断点，只在特定条件满足时暂停执行。
6. 检查网络请求：使用开发者工具的网络面板监控 API 请求和响应。
7. 使用存储检查器：通过 chrome://extensions 页面的"检查视图"→"存储"选项卡检查扩展的存储数据。

## 7. 发布与分发

完成扩展开发和测试后，下一步是将其发布到 Chrome Web Store，让更多用户能够使用你的扩展。

### 7.1 准备发布材料

在提交扩展之前，你需要准备以下材料：

1. 扩展打包文件：使用 pnpm build 命令生成生产版本的扩展。
2. 扩展图标：准备多种尺寸的图标（16x16, 48x48, 128x128），确保它们清晰可辨。
3. 至少一张截图：展示扩展的主要功能，尺寸至少为 1280x800 或 640x400 像素。
4. 简短的描述：不超过 132 个字符的扩展简介。
5. 详细描述：详细说明扩展的功能、使用方法和优势。
6. 隐私政策：如果你的扩展收集用户数据，需要提供隐私政策。

### 7.2 打包扩展

在发布之前，我们需要创建一个 ZIP 文件，包含扩展的所有必要文件：

```bash

# 确保先构建最新版本

pnpm build

# 进入 dist 目录

cd dist

# 创建 ZIP 文件

zip -r ../qr-code-extension.zip \*
```

确保 ZIP 文件中包含以下文件：

1. manifest.json
2. 所有 JavaScript 文件（popup.js, background.js, content.js）
3. HTML 文件（popup.html）
4. 图标文件
5. 其他资源文件

### 7.3 提交到 Chrome Web Store

按照以下步骤将扩展提交到 Chrome Web Store：

1. 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/developer/dashboard)
2. 登录你的 Google 账号（需要支付一次性开发者注册费，约 $5）
3. 点击"添加新项目"按钮
4. 上传你的 ZIP 文件
5. 填写扩展信息：
   - 名称
   - 类别（工具类）
   - 简短描述
   - 详细描述
   - 图标
   - 至少一张截图
   - 语言
   - 网站链接（可选）
6. 提交审核

审核过程通常需要几天到一周时间。如果审核被拒绝，Google 会提供拒绝原因，你可以修复问题后重新提交。

### 7.4 版本更新与维护

发布后，你可能需要更新扩展以修复 bug 或添加新功能。更新流程如下：

1. 在 manifest.json 中增加版本号：

```json
{
  "version": "1.0.1"
}
```

2. 构建新版本并创建 ZIP 文件
3. 在开发者控制台中选择你的扩展，点击"上传更新的软件包"
4. 填写更新日志，描述更改内容
5. 提交审核

### 7.5 推广你的扩展

发布后，你可以通过以下方式推广你的扩展：

1. 创建一个专门的网站：详细介绍扩展功能和使用方法
2. 利用社交媒体：在 Twitter、Reddit、LinkedIn 等平台分享
3. 编写博客文章：介绍开发过程和技术细节
4. 在相关论坛分享：如 Chrome 扩展开发者论坛、Stack Overflow 等
5. 鼓励用户评价：正面评价有助于提高扩展在商店中的排名
6. 收集用户反馈：持续改进扩展功能和用户体验

通过这些步骤，你的二维码生成与扫描扩展就可以顺利发布并被更多用户使用了。

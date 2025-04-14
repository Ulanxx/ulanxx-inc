# Sandbox（沙箱环境）实现原理与关键代码

Sandbox 是 Studio 低代码平台的核心运行环境，负责组件渲染、拖拽交互和实时预览。它采用了类似小程序的架构，实现了安全隔离的运行时环境，同时提供了与 Studio 编辑器的双向通信能力。

## 1. 核心架构设计

### 1.1 分层设计

Sandbox 环境采用了经典的分层架构设计：

- 服务层（Service Layer）：处理业务逻辑和数据处理
- 视图层（View Layer）：负责 UI 渲染和用户交互
- 通信层（Communication Layer）：基于 WebSocket 的跨层通信机制

### 1.2 关键模块

- WebSocket 通信模块：WsClient

  - 实现双向通信，支持消息分发和订阅

- 组件渲染引擎

  - 基于 RayRunner（类似小程序运行时）的组件渲染系统
  - JSON-Renderer：将 JSON 配置转换为实际 UI 组件

- 交互控制模块

  - MoveableManager: 处理绝对定位布局的拖拽、调整
  - SortableManager: 处理网格布局的排序和交互

- 资源加载器：
  - loadResources: 动态加载组件资源和样式

### 2. 关键代码实现

#### 2.1 沙箱服务启动

```javascript
// serve.js
const app = express();
const PORT = process.env.PORT || 3000;

// 静态资源处理
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "dev-www")));

// HTML 资源处理中间件，支持代理模式
const htmlController = (req, res, next) => {
  const isProxy = "x-proxy-prefix" in req.headers;
  // 检测代理前缀并注入重定向脚本
  if (reqPath.endsWith(".html") && isProxy) {
    // 处理 HTML 资源
    const script = `<script>window.__redirectPath = '/studio-sandbox/'</script>`;
    html = html.replace("<head>", `<head>${script}`);
    res.send(html);
  } else {
    next();
  }
};

// 启动 HTTP 服务
httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
```

#### 2.2 页面服务实现

```typescript
// pageService.ts
import { WsClient } from "./shared/WsClient";
import { getComponentFromRayMaterial } from "./shared/getComponentFromRayMaterial";

const ws = new WsClient({ side: "miniapp" });

Mini.registerEntry("pages/tab1/index", function (ty, Promise) {
  const Ray = RayRunner.Ray;
  const React = RayRunner.React;
  const Components = RayRunner.Components;
  const Material = RayMaterial;

  // 处理渲染数据，将 JSON 配置转换为 React 组件
  function handlerRenderData(data) {
    if (!data) return null;
    if (typeof data === "string") {
      return data;
    }

    // 获取组件实例
    let tagComponent = getComponentFromRayMaterial(data.tag);

    // 处理包装组件
    if (data.__wrapper__) {
      return {
        tag: Material[data.__wrapper__].default,
        props: {
          instanceId,
          isGroup: data.isGroup,
          pageType: data.pageType,
          containerStyle: data.__fixedStyle__ || data.__wrapperStyle__,
          dpCodes,
          expressions,
          actions,
          // 其他属性
        },
        children: () => {
          return {
            tag: tagComponent,
            props: pureProps,
            children: data.children && data.children.map(handlerRenderData),
          };
        },
      };
    } else {
      // 处理普通组件
      return {
        tag: tagComponent,
        props: data.props,
        children: data.children && data.children.map(handlerRenderData),
      };
    }
  }

  // 主页面组件实现
  const home_default = () => {
    // 使用 React 状态管理页面渲染
    const [renderKey, setRenderKey] = React.useState(0);
    const [renderData, setRenderData] = React.useState();

    // 监听页面配置变更消息
    React.useEffect(() => {
      ws.on("page_config_change", ({ payload }) => {
        setPageConfig(payload);
      });

      // 监听应用上下文变更
      ws.on("app_context_change", function ({ payload }) {
        const { currentLang, featureLocales, schema, staticPrefix } = payload;
        // 更新上下文数据
        ContextContainer.StudioObject.Strings.merge(featureLocales);
        ContextContainer.StudioObject.Strings.setLanguage(currentLang);
        ContextContainer.StudioObject.schema = JSON.parse(
          JSON.stringify(schema)
        );

        // 刷新渲染
        setRenderKey((pre: number) => pre + 1);
      });

      // 处理模板配置完成消息
      ws.on("template_configuration_complete", ({ payload, from }) => {
        if (from === "service") {
          let { tree, renderKey } = payload;
          if (renderKey) {
            setRenderKey(renderKey);
          }
          if (tree) {
            setRenderData(handlerRenderData(tree));
          }
        }
      });
    }, []);

    // 渲染组件
    return React.createElement(ContainerRenderContext, {
      key: renderKey,
      config: {
        renderData,
        // 其他配置
      },
    });
  };

  // 注册页面
  RayRunner.createPage(home_default, "pages/tab1/index");
});
```

#### 2.3 页面视图与交互实现

```typescript
// pageView.ts
import { MoveableManager } from "./MoveableManager";
import { SortableManager } from "./SortableManager";
import { WsClient } from "./shared/WsClient";
import { loadResources } from "./shared/loadResources";
import { viewport } from "./viewport";

// 初始化 WebSocket
const ws = new WsClient({ side: "template" });
viewport.bindWs(ws);

// 绝对定位拖拽管理器
const move = new MoveableManager(moveableClasses);

// 拖拽取消回调
move.onCancel(() => {
  if (viewport.isGridLayout()) return;
  if (viewport.getSelectTarget()) {
    viewport.clearSelectTarget();
  }
});

// 拖拽更新回调
move.onUpdate((res) => {
  if (viewport.isGridLayout()) return;
  if (res.type === "drag") {
    ws.emit({
      to: ["studio"],
      type: "template_drag_move",
      payload: { ...res },
    });
  } else if (res.type === "resize") {
    ws.emit({
      to: ["studio"],
      type: "template_on_resize",
      payload: { ...res },
    });
  }
});

// 网格布局排序管理器
const sortable = new SortableManager({
  ...sortableClasses,
  onCancel() {
    viewport.clearSelectTarget();
  },
  onSort(res) {
    ws.emit({
      to: ["studio"],
      type: "template_sort_complete",
      payload: { ...res },
    });
  },
});

// 监听渲染完成事件
ws.on("miniapp_render_complete", ({ payload, from }) => {
  if (from === "miniapp") {
    // 清除选择状态
    move.clearAllSelections();

    // 根据页面类型初始化不同的交互管理器
    if (viewport.isGridLayout()) {
      sortable.init();
    } else {
      move.init();
    }

    // 如果有自动选择目标，应用选择
    if (viewport.autoSelectTargetId) {
      viewport.clearSelectTarget({ emitEvent: false });
      viewport.applyAutoSelectTarget((elem) => {});
    }

    // 发送渲染完成事件
    window.requestAnimationFrame(() => {
      const rootStyle = viewport.isGridLayout()
        ? sortable.getRootStyle()
        : move.getRootStyle();
      if (rootStyle) {
        ws.emit({
          to: ["studio"],
          type: "template_render_complete",
          payload: { rootStyle },
        });
      }
    });
  }
});

// 处理 Studio 发起的渲染请求
ws.on("studio_render_start", ({ payload, from }) => {
  const { tree, highlightId } = payload;

  if (highlightId) {
    viewport.clearSelectTarget({ emitEvent: false });
    viewport.setAutoSelectTargetId(highlightId);
  }

  if (tree) {
    const { pageType = PAGE_TYPE.ABSOLUTE } = tree;
    viewport.setPageType(pageType);
    document.documentElement.setAttribute("data-page-layout", pageType);
  }

  // 处理资源加载
  if (payload.assetsResource) {
    let { usingComponents, viewAssets } = payload.assetsResource;
    ws.emit({
      to: ["webshell"],
      type: "load_assets",
      payload: { action: "start" },
    });

    loadResources(viewAssets, () => {
      Mini.updatePageConfig(
        "pages/tab1/index",
        (config) => {
          config.usingComponents = {
            ...config.usingComponents,
            ...usingComponents,
          };
          return config;
        },
        () => {
          ws.emit({
            to: ["webshell"],
            type: "load_assets",
            payload: { action: "done" },
          });
          ws.emit({
            to: ["service"],
            type: "template_view_configuration_complete",
            payload,
          });
        }
      );
    });
  }
});
```

#### 2.4 视口管理与组件选择处理

```typescript
// viewport.ts (大致实现)
export const viewport = {
  selectTarget: null,
  autoSelectTargetId: "",
  pageType: "absolute",
  ws: null,

  bindWs(wsClient) {
    this.ws = wsClient;
  },

  isGridLayout() {
    return this.pageType === "grid";
  },

  setPageType(type) {
    this.pageType = type;
  },

  getSelectTarget() {
    return this.selectTarget;
  },

  setSelectTarget(target) {
    this.selectTarget = target;

    if (this.ws) {
      this.ws.emit({
        to: ["studio"],
        type: "template_select_component",
        payload: {
          instanceId: target.getAttribute("instanceid"),
        },
      });
    }
  },

  clearSelectTarget({ emitEvent = true } = {}) {
    if (!this.selectTarget) return;

    this.selectTarget = null;

    if (emitEvent && this.ws) {
      this.ws.emit({
        to: ["studio"],
        type: "template_clear_select",
        payload: {},
      });
    }
  },

  setAutoSelectTargetId(id) {
    this.autoSelectTargetId = id;
  },

  applyAutoSelectTarget(callback) {
    if (!this.autoSelectTargetId) return;

    const target = document.querySelector(
      `[instanceid="${this.autoSelectTargetId}"]`
    );
    if (target) {
      this.setSelectTarget(target);
      if (callback) callback(target);
    }
  },
};
```

### 3. Sandbox 的核心技术原理

#### 3.1 隔离沙箱机制

Sandbox 环境通过以下机制实现了安全隔离：

- 独立运行时：基于小程序框架的独立运行时，避免全局污染
- iframe 隔离：使用 iframe 实现 DOM 和 JavaScript 隔离
- 资源隔离：通过独立的资源加载机制实现资源隔离

#### 3.2 组件渲染机制

沙箱中的组件渲染采用了声明式语法：

- JSON 描述：使用 JSON 对象描述组件的结构、属性和关系
- 组件解析：将 JSON 描述转换为实际的组件对象
- 动态渲染：使用 React 组件树进行 UI 渲染

```typescript
// 组件树渲染示例
function handlerRenderData(data) {
  if (!data) return null;

  // 获取组件类型
  let tagComponent = getComponentFromRayMaterial(data.tag);

  return {
    tag: tagComponent,
    props: data.props,
    children: data.children && data.children.map(handlerRenderData),
  };
}
```

#### 3.3 交互控制系统

沙箱环境实现了两种不同的布局交互控制系统：

- 绝对定位（Moveable）：
  - 支持组件自由拖拽、大小调整
  - 基于坐标系的精确定位
- 网格布局（Sortable）：
  - 支持组件排序和拖放
  - 基于网格的自适应布局

#### 3.4 实时通信机制

基于 WebSocket 的实时通信机制支持以下功能：

- 事件驱动：通过事件订阅和发布实现松耦合通信
- 多端通信：支持编辑器、沙箱、逻辑层之间的多端通信
- 消息路由：根据目标路由消息到正确的接收方

```typescript
// WebSocket 通信示例
ws.emit({
  to: ["studio"], // 目标接收方
  type: "template_select_component", // 消息类型
  payload: {
    // 消息数据
    instanceId: target.getAttribute("instanceid"),
  },
});

// 监听消息
ws.on("page_config_change", ({ payload }) => {
  // 处理页面配置变更
  setPageConfig(payload);
});
```

### 4. 关键交互流程

#### 4.1 组件拖拽流程

1. 用户在编辑器中拖拽组件到画布
2. 编辑器发送配置到沙箱
3. 沙箱渲染并触发选中高亮
4. 用户调整组件位置或大小
5. 沙箱发送调整信息回编辑器
6. 编辑器更新组件树配置

#### 4.2 页面渲染流程

1. 编辑器生成页面 JSON 描述
2. 通过 WebSocket 发送到沙箱
3. 沙箱加载必要资源（样式、组件）
4. 沙箱解析 JSON 并渲染组件树
5. 渲染完成后通知编辑器
6. 编辑器更新 UI 状态

### 5. 总结

Sandbox 环境结合了现代 Web 技术和小程序的架构思想，实现了一个高性能、可扩展的低代码运行环境，为 IoT 设备控制应用的快速开发提供了坚实的技术基础。

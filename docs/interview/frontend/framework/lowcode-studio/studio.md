# Studio 核心编辑器的实现原理与关键代码

Studio 核心编辑器是整个低代码平台的核心，它采用了现代化的前端架构实现组件拖拽、属性编辑、数据绑定等功能。下面从架构设计和关键代码两方面详细解析其实现原理：

### 1. 核心架构设计

#### 1.1 状态管理机制

Studio 使用 Zustand 作为状态管理方案，它比 Redux 更轻量且易于使用。状态被分成多个独立的 store，每个 store 负责特定的功能域：

- pagesStore: 管理页面配置和当前页面状态
- componentsStore: 管理组件库和组件配置
- selectComponentStore: 管理当前选中组件状态
- featureStore: 管理设备功能点(DP 点)相关状态
- themeStore: 管理主题相关配置
- ruleStore: 管理设备控制规则
- draftStore: 管理草稿和保存状态

2. 编辑器与沙箱通信机制
   采用 WebSocket 实现编辑器与沙箱环境的双向通信，主要通过 socket.ts 中定义的协议和消息类型：

- Side.miniapp
- Side.template
- Side.webshell
- Side.service

3. 调度器设计
   EditorScheduler 是整个编辑器的核心调度器，负责监听各种状态变化并触发相应的操作：

- 监听页面配置变化，通知沙箱更新
- 监听组件选中状态变化，处理属性面板展示
- 监听主题变化，更新视图渲染
- 监听多语言变化，更新国际化内容

### 2. 关键代码实现

#### 2.1 编辑器初始化流程

```typescript
// 在 editor/index.tsx 中
const launch = async () => {
// 1. 获取路由参数
const packageId = getRouter().params.packageId

// 2. 并行请求初始化数据
const [detail, _supportLangs, locales, libraryComponents] = await Promise.all([
getUIDetail(),
getSupportLangs(),
getLocales(),
getAllComponents({ libraryCode: LIBRARY_CODE }),
])

// 3. 获取产品和发布信息
const [productInfo, publishInfo] = await Promise.all([
getProductInfo(productId),
getPublishInfo(),
])

// 4. 获取更多配置数据
const [ruleList, features, featureLocales, ...otherData] = await Promise.all([
// 多项并行请求
])

// 5. 初始化各个 store 的状态
setLanguage(currentLang)
setFeatureMap(normalizedFeatures)
silentUpdatePagesStore(pageSchemas)
initTheme(...)

// 6. 通知沙箱初始化渲染
sandboxActions.renderPage()
}
```

#### 2.2 沙箱通信实现

sandboxActions.ts 封装了与沙箱通信的所有操作：

```typescript
export const sandboxActions = {
// 通知沙箱更新页面配置
pageConfigChange(pageId?: string) {
const { getCurrentPage, pages } = usePagesStore.getState()
const currentPage = pageId ? pages.find((page) => page.id === pageId) : getCurrentPage()
const payload = getPageConfigChangeData(currentPage!)

    socket.sendMessage({
      type: 'page_config_change',
      to: [Side.webshell, Side.miniapp],
      payload: payload,
    })

},

// 启动渲染
studioRenderStart(params?: {...}, pageId?: string) {
// 获取当前渲染数据
let currentRenderData = getCurrentJsonTree()

    // 处理资源依赖
    if (assetsResource) {
      const resourceUrls = findResourceUrls(treeComponentTags, components)
      resolveAssetsResource(resourceUrls).then((assetsResource) => {
        socket.sendMessage({
          to: [Side.template],
          type: MessageType.StudioRenderStart,
          payload: {
            tree: currentRenderData,
            assetsResource,
            renderKey: forceUpdate ? Date.now() : 0,
            highlightId,
          },
        })
      })
    }

}
```

#### 2.3 状态监听与变更调度

EditorScheduler 实现了对各个 store 的监听和调度：

```typescript
useEffect(() => {
  // 监听页面配置变化
  const unsubscribe1 = usePagesStore.subscribe((state, prevState) => {
    const nowPage = state.currentPage;
    const prevPage = prevState.currentPage;
    if (!pickDeepEqual(state, prevState, ["pages"])) {
      scheduledSave();
      setSaved(false);
      doResetPublishStep();
    }

    if (!pickDeepEqual(nowPage, prevPage, ["pageConfig", "themeConfig"])) {
      sandboxActions.pageConfigChange();
      uiActions.pageConfigChange();
    }
  });

  // 监听多语言变化
  const unsubscribe2 = useLangCenterStore.subscribe((state, prevState) => {
    if (!pickDeepEqual(state, prevState, ["localLangs"])) {
      setSaved(false);
      doResetPublishStep();
      scheduledSave();
    }

    if (!pickDeepEqual(state, prevState, ["localLangs", "lang", "langs"])) {
      uiActions.pageConfigChange();
      sandboxActions.pageConfigChange();
      sandboxActions.i18nUpdate(state);
      sandboxActions.studioRenderStart({ forceUpdate: true });
    }
  });

  // 监听来自 AI 的规则应用
  const windowMessage = (event: MessageEvent) => {
    if (event.data && event.data.source === "iot-rc-bridge") {
      const { payload } = event.data;
      const { type } = payload;

      if (type === "APPLY_THEME") {
        // 应用AI生成的主题
        useThemeStore
          .getState()
          .applyGlobalTheme({ light: lightTheme, dark: darkTheme });
      } else if (type === "APPLY_RULE") {
        // 应用AI生成的规则
        const { rule } = payload;
        const newRule = clearAiRule(rule);
        // 验证和保存规则
      }
    }
  };
}, []);
```

#### 2.4 性能优化关键代码

```typescript
// 使用深比较优化重渲染性能
if (!pickDeepEqual(state, prevState, ["pages"])) {
  // 只有当 pages 真正变化时才执行
  doSomething();
}

// 使用 memo 和 useShallow 优化组件性能
export const Editor = memo(() => {
  const [setLibraryLocales, setDirectoryTree, setStyleList] = useSidebarStore(
    useShallow((state) => [
      state.setLibraryLocales,
      state.setDirectoryTree,
      state.setStyleList,
    ])
  );

  // 组件实现
});
```

### 3. 关键技术点

#### 3.1 组件树的动态渲染

- 使用 JSON 配置描述组件树
- 通过沙箱环境中的 JSON-Renderer 渲染组件

#### 3.2 状态与视图分离

- 编辑器负责状态管理和用户交互
- 沙箱负责视图渲染和预览

#### 3.3 高效的状态管理

- 使用 Zustand 进行精细化的状态管理
- 状态变更自动触发相应的调度操作

#### 3.4 事件委托机制

- 编辑器与沙箱通过 Socket 通信
- 支持事件委托和上下文传递

#### 3.5 灵活的扩展机制

- 组件库可以动态加载和更新
- 支持自定义组件的开发和集成

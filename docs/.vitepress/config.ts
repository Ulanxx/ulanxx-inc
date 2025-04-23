import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
  title: "{ Ulanxx Inc }",
  description: "Ulanxx Inc 🚀 个人技术孵化站点",
  head: [
    ["link", { rel: "icon", href: "/x.ico" }],
    ["meta", { name: "theme-color", content: "#ff6b6b" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],
  locales: {
    root: {
      label: "简体中文",
      lang: "zh",
      title: "Ulanxx 技术站",
      description: "技术积累与思考，前端面试速通，工程化实践",
      themeConfig: {
        siteTitle: "{ Ulanxx Inc }",
        nav: [
          { text: "首页", link: "/" },
          {
            text: "前端面试速通",
            link: "/interview/",
            activeMatch: "^/interview/",
          },
          {
            text: "技术笔记",
            link: "/blog/",
            activeMatch: "^/blog/",
          },
          {
            text: "思考",
            link: "/idea/",
            activeMatch: "^/idea/",
          },
          { text: "关于", link: "/about/" },
        ],
        sidebar: {
          "/interview/": [
            {
              text: "前端面试速通",
              items: [
                { text: "概述", link: "/interview/" },
                { text: "算法与数据结构", link: "/interview/algorithm/" },
                { text: "计算机网络", link: "/interview/network/" },
                { text: "前端基础", link: "/interview/frontend/" },
                { text: "模拟面试", link: "/interview/mock/" },
              ],
            },
          ],
          "/blog/": [
            {
              text: "技术笔记",
              items: [
                { text: "目录", link: "/blog/" },
                {
                  text: "样式解决方案",
                  collapsed: false,
                  items: [
                    {
                      text: "Tailwind CSS 快速上手",
                      link: "/blog/style/tailwind/",
                    },
                    {
                      text: "Tailwind CSS、ShadCN、Radix UI",
                      link: "/blog/style/tailwind/relations",
                    },
                  ],
                },
                {
                  text: "Chrome 扩展开发实战教程",
                  collapsed: false,
                  items: [
                    {
                      text: "二维码生成与扫描工具",
                      link: "/blog/chrome-extension/qr-code",
                    },
                  ],
                },
                {
                  text: "自动化工具",
                  collapsed: false,
                  items: [
                    { text: "automa 介绍", link: "/blog/automa/intro" },
                    {
                      text: "automa 项目开发与构建流程",
                      link: "/blog/automa/dev-build",
                    },
                    {
                      text: "automa 项目二次开发指南",
                      link: "/blog/automa/project",
                    },
                    {
                      text: "automa 工作流录制功能深度解析",
                      link: "/blog/automa/record-workflow",
                    },
                  ],
                },
                {
                  text: "国际化",
                  link: "/blog/intl/intro",
                },
                {
                  text: "前端基建体系化建设指南",
                  link: "/blog/fe/basis",
                },
              ],
            },
          ],
          "/idea/": [
            {
              text: "思考与分享",
              items: [{ text: "概述", link: "/idea/" }],
            },
          ],
        },
        footer: {
          message: "基于 MIT 许可发布",
          copyright: "Copyright © 2024-present Ulanxx Inc 🚀",
        },
        outline: {
          level: "deep",
          label: "本页目录",
        },
        lastUpdated: {
          text: "最后更新时间",
          formatOptions: {
            dateStyle: "full",
            timeStyle: "short",
          },
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        socialLinks: [
          { icon: "github", link: "https://github.com/Ulanxx/ulanxx-inc" },
        ],
      },
    },
  },
  themeConfig: {
    search: {
      provider: "local",
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => text.split(/[\s\-_]+|(?=[A-Z])/),
            processTerm: (term) => term.toLowerCase(),
          },
          searchOptions: {
            fuzzy: 0.3,
            prefix: true,
            boost: {
              title: 5,
              heading: 3,
              text: 1,
              tag: 2,
              anchor: 4,
            },
          },
        },
      },
    },
  },
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
});

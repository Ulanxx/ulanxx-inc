import { defineConfig } from "vitepress";
import { configureDiagramsPlugin } from "vitepress-plugin-diagrams";

export default defineConfig({
  title: "{ Ulanxx Inc }",
  description: "Ulanxx Inc 🚀 个人技术孵化站点",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#ff6b6b' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
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
            activeMatch: "^/interview/"
          },
          { 
            text: "技术笔记", 
            link: "/blog/",
            activeMatch: "^/blog/"
          },
          { 
            text: "思考", 
            link: "/idea/",
            activeMatch: "^/idea/"
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
                { text: "模拟面试", link: "/interview/mock/" }
              ]
            }
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
                    { text: "Tailwind CSS 快速上手", link: "/blog/style/tailwind/" },
                    { text: "组件库关系梳理", link: "/blog/style/tailwind/relations" }
                  ]
                },
                {
                  text: "自动化工具",
                  collapsed: false,
                  items: [
                    { text: "Automa 介绍", link: "/blog/automa/intro" }
                  ]
                }
              ]
            }
          ],
          "/idea/": [
            {
              text: "思考与分享",
              items: [
                { text: "概述", link: "/idea/" }
              ]
            }
          ]
        },
        footer: {
          message: "基于 MIT 许可发布",
          copyright: "Copyright © 2024-present Ulanxx Inc 🚀",
        },
        outline: {
          level: "deep",
          label: "本页目录"
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
          { icon: "github", link: "https://github.com/Ulanxx/fe-interview" },
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
  markdown: {
    lineNumbers: true,
    config: (md) => {
      configureDiagramsPlugin(md, {
        diagramsDir: "docs/public/diagrams",
        publicPath: "/diagrams",
      });
    },
  },
});

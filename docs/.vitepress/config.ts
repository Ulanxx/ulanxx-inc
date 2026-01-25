import { withMermaid } from "vitepress-plugin-mermaid";
import type { SitemapItem } from 'sitemap';

import * as fs from 'fs';
import * as path from 'path';

// SEO 优化配置
const seoConfig = {
  title: "{ Ulanxx Inc }",
  description: "Ulanxx Inc 🚀 个人技术孵化站点，提供前端面试资料、技术笔记和工程化实践分享",
  canonical: "https://ulanxx-inc.com",
  author: "Ulanxx Inc",
  keywords: ["前端开发", "JavaScript", "React", "Vue", "面试题", "技术博客", "工程化", "SEO"]
};

export default withMermaid({
  title: "{ Ulanxx Inc }",
  description: "Ulanxx Inc 🚀 个人技术孵化站点",
  head: [
    // 基本图标和主题色
    ["link", { rel: "icon", href: "/melon.svg" }],
    ["meta", { name: "theme-color", content: "#4CAF50" }],
    
    // 移动设备优化
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
    
    // SEO 优化
    ["meta", { name: "description", content: "Ulanxx Inc 技术站点，提供前端面试资料、技术笔记和工程化实践分享" }],
    ["meta", { name: "keywords", content: "前端开发,JavaScript,React,Vue,面试题,技术博客,工程化,SEO" }],
    ["meta", { name: "author", content: "Ulanxx Inc" }],
    
    // 社交媒体优化
    ["meta", { property: "og:title", content: "Ulanxx Inc - 技术站点" }],
    ["meta", { property: "og:description", content: "前端技术积累与思考，面试速通，工程化实践" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://ulanxx-inc.com" }],
    ["meta", { property: "og:image", content: "/melon.svg" }],
    
    // Twitter 卡片
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Ulanxx Inc - 技术站点" }],
    ["meta", { name: "twitter:description", content: "前端技术积累与思考，面试速通，工程化实践" }],
    ["meta", { name: "twitter:image", content: "/melon.svg" }],
    
    // 站点验证
    ["meta", { name: "ahrefs-site-verification", content: "6cd6e54203e33c8879184e8123af343fd507e4173f32378ca8c02fa9b84954b4" }],
    ["meta", { name: "google-site-verification", content: "" }],
  ],
  appearance: true,
  lastUpdated: true,
  locales: {
    root: {
      label: "简体中文",
      lang: "zh",
      title: "Ulanxx 技术站",
      description: "技术积累与思考，前端面试速通，工程化实践",
      themeConfig: {
        siteTitle: "{ Ulanxx Inc }",
        logo: {
          light: '/logo-light.svg',
          dark: '/logo-dark.svg',
          alt: 'Ulanxx Inc Logo'
        },
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
            text: "AI",
            link: "/ai/",
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
            tokenize: (text: string) => text.split(/[\s\-_]+|(?=[A-Z])/),
            processTerm: (term: string) => term.toLowerCase(),
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
    // 自定义主题颜色
    colors: {
      primary: {
        50: '#e6f1ff',
        100: '#cce3ff',
        200: '#99c8ff',
        300: '#66adff',
        400: '#3392ff',
        500: '#0077ff',
        600: '#0062cc',
        700: '#004d99',
        800: '#003366',
        900: '#001a33',
      },
    },
    // 自定义CSS变量
    appearance: 'dark',
    carbonAds: {
      placement: 'ulanxxinc',
    },
    // 增强页面过渡效果
    pageTransition: true,
  },
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
  sitemap: {
    hostname: 'https://ulanxx-inc.com',
    //@ts-ignore
    transformItems: (items: SitemapItem[]) => {
      const customItems = [
        { url: '/about', changefreq: 'monthly', priority: 0.8 },
        { url: '/interview', changefreq: 'weekly', priority: 0.9 },
        { url: '/blog', changefreq: 'weekly', priority: 0.9 },
        { url: '/idea', changefreq: 'monthly', priority: 0.7 }
      ];
      
      const enhancedItems = items.map(item => ({
        ...item,
        changefreq: 'weekly',
        priority: item.url === '/' ? 1.0 : 0.8
      }));
      
      return [...enhancedItems, ...customItems];
    }
  },
  cleanUrls: true,
  buildEnd: ({ outDir }) => {
    try {
      const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://ulanxx-inc.com/sitemap.xml`;
      fs.writeFileSync(path.resolve(outDir, 'robots.txt'), robotsTxt);
      
      // 创建 Google 站点验证文件
      fs.writeFileSync(path.resolve(outDir, 'google123456789.html'), '<html><head><title>Google Site Verification</title></head><body>Google site verification</body></html>');
      
      // 创建 Bing 站点验证文件
      fs.writeFileSync(path.resolve(outDir, 'BingSiteAuth.xml'), '<?xml version="1.0"?><users><user>YOUR_BING_VERIFICATION_CODE</user></users>');
      
      // 创建网站地图索引文件
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://ulanxx-inc.com/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;
      fs.writeFileSync(path.resolve(outDir, 'sitemap-index.xml'), sitemapIndex);
    } catch (err) {
      console.error('Error generating SEO files:', err);
    }
  },
  transformPageData: (pageData) => {
    // 确保 frontmatter.head 存在
    pageData.frontmatter.head = pageData.frontmatter.head || [];
    
    // 添加结构化数据 - 网站信息
    pageData.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.title,
        description: seoConfig.description,
        url: seoConfig.canonical,
        author: {
          '@type': 'Person',
          name: seoConfig.author
        },
        keywords: seoConfig.keywords.join(', ')
      })
    ]);
    
    // 如果是文章页面，添加文章结构化数据
    if (pageData.frontmatter.title && pageData.frontmatter.date) {
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: pageData.frontmatter.title,
          datePublished: pageData.frontmatter.date,
          dateModified: pageData.lastUpdated || pageData.frontmatter.date,
          author: {
            '@type': 'Person',
            name: seoConfig.author
          },
          publisher: {
            '@type': 'Organization',
            name: seoConfig.title,
            logo: {
              '@type': 'ImageObject',
              url: `${seoConfig.canonical}/melon.svg`
            }
          },
          description: pageData.frontmatter.description || seoConfig.description,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${seoConfig.canonical}${pageData.relativePath.replace(/\.md$/, '')}`
          }
        })
      ]);
    }
    
    // 添加规范链接
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: `${seoConfig.canonical}${pageData.relativePath.replace(/\.md$/, '')}` }
    ]);
  }
});

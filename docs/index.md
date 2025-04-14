---
layout: home
hero:
  name: "{ Ulanxx Inc }"
  text: "技术积累与探索"
  tagline: 分享前端技术、工程化实践与思考，助力开发者进阶成长
  actions:
    - theme: brand
      text: 前端面试速通
      link: /interview/
    - theme: alt
      text: 技术笔记
      link: /blog/
    - theme: alt
      text: GitHub
      link: https://github.com/Ulanxx/fe-interview

features:
  - icon: 💻
    title: 前端技术栈
    details: React、Vue、TypeScript、小程序、跨端开发、前端工程化等技术积累与最佳实践。
  - icon: 🚀
    title: 性能优化
    details: 前端性能优化策略、工具使用、监控与分析，提升用户体验。
  - icon: 🤖
    title: AI 应用
    details: AI 在前端开发中的应用，提升开发效率与产品体验。
  - icon: 📝
    title: 面试题库
    details: 系统整理前端面试常见问题及解答，助力求职进阶。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #3b82f6, #06b6d4);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #3b82f680 30%, #06b6d480 70%);
  --vp-home-hero-image-filter: blur(60px);
  --vp-c-brand: #3b82f6;
  --vp-c-brand-light: #06b6d4;
  --vp-button-brand-bg: #3b82f6;
  --vp-button-brand-hover-bg: #06b6d4;
  --vp-button-brand-active-bg: #2563eb;
  --vp-button-brand-active-border: #2563eb;
  --vp-c-divider: rgba(60, 60, 60, 0.12);
  --vp-c-divider-light: rgba(60, 60, 60, 0.08);
  --vp-c-divider-dark: rgba(84, 84, 84, 0.48);
  --vp-font-family-base: 'Inter', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --vp-font-family-mono: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}

/* 标题样式 */
.VPHero .name {
  font-weight: 800;
  letter-spacing: -0.5px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background-clip: text;
  -webkit-background-clip: text;
  transition: all 0.3s ease;
}

.VPHero .name:hover {
  letter-spacing: 0px;
}

.VPHero .text {
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
}

.VPHero .tagline {
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.5;
}

/* 特性卡片样式 */
.VPFeature {
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 12px;
  padding: 24px 20px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.dark .VPFeature {
  background-color: rgba(30, 30, 32, 0.5);
}

.VPFeature:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-light);
}

.VPFeature .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: all 0.3s ease;
}

.VPFeature:hover .icon {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
}

.VPFeature .title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.VPFeature .details {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 14px;
}

/* 响应式调整 */
@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(48px);
  }
  
  .VPFeature {
    padding: 28px 24px;
  }
  
  .VPFeature .details {
    font-size: 15px;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(60px);
  }
  
  .VPHero .name {
    font-size: 4.5rem !important;
  }
  
  .VPHero .text {
    font-size: 3rem !important;
  }
  
  .VPHero .tagline {
    font-size: 1.25rem !important;
  }
}
</style>

const n=`---
title: "Tailwindcss4 QUDE极简风布局设计复现"
date: "2025-12-15"
tags: ["CSS", "Tailwindcss", "React"]
category: "学习"
excerpt: "web极简风布局实现"
coverImage: "https://tse4-mm.cn.bing.net/th/id/OIP-C.tTTuwLk-IMK6_JEiQ53m-QHaEo?w=245&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"
readTime: 5
---

- 🌓 **暗黑模式**: 自动切换和手动切换
- 📱 **响应式设计**: 适配各种设备屏幕
- **极简设计**:
  - 视觉降噪：滚动时隐藏非必要元素
  - 空间高效：三栏网格最大化利用宽度
  - 动效克制：仅保留必要的过渡反馈
  - 层级清晰：z-index 系统严格管理

> [QUDE](https://qude.audio)： LOGO 和网页配色统一，排版简洁，细节把控到位，完美契合极简风的质感要求。

| 大屏                                         | 小屏                                                |
| -------------------------------------------- | --------------------------------------------------- |
| ![最终效果图](/posts/tailwindcss_layout.gif) | ![最终效果图](/posts/tailwindcss_layout_mobile.gif) |

## 主题配置

> \`global.css\`

\`\`\`css
...
@layer components {
  /* header伪元素 */
  header::before {
    content: "";
    @apply fixed top-0 left-0 w-full h-[43px] -z-1 bg-background opacity-0 duration-400;
  }

  .container {
    @apply p-4 sm:p-6 md:p-8 lg:p-20 w-full min-h-dvh;
  }
}
...
\`\`\`

## Header

| 样式             |                                                                      | description                    |
| ---------------- | -------------------------------------------------------------------- | ------------------------------ |
| 定位             | \`absolute lg:fixed\`                                                  | 桌面端始终显示，移动端滚动显示 |
| 网格布局         | \`py-2.5 lg:py-[25px] px-[50px] w-full grid grid-cols-3 items-center\` |                                |
| 层级控制         | \`z-20\`                                                               |                                |
| 透明渐变背景遮罩 | \`bg-linear-to-b from-background via-background/40 to-transparent\`    |                                |
| 不透明背景遮罩   | header::before                                                       | 默认隐藏，仅移动端显示         |
| 过渡动画         | \`!isTop && "before:opacity-100 lg:before:content-none"\`              | 不透明背景遮罩智能渲染         |

### Header.Logo

| 样式     |                                                                   | description                    |
| -------- | ----------------------------------------------------------------- | ------------------------------ |
| 定位     | \`fixed lg:relative top-2.5 lg:top-0\`                              | 桌面端始终显示，移动端滚动显示 |
| 布局     | \`block w-[97px] justify-self-center lg:justify-self-start\`        | 桌面端靠左，移动端居中         |
| 文本效果 | \`text-2xl font-bold\`                                              |                                |
| 过渡动画 | \`opacity-0 lg:opacity-100 \${isTop && "opacity-100 duration-400"}\` | 透明度变换                     |

### Header.Menu

| 样式     |                                                                                                    | description                |
| -------- | -------------------------------------------------------------------------------------------------- | -------------------------- |
| 定位     | \`group fixed lg:absolute left-[calc(50%-40px)] lg:left-auto bottom-0 lg:bottom-[initial] lg:top-0\` | 桌面端顶部，移动端底部     |
| 布局     | \`py-[15px] lg:py-[25px] justify-self-center flex flex-col items-center gap-2.5\`                    | 始终居中                   |
| 层级控制 | \`z-20\`                                                                                             | 顶层                       |
| 文本效果 | \`text-center text-[9px] tracking-[0.0em] uppercase\`                                                |                            |
| 过渡效果 | \`!isMenuOpen && isTop && "pointer-events-none  opacity-0"\`                                         | 透明度变换，隐藏时不可点击 |

#### Menu.Nav

**导航菜单定位容器**
| 样式 | | description |
| ---- | ------------------------------------------------------ | ---------------------------------- |
| 定位 | \`fixed bottom-2.5 lg:bottom-[initial] lg:top-0 left-0\` | 桌面端默认在页面上方，移动端在下方 |
| 布局 | \`w-full pt-2.5 px-2.5\` | |
| 层级 | \`z-10\` | 位于 MENU 下方 |
| 过渡效果 | \`!isMenuOpen && "pointer-events-none"\` | 避免覆盖 Header.Action 的点击 |

#### Menu.Nav.nav

**导航菜单**
| 样式 | | description |
| ---- | -------------------------------------------------------------------------------------------- | ----------- |
| 定位布局 | \`relative w-full text-center pt-10 lg:pt-[15px] pb-2.5 lg:flex lg:flex-col lg:items-center lg:gap-20\` | |

#### Menu.Nav.nav.div

**导航菜单模糊背景遮罩**
| 样式 | | description |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 定位布局 | \`absolute top-0 left-0 w-full h-full\`| |
| 层级 | \`z-0\` | 位于 Menu.Nav.nav 下 |
| 模糊背景遮罩 | \`rounded-[10px] backdrop-blur-[100px] bg-muted/40\` | |
| 过度效果 | \`isMenuOpen\`<br>\` ? "origin-bottom lg:origin-top scale-y-100 duration-800\`<br>\`: "origin-bottom lg:origin-top scale-y-0 duration-600 delay-500"\` | 抽屉效果 |

#### Menu.Nav.nav.ul

**导航菜单列表**
| 样式 | | description |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
|定位布局 | \`relative mb-[50px] lg:mb-[30px] lg:mt-[90px] grid gap-[5px] lg:gap-0\`| |
| 层级 | \`z-10\` | 位于 Menu.Nav.nav.div 上 |
| 分组 | \`group\` | |

#### Menu.Nav.nav.ul.li

| 样式       |                                                                                   | description |
| ---------- | --------------------------------------------------------------------------------- | ----------- |
| 布局       | \`block mx-auto\`                                                                   | 居中        |
| 文本效果   | \`text-2xl md:text-4xl font-semibold text-foreground/70 uppercase overflow-hidden\` |             |
| 过度效果 1 | \`group-hover:opacity-20 group-hover:hover:opacity-100\`                            | 悬浮聚焦    |
| 过度效果 2 | \`isMenuOpen ? "translate-y-0":"translate-y-[110%] lg:-translate-y-[110%]"\`        | 下滑效果    |

### Header.Action

**主题切换**:
| 样式 | | description |
| ---- | --- | ----------- |
| 定位 | \`absolute lg:fixed top-[25px] lg:top-0  right-5 lg:right-[50px]\` | 桌面端始终显示，移动端滚动显示 |
| 布局 | \`px-[11px] lg:py-[25px] pt-2 pb-1.5\` | |
| 过渡效果 | \`hover:text-primary duration-400\` | |

## Footer

| 样式 |                                                          | description |
| ---- | -------------------------------------------------------- | ----------- |
| 定位 | \`relative\`                                               |             |
| 布局 | \`px-5 md:px-[50px] pt-5 pb-20 md:pb-[25px] md:pt-[75px]\` |             |

### Footer.Contact

| 样式     |                                                                                                         | description                    |
| -------- | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 布局     | \`flex flex-col md:flex-row items-center md:items-start md:justify-between pt-10 md:pt-[25px] gap-[5px]\` | 桌面端横向排布，移动端纵向排布 |
| 文本     | \`uppercase tracking-[-0.02em] font-normal\`                                                              |                                |
| 过渡效果 | \`hover:opacity-50 duration-300\`                                                                         |                                |
`;export{n as default};

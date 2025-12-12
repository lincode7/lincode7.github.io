# 个人主页项目

基于 Vite + React + TypeScript 构建的现代化个人主页，支持博客系统、兴趣展示、暗黑模式等功能。

## ✨ 特性

- 🏠 **首页**: 个人信息、联系方式和博客统计
- 📝 **博客系统**: 标签云、文章列表、Markdown 渲染
- 🎮 **兴趣主页**: 游戏、电影、音乐、旅行记录
- 🌓 **暗黑模式**: 自动切换和手动切换
- 📱 **响应式设计**: 适配各种设备屏幕
- ⚡ **性能优化**: 代码分割、懒加载、PWA 支持
- 🔍 **SEO 优化**: 完整的元标签和结构化数据
- 🚀 **自动部署**: GitHub Actions 自动部署到 GitHub Pages

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. 新增markdown博客

博客文件目录：`/content/posts/`

markdown格式：头信息+正文

```markdown
---
title: "博客标题"
date: "创建日期"
tags: ["标签"]
category: "分类"
excerpt: "摘要"
coverImage: "头图（可选）"
readTime: 5（可选，阅读时间，分钟）
---

正文
```

### 3.  新增兴趣项

兴趣数据目录：`/content/interests/`

文件格式：`json`

根据兴趣类型创建相应文件夹，如：`/content/interests/games/1.json`

json文件格式:

```json
{

}
```

### 4. 构建&部署

```bash
npm run depoly
```

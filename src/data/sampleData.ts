import { BlogPost, BlogStats, BlogTag } from "../types/blog";
import { InterestStats } from "../types/interests";
import { UserInfo } from "../types/user";

// 用户信息
export const userInfo: UserInfo = {
  name: "胡煊林",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
  bio: "热爱技术分享 | 游戏爱好者",
  location: "昆明，云南",
  company: "TechCorp",
  stats: {
    blogCount: 42,
    totalVisits: 15689,
    lastUpdated: "2024-01-15",
  },
  contacts: {
    github: "lincode7",
    email: "huxuanlin@qq.com",
    wechat: "xlin_wt",
    phone: "+86 15587025323",
    qq: "1292017430",
    // twitter: "@zhangsan_dev",
  },
};

// 博客标签
export const blogTags: BlogTag[] = [
  { name: "React", count: 15, color: "#61dafb" },
  { name: "TypeScript", count: 12, color: "#3178c6" },
  { name: "Node.js", count: 8, color: "#68a063" },
  { name: "CSS", count: 10, color: "#264de4" },
  { name: "Webpack", count: 6, color: "#8dd6f9" },
  { name: "Docker", count: 5, color: "#2496ed" },
  { name: "算法", count: 7, color: "#f34b7d" },
  { name: "设计模式", count: 4, color: "#ff6b6b" },
  { name: "数据库", count: 6, color: "#4ecdc4" },
  { name: "微服务", count: 3, color: "#45b7d1" },
];

// 博客文章
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "深入理解React Hooks原理",
    date: "2024-01-15",
    tags: ["React", "Hooks", "JavaScript"],
    excerpt:
      "本文深入探讨React Hooks的内部实现原理，包括闭包、依赖收集和更新机制。",
    content: `# 深入理解React Hooks原理

React Hooks自从推出以来就彻底改变了我们编写React组件的方式...`,
    readTime: 12,
    views: 1560,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
  {
    id: "2",
    title: "TypeScript高级类型编程指南",
    date: "2024-01-10",
    tags: ["TypeScript", "类型系统", "泛型"],
    excerpt: "掌握TypeScript的高级类型编程技巧，提高代码类型安全性。",
    content: `# TypeScript高级类型编程指南

TypeScript的类型系统非常强大，支持多种高级类型操作...`,
    readTime: 15,
    views: 2340,
  },
];

// 博客统计
export const blogStats: BlogStats = {
  totalPosts: 42,
  totalTags: 24,
  totalViews: 15689,
  monthlyPosts: 5,
  recentTags: ["React", "TypeScript", "Node.js", "CSS", "Webpack"],
};

// 兴趣数据
export const interestStats: InterestStats = {
  totalGames: 42,
  totalMovies: 156,
  totalAlbums: 89,
  totalLocations: 23,
  recentActivity: {
    games: [
      {
        id: "1",
        title: "Cyberpunk 2077",
        platform: ["PC", "PS5"],
        hoursPlayed: 68,
        status: "completed",
        rating: 9,
        lastPlayed: "2024-01-15",
        coverImage:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
      },
    ],
    movies: [
      {
        id: "1",
        title: "盗梦空间",
        year: 2010,
        rating: 9.8,
        watchedDate: "2024-01-10",
        review: "烧脑神作，多层梦境的设计令人惊叹",
        poster:
          "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=300",
      },
    ],
    music: [
      {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        genre: ["Synth-pop", "Electronic"],
        rating: 9.5,
        lastListened: "2024-01-12",
        coverImage:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
      },
    ],
    travels: [
      {
        id: "1",
        name: "东京",
        country: "日本",
        visitDate: "2023-12-20",
        rating: 9.9,
        photos: [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        ],
        description: "充满活力的都市，传统与现代的完美结合",
      },
    ],
  },
};

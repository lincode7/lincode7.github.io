import matter from "gray-matter";
import hljs from "highlight.js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import type { BlogPost, InterestItem, TagCount } from "../types";

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 博客相关API
export const blogAPI = {
  // 获取博客列表
  async getPosts(
    page = 1,
    limit = 10,
    tag?: string
  ): Promise<{
    posts: BlogPost[];
    total: number;
    page: number;
    limit: number;
  }> {
    await delay(300); // 模拟网络延迟

    // 模拟数据
    const mockPosts: BlogPost[] = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      title: `博客文章标题 ${i + 1}`,
      content: `这是第 ${i + 1} 篇博客文章的内容...`,
      excerpt: `这是第 ${
        i + 1
      } 篇博客文章的摘要，这里会简要介绍文章的主要内容。`,
      date: new Date(Date.now() - i * 86400000).toISOString(), // 每天一篇
      tags: i % 2 === 0 ? ["React", "前端"] : ["Node.js", "后端"],
      readTime: Math.floor(Math.random() * 10) + 5,
      category: i % 3 === 0 ? "技术" : i % 3 === 1 ? "生活" : "旅行",
      coverImage:
        i % 4 === 0
          ? "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
          : undefined,
    }));

    let filteredPosts = mockPosts;
    if (tag) {
      filteredPosts = mockPosts.filter((post) => post.tags.includes(tag));
    }

    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = filteredPosts.slice(start, end);

    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      limit,
    };
  },

  // 获取单篇博客
  async getPost(id: string): Promise<{ meta: BlogPost; html: string }> {
    const r = await fetch(`/content/posts/${id}.md`);

    if (!r.ok) throw Error(`HTTP error! status: ${r.status}`);

    const { data: meta, content } = matter(await r.text());
    const html = await marked
      // .use(markedCodePreview())
      // .use(markedCodeFormat())
      .use(
        markedHighlight({
          emptyLangClass: "hljs",
          langPrefix: "hljs language-",
          highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "shell";
            return hljs.highlight(code, { language }).value;
          },
        })
      )

      .parse(content, {
        gfm: true,
        breaks: true,
      });

    return {
      meta: meta as BlogPost,
      html,
    };
  },

  // 获取标签统计
  async getTags(): Promise<Array<TagCount>> {
    await delay(150);

    return [
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
  },
};

// 兴趣相关API
export const interestsAPI = {
  // 获取兴趣统计
  async getStats(): Promise<{
    games: number;
    movies: number;
    music: number;
    travel: number;
  }> {
    await delay(200);

    return {
      games: 156,
      movies: 342,
      music: 789,
      travel: 24,
    };
  },

  // 获取近期活动
  async getRecentActivities(): Promise<InterestItem[]> {
    await delay(250);

    return [
      {
        id: "1",
        type: "game",
        title: "塞尔达传说：王国之泪",
        description: "完成了100%收集，包括所有神殿、呀哈哈和装备",
        date: "2024-01-20",
        tags: ["Switch", "动作冒险", "开放世界"],
        rating: 5,
        image: "https://via.placeholder.com/300x200",
      },
      {
        id: "2",
        type: "movie",
        title: "奥本海默",
        description: "克里斯托弗·诺兰的又一力作，震撼的叙事和视觉效果",
        date: "2024-01-18",
        tags: ["传记", "历史", "诺兰"],
        rating: 4.5,
        image: "https://via.placeholder.com/300x200",
      },
      {
        id: "3",
        type: "music",
        title: "Midnights - Taylor Swift",
        description: "泰勒·斯威夫特的第十张录音室专辑，午夜时分的自我反思",
        date: "2024-01-15",
        tags: ["流行", "泰勒·斯威夫特"],
        rating: 4,
      },
      {
        id: "4",
        type: "travel",
        title: "日本东京",
        description: "东京深度游，体验传统与现代的完美融合",
        date: "2024-01-10",
        tags: ["日本", "东京", "自由行"],
        rating: 5,
        image: "https://via.placeholder.com/300x200",
      },
    ];
  },

  // 按类型获取兴趣项目
  async getByType(
    type: "game" | "movie" | "music" | "travel",
    limit?: number
  ): Promise<InterestItem[]> {
    await delay(200);

    const allItems = await this.getRecentActivities();
    const filtered = allItems.filter((item) => item.type === type);

    return limit ? filtered.slice(0, limit) : filtered;
  },
};

// 站点统计API
export const statsAPI = {
  // 获取站点统计
  async getSiteStats(): Promise<{
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    recentPosts: Array<{ category: string; count: number }>;
  }> {
    await delay(300);

    return {
      totalPosts: 42,
      totalViews: 12845,
      totalComments: 236,
      recentPosts: [
        { category: "技术", count: 15 },
        { category: "生活", count: 10 },
        { category: "旅行", count: 8 },
        { category: "阅读", count: 5 },
      ],
    };
  },

  // 获取个人成就
  async getAchievements(): Promise<
    Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      unlockedAt: string;
    }>
  > {
    await delay(200);

    return [
      {
        id: "1",
        title: "博客写作达人",
        description: "连续写作30天",
        icon: "✍️",
        unlockedAt: "2024-01-15",
      },
      {
        id: "2",
        title: "技术探索者",
        description: "发表10篇技术文章",
        icon: "💻",
        unlockedAt: "2024-01-10",
      },
      {
        id: "3",
        title: "兴趣广泛者",
        description: "覆盖4个兴趣领域",
        icon: "🌟",
        unlockedAt: "2024-01-05",
      },
    ];
  },
};

// 工具函数：处理API错误
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    console.error("API Error:", error.message);
    return error.message;
  }
  console.error("Unknown API Error:", error);
  return "未知错误";
};

import matter from "gray-matter";
import type {
  BlogRepo,
  BlogStats,
  CategoryStats,
  InterestItem,
  MonthlyStats,
  Post,
  PostFrontMatter,
  TagStats,
} from "../types";

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 博客相关API
async function getAllPost(): Promise<Post[]> {
  const posts = import.meta.glob("/content/posts/*.md", {
    query: "?raw", // 作为原始文本，而不是模块
    import: "default", // 明确指定导入默认导出
  });
  const filePaths = Object.keys(posts);

  const allPosts = filePaths.map(async (path) => {
    const fileContent = await posts[path]();
    const { data, content } = matter(fileContent);
    return {
      ...(data as PostFrontMatter),
      id: path.match(/\/([^\/]+?)\.md$/)?.[1] || "",
      content,
    } as Post;
  });

  const result = await Promise.all(allPosts);
  return (
    result
      // 按日期降序（最新的在前）
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
}

let repo: BlogRepo | undefined = undefined;
async function generateBlogRepo(): Promise<BlogRepo> {
  if (repo) return repo;

  const posts = await getAllPost();

  // 初始化统计结构
  const byID: Record<string, Post> = {};
  const categories: Record<string, CategoryStats> = {};
  const tags: Record<string, TagStats> = {};
  const monthly: Record<string, MonthlyStats> = {};

  const postsByCategory: Record<string, string[]> = {};
  const postsByTag: Record<string, string[]> = {};
  const postsByMonth: Record<string, string[]> = {};

  // 计算最近一周的时间范围
  const rececnt = new Date(posts[0].date);
  const oneWeekAgo = new Date(rececnt);
  oneWeekAgo.setDate(rececnt.getDate() - 7);
  const recentTags = new Set<string>();
  const recentCategories = new Set<string>();

  posts.forEach((post) => {
    // index
    if (!byID[post.id]) {
      byID[post.id] = post;
    }

    // catergory
    if (!categories[post.category]) {
      categories[post.category] = { name: post.category, count: 0 };
      postsByCategory[post.category] = [];
    }
    categories[post.category].count++;
    postsByCategory[post.category].push(post.id);

    // tag
    post.tags.forEach((tag) => {
      if (!tags[tag]) {
        tags[tag] = { name: tag, count: 0 };
        postsByTag[tag] = [];
      }
      tags[tag].count++;
      postsByTag[tag].push(post.id);
    });

    const postDate = new Date(post.date);

    // monthly
    const yearMonth = postDate.toISOString().slice(0, 7); // "2024-01"
    if (!monthly[yearMonth]) {
      monthly[yearMonth] = { yearMonth, count: 0 };
      postsByMonth[yearMonth] = [];
    }
    monthly[yearMonth].count++;
    postsByMonth[yearMonth].push(post.id);

    // recent Tags, Categories
    if (postDate >= oneWeekAgo && postDate <= rececnt) {
      post.tags.forEach((tag) => recentTags.add(tag));
      recentCategories.add(post.category);
    }
  });

  repo = {
    stats: {
      total: posts.length,
      categories: Object.values(categories),
      tags: Object.values(tags),
      monthly: Object.values(monthly).sort(
        (a, b) =>
          new Date(b.yearMonth).getTime() - new Date(a.yearMonth).getTime()
      ),
      totalViews: 0,
      recentTags: [...recentTags],
      recentCategories: [...recentCategories],
    },
    index: {
      byID,
      byCategory: postsByCategory,
      byTag: postsByTag,
      byMonth: postsByMonth,
    },
  };

  return repo;
}

export const blogAPI = {
  // 获取博客列表
  async getPosts(
    page = 1,
    limit = 10,
    tag?: string
  ): Promise<{
    posts: Post[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { index, stats } = await generateBlogRepo();
    const { total } = stats;
    const { byID, byTag } = index;

    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;

    // filter
    if (tag) {
      const ids = byTag[tag].slice(start, end);

      return {
        posts: ids.map((id) => byID[id]),
        total: ids.length,
        page,
        limit,
      };
    }

    return {
      posts: Object.values(byID).slice(start, end),
      total,
      page,
      limit,
    };
  },

  // 获取单篇博客
  async getPost(id: string): Promise<Post> {
    const { index } = await generateBlogRepo();
    return index.byID[id];
  },

  // 获取分类统计
  async getCategories(): Promise<CategoryStats[]> {
    const { stats } = await generateBlogRepo();
    return stats.categories;
  },

  // 获取标签统计
  async getTags(): Promise<TagStats[]> {
    const { stats } = await generateBlogRepo();
    return stats.tags;
  },

  // 获取月度统计
  async getMonthly(): Promise<MonthlyStats[]> {
    const { stats } = await generateBlogRepo();
    return stats.monthly;
  },

  // 获取综合统计
  async getStats(): Promise<BlogStats> {
    const { stats } = await generateBlogRepo();
    return stats;
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

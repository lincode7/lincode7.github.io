import matter from "gray-matter";
import type {
  BlogIndex,
  BlogRepo,
  CategoryStats,
  MonthlyStats,
  Post,
  TagStats,
} from "../../types/post";

// 博客相关API
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
    const { data, index } = await generateBlogRepo();
    const { byTag } = index;

    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;

    // filter
    if (tag) {
      const orders = byTag[tag].slice(start, end);

      return {
        posts: orders.map((i) => data[i]),
        total: orders.length,
        page,
        limit,
      };
    }

    return {
      posts: data.slice(start, end),
      total: data.length,
      page,
      limit,
    };
  },

  // 获取单篇博客
  async getPost(id: string): Promise<Post> {
    const { data, index } = await generateBlogRepo();
    return data[index.byID[id]];
  },

  // 获取分类统计
  async getCategories(): Promise<CategoryStats[]> {
    const { index } = await generateBlogRepo();
    return Object.entries(index.byCategory).map(
      ([name, orders]) => ({ name, count: orders.length } as CategoryStats)
    );
  },

  // 获取标签统计
  async getTags(): Promise<TagStats[]> {
    const { index } = await generateBlogRepo();
    return Object.entries(index.byTag).map(
      ([name, orders]) => ({ name, count: orders.length } as TagStats)
    );
  },

  // 获取月度统计
  async getMonthly(): Promise<MonthlyStats[]> {
    const { index } = await generateBlogRepo();
    return Object.entries(index.byMonth).map(
      ([yearMonth, orders]) =>
        ({ yearMonth, count: orders.length } as MonthlyStats)
    );
  },

  // 获取综合统计
  async getStats() {
    const { data, index } = await generateBlogRepo();

    return {
      total: data.length,
      recentCount: index.recent.length,
      recentCategories: [...new Set(index.recent.map((i) => data[i].category))],
    };
  },
};

let blogRepo: Promise<BlogRepo>;

async function loadPosts(): Promise<Post[]> {
  const posts = import.meta.glob("/content/posts/*.md", {
    query: "?raw", // 作为原始文本，而不是模块
    import: "default", // 明确指定导入默认导出
  });
  const filePaths = Object.keys(posts);

  const all = filePaths.map(async (path) => {
    const fileContent = await posts[path]();
    const { data, content } = matter(fileContent as string);
    return {
      ...data,
      id: path.match(/\/([^\/]+?)\.md$/)?.[1] || "",
      content,
    } as Post;
  });

  const result = await Promise.all(all);
  return (
    result
      // 按日期降序（最新的在前）
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
}

async function generateBlogRepo(): Promise<BlogRepo> {
  if (blogRepo) return blogRepo;

  blogRepo = (async () => {
    const data = await loadPosts();

    // 生成索引并统计数据
    const index: BlogIndex = {
      byID: {},
      byCategory: {},
      byTag: {},
      byMonth: {},
      recent: [],
    };

    const recentDate = new Date(data[0].date);

    data.forEach((post, order) => {
      index.byID[post.id] = order;

      index.byCategory[post.category] ??= [];
      index.byCategory[post.category].push(order);

      post.tags.forEach((tag) => {
        index.byTag[tag] ??= [];
        index.byTag[tag].push(order);
      });

      const yyyyMM = post.date.slice(0, 7);
      index.byMonth[yyyyMM] ??= [];
      index.byMonth[yyyyMM].push(order);

      isRecent(new Date(post.date), recentDate) && index.recent.push(order);
    });

    return {
      data,
      index,
    };
  })();

  return blogRepo;
}

export function isRecent(date: Date, recentDate: Date): boolean {
  const sevenDaysAgo = new Date(recentDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return date >= sevenDaysAgo && date <= recentDate;
}

import matter from "gray-matter";
import type {
  BlogIndex,
  CategoryStats,
  MonthlyStats,
  Post,
  TagStats,
} from "../../types/post";
import { isRecent } from "../helper";

// 博客相关API
export const blogAPI = {
  // 获取博客列表
  async getPosts(
    page = 1,
    limit = 10,
    tag?: string
  ): Promise<{
    data: Post[];
    hasMore: boolean;
  }> {
    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;

    const { sortedID, idByTag } = await loadPostPath();

    if (tag) {
      if (idByTag) {
        return {
          data: await fetchByID(idByTag[tag].slice(start, end)),
          hasMore: end > idByTag[tag].length,
        };
      }

      const sorted = await fetchAll();
      const result = (await updateIndex(sorted, { tag })).tagPosts;
      return {
        data: result.slice(start, end),
        hasMore: end > result!.length,
      };
    }

    if (sortedID) {
      return {
        data: await fetchByID(sortedID.slice(start, end)),
        hasMore: end > sortedID.length,
      };
    }

    const sorted = await fetchAll();
    await updateIndex(sorted);
    return {
      data: sorted.slice(start, end),
      hasMore: end > sorted.length,
    };
  },

  // 获取单篇博客
  async getPost(id: string): Promise<Post> {
    return (await fetchByID([id]))[0];
  },

  // 获取分类统计
  async getCategories(): Promise<CategoryStats[]> {
    const index = await loadPostPath();
    if (!index.idByCategory || !index.tagByCategory) {
      const sorted = await fetchAll();
      await updateIndex(sorted);
    }

    const { idByCategory, tagByCategory } = index;
    return Object.entries(idByCategory!).map(([category, ids]) => ({
      name: category,
      count: ids.length,
      hotTags: [...tagByCategory![category]],
    }));
  },

  // 获取标签统计
  async getTags(): Promise<TagStats[]> {
    const index = await loadPostPath();
    if (!index.idByTag) {
      const sorted = await fetchAll();
      await updateIndex(sorted);
    }

    const { idByTag } = index;
    return Object.entries(idByTag!).map(([type, ids]) => ({
      name: type,
      count: ids.length,
    }));
  },

  // 获取月度统计
  async getMonthly(): Promise<MonthlyStats[]> {
    const index = await loadPostPath();
    if (!index.idByMonth) {
      const sorted = await fetchAll();
      await updateIndex(sorted);
    }

    const { idByMonth } = index;
    return Object.entries(idByMonth!).map(([yearMonth, ids]) => ({
      yearMonth,
      count: ids.length,
    }));
  },
};

const updateIndex = async (
  sorted: Post[],
  option?: {
    recent?: boolean;
    category?: string;
    tag?: string;
  }
) => {
  const [indexRecent, recentPosts] = await updateRecent(
    new Date(sorted[0].date),
    option?.recent
  );
  const [indexCategory, categoryPosts] = await updateByCategory(
    option?.category
  );
  const [indexTag, tagPosts] = await updateByTag(option?.tag);
  sorted.forEach((post) => {
    indexRecent(post);
    indexCategory(post);
    indexTag(post);
  });

  return {
    recentPosts,
    categoryPosts,
    tagPosts,
  };
};

const updateByCategory = async (
  category?: string
): Promise<[indexFn, Post[]]> => {
  const byCategory: Post[] = [];
  const index = await loadPostPath();
  index.idByCategory ??= {};
  return [
    (post: Post) => {
      category && post.category === category && byCategory.push(post);
      index.idByCategory![post.category] ??= [];
      index.idByCategory![post.category].push(post.id);
    },
    byCategory,
  ];
};

const updateByTag = async (tag?: string): Promise<[indexFn, Post[]]> => {
  const byTag: Post[] = [];
  const index = await loadPostPath();
  index.idByTag ??= {};
  index.tagByCategory ??= {};
  return [
    (post: Post) => {
      tag && post.tags.includes(tag) && byTag.push(post);
      post.tags.forEach((tag) => {
        index.idByTag![tag] ??= [];
        index.idByTag![tag].push(post.id);
        index.tagByCategory![post.category] ??= new Set();
        index.tagByCategory![post.category].add(tag);
      });
    },
    byTag,
  ];
};

const updateRecent = async (
  recentDate: Date,
  getRecent = false
): Promise<[indexFn, Post[]]> => {
  const recent: Post[] = [];
  const index = await loadPostPath();
  index.recentID ??= [];
  return [
    (post: Post) => {
      if (!isRecent(new Date(post.date), recentDate)) return;
      getRecent && recent.push(post);
      index.recentID!.push(post.id);
    },
    recent,
  ];
};

type indexFn = (post: Post) => void;

const fetchByID = async (ids: string[]): Promise<Post[]> =>
  await Promise.all(ids.map(fetchText));

const fetchAll = async (): Promise<Post[]> => {
  const index = await loadPostPath();
  const ids = Object.keys(index.pathByID);
  const all = await Promise.all(ids.map(fetchText));
  const sorted = sortByDateAndTitle(all);

  index.sortedID = sorted.map((i) => i.id);
  return sorted;
};

const sortByDateAndTitle = (arr: Post[]): Post[] =>
  arr.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      b.title.localeCompare(a.title)
  );

const fetchText = async (id: string): Promise<Post> => {
  const path = (await loadPostPath()).pathByID[id];
  const response = await fetch(path);
  const fileContent = await response.text();
  const { data, content } = matter(fileContent);
  return {
    id: id,
    ...data,
    content,
  } as Post;
};

const loadPostPath = (() => {
  let index: Promise<BlogIndex> | null = null;

  return () => {
    if (index) return index;

    index = (async () => {
      const r = await fetch("/posts-index.json");
      const pathIndex: string[] = await r.json();

      const index: BlogIndex = { pathByID: {} };
      pathIndex.forEach((path) => {
        const match = path.match(/\/([^\/]+)\.md$/);
        if (match) {
          const [, id] = match;
          index.pathByID[id] = path;
        }
      });

      return index;
    })();

    return index;
  };
})();

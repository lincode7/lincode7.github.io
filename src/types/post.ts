interface PostMeta {
  id: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  coverImage?: string;
  readTime?: number;
}

export interface Post extends PostMeta {
  content: string;
}

export interface TagStats {
  name: string;
  count: number;
}

export interface CategoryStats extends TagStats {
  hotTags: string[];
}

export interface MonthlyStats {
  yearMonth: string; // 格式: "2024-01"
  count: number;
}

export interface BlogIndex {
  pathByID: Record<string, string>;

  sortedID?: string[];
  recentID?: string[];
  idByCategory?: Record<string, string[]>;
  idByTag?: Record<string, string[]>;
  idByMonth?: Record<string, string[]>;

  tagByCategory?: Record<string, Set<string>>;
}

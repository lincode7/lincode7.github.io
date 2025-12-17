export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  coverImage?: string;
  readTime?: number;
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
  byID: Record<string, number>;
  byCategory: Record<string, [number[], string[]]>;
  byTag: Record<string, number[]>;
  byMonth: Record<string, number[]>;
  recent: number[];
}

export interface BlogRepo {
  data: Post[];
  index: BlogIndex;
}

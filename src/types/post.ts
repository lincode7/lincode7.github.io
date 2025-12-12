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

export interface CategoryStats {
  name: string;
  count: number;
}

export interface TagStats extends CategoryStats {
  color?: string;
}

export interface MonthlyStats {
  yearMonth: string; // 格式: "2024-01"
  count: number;
}

export interface BlogIndex {
  byID: Record<string, number>;
  byCategory: Record<string, number[]>;
  byTag: Record<string, number[]>;
  byMonth: Record<string, number[]>;
  recent: number[];
}

export interface BlogRepo {
  data: Post[];
  index: BlogIndex;
}

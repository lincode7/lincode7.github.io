export interface PostFrontMatter {
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  coverImage?: string;
  readTime: number;
}

export interface PostMetadata extends PostFrontMatter {
  id: string;
}

export interface Post extends PostMetadata {
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
  byID: Record<string, Post>;
  byCategory: Record<string, string[]>;
  byTag: Record<string, string[]>;
  byMonth: Record<string, string[]>;
}

export interface BlogStats {
  total: number;
  categories: CategoryStats[];
  tags: TagStats[];
  monthly: MonthlyStats[];
  totalViews: number;
  recentTags: string[];
  recentCategories: string[];
}

export interface BlogRepo {
  index: BlogIndex;
  stats: BlogStats;
}

export interface InterestItem {
  id: string;
  type: "game" | "movie" | "music" | "travel";
  title: string;
  description: string;
  date: string;
  tags: string[];
  rating?: number;
  image?: string;
  link?: string;
}

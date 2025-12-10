export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: number;
  views: number;
  coverImage?: string;
}

export interface BlogTag {
  name: string;
  count: number;
  color: string;
}

export interface BlogStats {
  totalPosts: number;
  totalTags: number;
  totalViews: number;
  monthlyPosts: number;
  recentTags: string[];
}

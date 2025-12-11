export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: number;
  category: string;
  coverImage?: string;
}

export interface TagCount {
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

export interface ContactInfo {
  github?: string;
  email: string;
  phone?: string;
  location?: string;
  wechat?: string;
  qq?: string;
}

export interface UserInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  contacts: ContactInfo;
}

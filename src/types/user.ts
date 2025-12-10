export interface UserInfo {
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  company?: string;
  stats: {
    blogCount: number;
    totalVisits: number;
    lastUpdated: string;
  };
  contacts: {
    github: string;
    email: string;
    wechat?: string;
    qq?: string;
    twitter?: string;
    linkedin?: string;
    phone?: string;
  };
}

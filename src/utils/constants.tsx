import avatar from "@assets/avatar.svg";
import { BookOpen, Gamepad2, Github, Home } from "lucide-react";

export const SITE_CONFIG = {
  name: "Xuanlin's Blog",
  description: "记录想法，分享生活，探索技术的无限可能。",
  author: {
    name: "胡煊林",
    avatar: avatar,
    label: ["全栈开发", "数据分析", "旅行达人"],
    location: "云南-昆明",
    contacts: {
      github: "lincode7",
      email: "example@email.com",
      phone: "15587025323",
      qq: "1292017430",
      wechat: "xlin_wt",
    },
  },
};

export const NAVIGATION = [
  { name: "首页", path: "/", icon: <Home size={18} /> },
  { name: "博客", path: "/blog", icon: <BookOpen size={18} /> },
  { name: "兴趣", path: "/interests", icon: <Gamepad2 size={18} /> },
];

export const SOCIAL_LINKS = [
  {
    url: "https://github.com/yourusername",
    icon: <Github />,
  },
];

export const TECH_STACK = [
  "React",
  "Golang",
  "Redis",
  "MQ",
  "PostgreSQL",
  "Docker",
];

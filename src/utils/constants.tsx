import avatar from "@assets/avatar.svg";
import { BookOpen, Gamepad2, Github, Home } from "lucide-react";

export const SITE_CONFIG = {
  name: "Xuanlin's Blog",
  description: "记录想法，分享生活，探索技术的无限可能。",
  author: {
    name: "z",
    avatar: avatar,
    label: "全栈开发者 | 技术爱好者 | 旅行达人",
    location: "上海",
    contacts: {
      github: "yourusername",
      email: "example@email.com",
      phone: "123314",
      qq: "123123",
      wechat: "xxsd",
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

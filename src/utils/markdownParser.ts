import matter from "gray-matter";
import { BlogPost } from "../types/blog";

export const parseMarkdownFile = (content: string): Omit<BlogPost, "id"> => {
  // 在实际应用中，这里会解析markdown文件
  // 目前返回模拟数据
  return {
    title: "示例博客",
    date: new Date().toISOString(),
    tags: ["示例"],
    excerpt: content.slice(0, 150) + "...",
    content,
    readTime: Math.ceil(content.length / 2000),
    views: 0,
  };

  const { data, content: markdownContent } = matter(content);

  // 计算阅读时间 (平均阅读速度 200字/分钟)
  const wordCount = markdownContent.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return {
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    excerpt: data.excerpt || markdownContent.slice(0, 150) + "...",
    content: markdownContent,
    readTime,
    views: 0,
    coverImage: data.coverImage,
  };
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  // 在实际应用中，这里会动态导入所有markdown文件
  const posts = await import("../data/sampleData").then(
    (module) => module.blogPosts
  );
  return posts;
};

export const getPostById = async (
  id: string
): Promise<BlogPost | undefined> => {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.id === id);
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
};

export const getAllTags = async (): Promise<Set<string>> => {
  const posts = await getAllBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return tags;
};

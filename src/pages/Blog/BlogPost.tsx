import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Share2,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetaTags from "../../components/seo/MetaTags";
import type { BlogPost } from "../../types";
import { blogAPI } from "../../utils/api";
import { formatDate } from "../../utils/helper";
import pharse from "../../utils/mardownPhaser";
import { createSuspenseResource } from "../../utils/suspense";

const postResource = createSuspenseResource(async (id) => {
  const text = await blogAPI.getPost(id);
  return await pharse(text);
});

export default function BlogPost() {
  const { id, tag } = useParams<{ id: string; tag: string }>();
  const navigate = useNavigate();
  const [views, setViews] = useState(0);
  const { data, html } = postResource.read(id!);
  const post = data as BlogPost;

  useEffect(() => {
    // 增加阅读次数
    if (post) {
      const storedViews = localStorage.getItem(id!);
      const newViews = storedViews ? parseInt(storedViews) + 1 : 1;
      localStorage.setItem(id!, newViews.toString());
      setViews(newViews);
    }
  }, [post]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("分享取消:", err);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板！");
    }
  };

  if (!id || !post || !html) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground/50">
          文章不存在
        </h2>
        <button
          onClick={() => navigate(`/blog/${tag}`)}
          className="btn-primary flex-center gap-2 mx-auto"
        >
          <ArrowLeft size={18} />
          返回博客列表
        </button>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={post.title}
        description={post.excerpt}
        keywords={post.tags}
        image={post.coverImage}
        type="article"
      />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(`/blog/${tag}`)}
          className="mb-6 flex-left gap-2 text-foreground/50 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          返回博客列表
        </button>

        {/* 文章头部 */}
        <header className="mb-8">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
              loading="lazy"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime} 分钟阅读
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {views} 次阅读
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* 文章内容 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="blog-content"
          />
        </div>

        {/* 文章尾部 */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="分享文章"
              >
                <Share2 size={18} />
                分享
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="收藏文章"
              >
                <Bookmark size={18} />
                收藏
              </button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>最后更新: {formatDate(post.date)}</p>
            </div>
          </div>

          {/* 相关文章推荐 */}
          <div className="mt-8 p-6 bg-accent/5 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">相关文章推荐</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/blog/2"
                className="block p-4 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <h4 className="font-medium mb-2">TypeScript 高级技巧</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  掌握TypeScript的高级类型系统和实用技巧
                </p>
              </a>
              <a
                href="/blog/3"
                className="block p-4 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <h4 className="font-medium mb-2">现代CSS布局实践</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  Flexbox, Grid和容器查询的实际应用
                </p>
              </a>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}

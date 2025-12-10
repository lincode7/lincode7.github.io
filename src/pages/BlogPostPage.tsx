import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Download,
  Eye,
  Home,
  MessageCircle,
  Printer,
  Share2,
  Tag,
  ThumbsUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarkdownRender from "../components/Blog/MarkdownRender";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import SEO from "../components/Common/SEO";
import { BlogPost } from "../types/blog";
import { getPostById } from "../utils/markdownParser";
import "./BlogPostPage.css";

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("文章ID不存在");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedPost = await getPostById(id);

        if (!fetchedPost) {
          setError("文章不存在");
          return;
        }

        setPost(fetchedPost);
        setLikes(fetchedPost.views || 0);
        setViews(fetchedPost.views || 0);

        // 模拟增加浏览量
        setViews((prev) => prev + 1);

        // 检查本地存储的书签状态
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setIsBookmarked(bookmarks.includes(id));

        // 检查点赞状态
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        setIsLiked(likedPosts.includes(id));
      } catch (err) {
        console.error("加载文章失败:", err);
        setError("加载文章失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleBlogHome = () => {
    navigate("/blog");
  };

  const handleTagClick = (tag: string) => {
    navigate(`/blog/tag/${tag}`);
  };

  const toggleBookmark = () => {
    if (!id) return;

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let newBookmarks: string[];

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bookmark: string) => bookmark !== id);
      setIsBookmarked(false);
    } else {
      newBookmarks = [...bookmarks, id];
      setIsBookmarked(true);
    }

    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const handleLike = () => {
    if (!id) return;

    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    let newLikedPosts: string[];
    let newLikes = likes;

    if (isLiked) {
      newLikedPosts = likedPosts.filter((postId: string) => postId !== id);
      setIsLiked(false);
      newLikes = Math.max(0, likes - 1);
    } else {
      newLikedPosts = [...likedPosts, id];
      setIsLiked(true);
      newLikes = likes + 1;
    }

    setLikes(newLikes);
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
  };

  const handleShare = async () => {
    if (!post || !id) return;

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("分享失败:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!post) return;

    const element = document.createElement("a");
    const file = new Blob([post.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${post.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <SEO title="加载中..." description="正在加载文章内容" />
        <LoadingSpinner size="large" fullScreen text="正在加载文章..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <SEO title="文章不存在" description="请求的文章不存在或已被删除" />
        <div className="error-content">
          <h1>文章不存在</h1>
          <p>{error || "请求的文章不存在或已被删除"}</p>
          <div className="error-actions">
            <button className="action-button" onClick={handleBack}>
              <ArrowLeft size={16} />
              返回上一页
            </button>
            <button className="action-button" onClick={handleBlogHome}>
              <BookOpen size={16} />
              博客首页
            </button>
            <button className="action-button" onClick={handleHome}>
              <Home size={16} />
              返回主页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
        image={post.coverImage}
      />

      <div className="blog-post-page">
        {/* 文章头部 */}
        <div className="blog-post-header">
          <div className="navigation-controls">
            <button className="nav-button" onClick={handleBack}>
              <ChevronLeft size={20} />
              返回
            </button>
            <div className="nav-links">
              <button className="nav-link" onClick={handleHome}>
                <Home size={16} />
                首页
              </button>
              <button className="nav-link" onClick={handleBlogHome}>
                <BookOpen size={16} />
                博客
              </button>
            </div>
          </div>

          <div className="post-meta-info">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{post.readTime} 分钟阅读</span>
              </div>
              <div className="meta-item">
                <Eye size={16} />
                <span>{views.toLocaleString()} 次阅读</span>
              </div>
            </div>

            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  className="tag-button"
                  onClick={() => handleTagClick(tag)}
                >
                  <Tag size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 封面图片 */}
        {post.coverImage && (
          <div className="post-cover-image">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        {/* 文章工具栏 */}
        <div className="post-toolbar">
          <div className="toolbar-left">
            <button
              className={`toolbar-button ${isBookmarked ? "active" : ""}`}
              onClick={toggleBookmark}
              aria-label={isBookmarked ? "取消收藏" : "收藏文章"}
            >
              <Bookmark size={20} />
              <span>{isBookmarked ? "已收藏" : "收藏"}</span>
            </button>

            <button
              className={`toolbar-button like-button ${isLiked ? "active" : ""}`}
              onClick={handleLike}
              aria-label={isLiked ? "取消点赞" : "点赞"}
            >
              <ThumbsUp size={20} />
              <span>{likes}</span>
            </button>

            <button
              className="toolbar-button"
              onClick={handleShare}
              aria-label="分享文章"
            >
              <Share2 size={20} />
              <span>分享</span>
            </button>
          </div>

          <div className="toolbar-right">
            <button
              className="toolbar-button"
              onClick={handleCopyLink}
              aria-label="复制链接"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              <span>{copied ? "已复制" : "复制链接"}</span>
            </button>

            <button
              className="toolbar-button"
              onClick={handlePrint}
              aria-label="打印文章"
            >
              <Printer size={20} />
              <span>打印</span>
            </button>

            <button
              className="toolbar-button"
              onClick={handleDownload}
              aria-label="下载Markdown"
            >
              <Download size={20} />
              <span>下载</span>
            </button>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="post-content-container">
          <article className="post-content">
            <MarkdownRender content={post.content} />
          </article>
        </div>

        {/* 文章脚部 */}
        <div className="blog-post-footer">
          <div className="post-footer-actions">
            <div className="action-group">
              <button
                className={`action-button ${isLiked ? "active" : ""}`}
                onClick={handleLike}
              >
                <ThumbsUp size={18} />赞 ({likes})
              </button>

              <button className="action-button">
                <MessageCircle size={18} />
                评论
              </button>

              <button
                className={`action-button ${isBookmarked ? "active" : ""}`}
                onClick={toggleBookmark}
              >
                <Bookmark size={18} />
                {isBookmarked ? "已收藏" : "收藏"}
              </button>
            </div>
          </div>

          <div className="post-footer-tags">
            <h3>文章标签</h3>
            <div className="footer-tags">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  className="footer-tag"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="post-footer-navigation">
            <button className="nav-button prev-button" onClick={handleBack}>
              <ArrowLeft size={16} />
              返回文章列表
            </button>

            <div className="share-buttons">
              <span>分享到:</span>
              <button className="share-button" onClick={handleShare}>
                <Share2 size={16} />
              </button>
              <button className="share-button" onClick={handleCopyLink}>
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 相关文章推荐（简化版） */}
        <div className="related-posts">
          <h2>相关文章</h2>
          <div className="related-posts-placeholder">
            <p>更多相关文章正在建设中...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;

import React from "react";
import { Calendar, Clock, Eye, Tag, ChevronRight } from "lucide-react";
import { BlogPost } from "../../types/blog";
import "./BlogCard.css";

interface BlogCardProps {
  post: BlogPost;
  onClick: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="blog-card" onClick={() => onClick(post.id)}>
      {post.coverImage && (
        <div className="blog-card-image">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}

      <div className="blog-card-content">
        <h3 className="blog-card-title">{post.title}</h3>

        <p className="blog-card-excerpt">{post.excerpt}</p>

        <div className="blog-card-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{formatDate(post.date)}</span>
          </div>

          <div className="meta-item">
            <Clock size={14} />
            <span>{post.readTime} 分钟阅读</span>
          </div>

          <div className="meta-item">
            <Eye size={14} />
            <span>{post.views} 次阅读</span>
          </div>
        </div>

        <div className="blog-card-tags">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              <Tag size={12} />
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="tag-more">+{post.tags.length - 3}</span>
          )}
        </div>

        <div className="blog-card-footer">
          <button className="read-more">
            阅读全文
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

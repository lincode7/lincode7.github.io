import {
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Search,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { BlogPost } from "../../types/blog";
import "./BlogList.css";

interface BlogListProps {
  posts: BlogPost[];
  onPostClick: (id: string) => void;
  initialSort?: "date" | "views" | "title";
  showFilters?: boolean;
  emptyMessage?: string;
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  onPostClick,
  initialSort = "date",
  showFilters = true,
  emptyMessage = "暂无博客文章",
}) => {
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">(initialSort);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 获取所有唯一的标签
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // 过滤和排序文章
  const filteredAndSortedPosts = React.useMemo(() => {
    let result = [...posts];

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "views":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchQuery, selectedTags, sortBy]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy(initialSort);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (posts.length === 0) {
    return (
      <div className="blog-list-empty">
        <Filter size={48} />
        <h3>{emptyMessage}</h3>
        <p>请稍后再来查看</p>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      {showFilters && (
        <div className="blog-list-filters">
          <div className="filter-section">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="搜索博客..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="清除搜索"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sort-options">
              <label className="sort-label">排序方式：</label>
              <div className="sort-buttons">
                <button
                  className={`sort-button ${sortBy === "date" ? "active" : ""}`}
                  onClick={() => setSortBy("date")}
                >
                  <Calendar size={14} />
                  最新
                </button>
                <button
                  className={`sort-button ${sortBy === "views" ? "active" : ""}`}
                  onClick={() => setSortBy("views")}
                >
                  <Eye size={14} />
                  热门
                </button>
                <button
                  className={`sort-button ${sortBy === "title" ? "active" : ""}`}
                  onClick={() => setSortBy("title")}
                >
                  标题
                </button>
              </div>
            </div>
          </div>

          <div className="tag-filter-section">
            <div className="tag-filter-header">
              <span className="tag-filter-label">标签筛选：</span>
              {selectedTags.length > 0 && (
                <button
                  className="clear-tags"
                  onClick={() => setSelectedTags([])}
                >
                  清除选择 ({selectedTags.length})
                </button>
              )}
            </div>
            <div className="tag-filter-list">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-filter ${selectedTags.includes(tag) ? "active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                  {posts.filter((post) => post.tags.includes(tag)).length >
                    1 && (
                    <span className="tag-count">
                      ({posts.filter((post) => post.tags.includes(tag)).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedTags.length > 0) && (
            <div className="active-filters">
              <span className="filter-results">
                找到 {filteredAndSortedPosts.length} 篇文章
              </span>
              <button className="clear-all-filters" onClick={clearFilters}>
                清除所有筛选
              </button>
            </div>
          )}
        </div>
      )}

      {filteredAndSortedPosts.length === 0 ? (
        <div className="blog-list-no-results">
          <Search size={48} />
          <h3>没有找到匹配的博客</h3>
          <p>尝试不同的搜索词或清除筛选条件</p>
          <button className="reset-filters" onClick={clearFilters}>
            重置所有筛选
          </button>
        </div>
      ) : (
        <div className="blog-list">
          {filteredAndSortedPosts.map((post) => (
            <div
              key={post.id}
              className="blog-list-item"
              onClick={() => onPostClick(post.id)}
            >
              {post.coverImage && (
                <div className="blog-list-image">
                  <img src={post.coverImage} alt={post.title} loading="lazy" />
                </div>
              )}

              <div className="blog-list-content">
                <h3 className="blog-list-title">{post.title}</h3>
                <p className="blog-list-excerpt">{post.excerpt}</p>

                <div className="blog-list-meta">
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
                    <span>{post.views.toLocaleString()} 次阅读</span>
                  </div>
                </div>

                <div className="blog-list-tags">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="blog-list-tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="blog-list-arrow">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredAndSortedPosts.length > 0 && (
        <div className="blog-list-footer">
          <div className="list-stats">
            显示 {filteredAndSortedPosts.length} / {posts.length} 篇文章
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
export type { BlogListProps };

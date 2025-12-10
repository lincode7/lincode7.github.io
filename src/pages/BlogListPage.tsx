import { ArrowLeft, Calendar, Eye, Filter, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogCard from "../components/Blog/BlogCard";
import { BlogPost } from "../types/blog";
import { getPostsByTag } from "../utils/markdownParser";
import "./BlogListPage.css";

const BlogListPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "views">("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getPostsByTag(tag || "");
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  useEffect(() => {
    let result = [...posts];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.views - a.views;
      }
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, sortBy]);

  const handleCardClick = (id: string) => {
    navigate(`/blog/post/${id}`);
  };

  const handleBack = () => {
    navigate("/blog");
  };

  if (loading) {
    return (
      <div className="blog-list-page loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="blog-list-page">
      <div className="page-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          返回标签云
        </button>

        <h1 className="page-title">
          标签: <span className="tag-highlight">{tag}</span>
        </h1>

        <p className="page-subtitle">共 {posts.length} 篇博客</p>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="搜索博客..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-options">
          <button
            className={`sort-button ${sortBy === "date" ? "active" : ""}`}
            onClick={() => setSortBy("date")}
          >
            <Calendar size={16} />
            按时间
          </button>
          <button
            className={`sort-button ${sortBy === "views" ? "active" : ""}`}
            onClick={() => setSortBy("views")}
          >
            <Eye size={16} />
            按热度
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="no-results">
          <Filter size={48} />
          <h3>没有找到相关博客</h3>
          <p>尝试其他搜索词或查看其他标签</p>
        </div>
      ) : (
        <div className="blog-list">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={handleCardClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;

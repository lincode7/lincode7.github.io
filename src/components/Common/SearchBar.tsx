import { Command, Filter, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

interface SearchResult {
  id: string;
  title: string;
  type: "blog" | "tag" | "page";
  description?: string;
  url: string;
  relevance: number;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  results?: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  showFilters?: boolean;
  onFilterToggle?: () => void;
  isLoading?: boolean;
  shortcutKey?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "搜索...",
  onSearch,
  onClear,
  results = [],
  onResultSelect,
  showFilters = false,
  onFilterToggle,
  isLoading = false,
  shortcutKey = "k",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 快捷键支持 (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcutKey.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === "Escape") {
        setShowResults(false);
        setSelectedIndex(-1);
      }

      if (showResults && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
        }

        if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          handleResultSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, showResults, results, selectedIndex]);

  // 点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowResults(false);
    onClear?.();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    setQuery("");
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "blog":
        return "📝";
      case "tag":
        return "🏷️";
      case "page":
        return "📄";
      default:
        return "🔍";
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return "#10b981";
    if (relevance >= 0.6) return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <div className={`search-bar ${isFocused ? "focused" : ""}`}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="search-input"
            aria-label="搜索"
          />

          {query && (
            <button
              className="clear-button"
              onClick={handleClear}
              aria-label="清除搜索"
            >
              <X size={16} />
            </button>
          )}

          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          )}
        </div>

        <div className="search-actions">
          {showFilters && onFilterToggle && (
            <button
              className="filter-button"
              onClick={onFilterToggle}
              aria-label="筛选选项"
            >
              <Filter size={18} />
            </button>
          )}

          <div className="shortcut-hint">
            <Command size={12} />
            <span>{shortcutKey.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results" ref={resultsRef}>
          <div className="results-header">
            <span className="results-count">找到 {results.length} 个结果</span>
            <button
              className="close-results"
              onClick={() => setShowResults(false)}
              aria-label="关闭搜索结果"
            >
              <X size={16} />
            </button>
          </div>

          <div className="results-list">
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`result-item ${index === selectedIndex ? "selected" : ""}`}
                onClick={() => handleResultSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="result-icon">{getResultIcon(result.type)}</div>

                <div className="result-content">
                  <div className="result-title">
                    {result.title}
                    <span
                      className="relevance-dot"
                      style={{
                        backgroundColor: getRelevanceColor(result.relevance),
                      }}
                      title={`相关度: ${Math.round(result.relevance * 100)}%`}
                    />
                  </div>

                  {result.description && (
                    <div className="result-description">
                      {result.description}
                    </div>
                  )}
                </div>

                <div className="result-type">
                  {result.type === "blog"
                    ? "博客"
                    : result.type === "tag"
                      ? "标签"
                      : "页面"}
                </div>
              </div>
            ))}
          </div>

          <div className="results-footer">
            <span className="navigation-hint">↑↓ 导航 • ↵ 选择 • ESC 关闭</span>
          </div>
        </div>
      )}

      {showResults && query.trim() && results.length === 0 && !isLoading && (
        <div className="search-results no-results">
          <div className="empty-state">
            <Search size={48} />
            <p className="empty-title">未找到结果</p>
            <p className="empty-description">尝试其他搜索词或检查拼写</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

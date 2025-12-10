import { BookOpen, ChevronRight, Heart, Home } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation: React.FC = () => {
  const location = useLocation();
  const PlaceholderIcon = () => <span>•</span>;

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "首页", icon: <Home size={16} />, path: "/" }];

    if (path.startsWith("/blog")) {
      crumbs.push({
        label: "博客",
        icon: <BookOpen size={16} />,
        path: "/blog",
      });

      if (path.includes("/tag/")) {
        const tag = decodeURIComponent(path.split("/tag/")[1]);
        crumbs.push({
          label: `标签: ${tag}`,
          icon: <PlaceholderIcon />, // 使用占位符
          path,
        });
      } else if (path.includes("/post/")) {
        crumbs.push({
          label: "文章详情",
          icon: <PlaceholderIcon />, // 使用占位符
          path,
        });
      }
    } else if (path.startsWith("/interests")) {
      crumbs.push({
        label: "兴趣",
        icon: <Heart size={16} />,
        path: "/interests",
      });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb-container">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <a
              href={`#${crumb.path}`}
              className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = crumb.path;
              }}
            >
              {crumb.icon && (
                <span className="breadcrumb-icon">{crumb.icon}</span>
              )}
              {crumb.label}
            </a>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={16} className="breadcrumb-separator" />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

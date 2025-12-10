import { Menu, Moon, Sun, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import "./Header.css";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "首页" },
    { path: "/blog", label: "博客" },
    { path: "/interests", label: "兴趣" },
  ];

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <a href="/" className="logo-link">
            <span className="logo-text">MySpace</span>
            <span className="logo-dot">.</span>
          </a>
        </div>

        {/* 桌面导航 */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = item.path;
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="切换菜单"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`}
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = item.path;
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

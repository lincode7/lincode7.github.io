import React from "react";
import {
  Heart,
  Coffee,
  Code,
  Mail,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import "./Footer.css";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={18} />,
      url: "https://github.com",
      color: "#333",
      darkColor: "#f0f0f0",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      url: "https://twitter.com",
      color: "#1DA1F2",
      darkColor: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      url: "https://linkedin.com",
      color: "#0077B5",
      darkColor: "#0077B5",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      url: "mailto:contact@example.com",
      color: "#EA4335",
      darkColor: "#EA4335",
    },
  ];

  const quickLinks = [
    { name: "首页", path: "/" },
    { name: "博客", path: "/blog" },
    { name: "兴趣", path: "/interests" },
    { name: "关于", path: "/about" },
  ];

  const techStack = [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 顶部区域 */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">
              <Code size={24} />
              <span className="brand-text">MySpace</span>
              <span className="brand-dot">.</span>
            </div>
            <p className="brand-tagline">
              记录想法，分享生活，探索技术的无限可能
            </p>
          </div>

          <div className="footer-links">
            <div className="links-section">
              <h4 className="section-title">快速链接</h4>
              <ul className="links-list">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <a
                      href={`#${link.path}`}
                      className="footer-link"
                      onClick={(e) => handleLinkClick(e, link.path)}
                    >
                      {link.name}
                      <ExternalLink size={12} className="link-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="links-section">
              <h4 className="section-title">技术栈</h4>
              <div className="tech-tags">
                {techStack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="links-section">
              <h4 className="section-title">关注我</h4>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    style={
                      {
                        "--social-color": social.color,
                        "--social-color-dark": social.darkColor,
                      } as React.CSSProperties
                    }
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="footer-divider">
          <div className="divider-line"></div>
          <div className="divider-ornament">
            <Code size={16} />
          </div>
          <div className="divider-line"></div>
        </div>

        {/* 底部区域 */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>
              © {currentYear} MySpace. 保留所有权利。
              <span className="made-with">
                用 <Heart size={14} className="heart-icon" /> 和{" "}
                <Coffee size={14} /> 构建
              </span>
            </p>
          </div>

          <div className="footer-meta">
            <div className="meta-links">
              <a href="#privacy" className="meta-link">
                隐私政策
              </a>
              <span className="meta-separator">•</span>
              <a href="#terms" className="meta-link">
                使用条款
              </a>
              <span className="meta-separator">•</span>
              <a href="#sitemap" className="meta-link">
                网站地图
              </a>
            </div>

            <div className="theme-indicator">
              <div className={`theme-dot ${theme}`} />
              <span className="theme-text">
                {theme === "light" ? "浅色模式" : "深色模式"}
              </span>
            </div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="footer-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-code">
            &lt;footer&gt;{/* */}&lt;/footer&gt;
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

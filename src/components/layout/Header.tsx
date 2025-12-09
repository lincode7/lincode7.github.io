// src/components/layout/Header.tsx (更新版)
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { NAVIGATION } from "../../utils/constants";

// 面包屑配置
const breadcrumbConfig: Record<string, { label: string; path: string }[]> = {
  "/": [{ label: "首页", path: "/" }],
  "/blog": [
    { label: "首页", path: "/" },
    { label: "博客", path: "/blog" },
  ],
  "/blog/:tag": [
    { label: "首页", path: "/" },
    { label: "博客", path: "/blog" },
    { label: "文章列表", path: "/blog/:tag" },
  ],
  "/blog/:tag/:id": [
    { label: "首页", path: "/" },
    { label: "博客", path: "/blog" },
    { label: "文章详情", path: "/blog/:tag/:id" },
  ],
  "/interests": [
    { label: "首页", path: "/" },
    { label: "兴趣主页", path: "/interests" },
  ],
};

// 生成面包屑
const generateBreadcrumbs = (pathname: string, params: any) => {
  let breadcrumbs: { label: string; path: string }[] = [];

  // 尝试匹配精确路径
  if (breadcrumbConfig[pathname]) {
    breadcrumbs = [...breadcrumbConfig[pathname]];
  } else {
    // 匹配动态路由
    for (const [pattern, config] of Object.entries(breadcrumbConfig)) {
      if (pattern.includes(":")) {
        const patternParts = pattern.split("/");
        const pathParts = pathname.split("/");

        if (patternParts.length === pathParts.length) {
          let match = true;
          const matchedConfig = [...config];

          for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(":")) {
              const paramName = patternParts[i].slice(1);
              if (params[paramName]) {
                matchedConfig[i] = {
                  ...matchedConfig[i],
                  label: params[paramName] || matchedConfig[i].label,
                };
              }
            } else if (patternParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            breadcrumbs = matchedConfig;
            break;
          }
        }
      }
    }
  }

  // 默认面包屑
  if (breadcrumbs.length === 0) {
    breadcrumbs = [
      { label: "首页", path: "/" },
      {
        label:
          pathname === "/" ? "主页" : decodeURIComponent(pathname.slice(1)),
        path: pathname,
      },
    ];
  }

  return breadcrumbs;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const params = useParams();
  const breadcrumbs = generateBreadcrumbs(location.pathname, params);

  useEffect(() => {
    const currentIndex = NAVIGATION.findIndex(
      (item) => location.pathname == item.path
    );

    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg">
        <div className="container mx-auto h-16 flex-between">
          {/* Logo */}
          <Link to="/" className="flex-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex-center  animate-pulse-slow">
              <span className="text-white font-bold ">Hu</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">
              Xuanlin's Blog
            </span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex flex-center gap-3 relative">
            <div
              className="absolute inset-0 z-10  bg-accent rounded-lg transition-all duration-300"
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
                width: `calc(100% / ${NAVIGATION.length})`,
              }}
            />
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="z-10 flex-center gap-2 px-3 py-2 rounded-lg transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="切换菜单"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* 面包屑导航 (独立区域) */}
      <div className="border-b bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto py-3">
          <nav className="flex-left text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex-center animate-slide-right">
                {index > 0 && (
                  <ChevronRight className="mx-2 text-gray-400" size={14} />
                )}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? "text-gray-900 dark:text-gray-100 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary"
                    } transition-colors`}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex-col gap-2">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent/10"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="切换主题"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}

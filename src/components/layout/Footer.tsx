import { Code, Coffee, Heart } from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS, TECH_STACK } from "../../utils/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 relative before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-linear-90 before:from-transparent before:via-primary before:to-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div>
            <div className="flex-left gap-2 mb-4">
              <Code size={24} className="animate-float text-primary" />
              <span className="text-xl font-bold">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* 技术栈 */}
          <div>
            <h3>技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span key={tech} className="tag text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 联系信息 */}
          <div>
            <h3>关注我</h3>
            <div className="flex-left flex-wrap gap-4">
              {SOCIAL_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-border rounded-full w-8 h-8 p-2 flex-center hover:text-primary"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 其他链接 */}
          <div>
            <h3>快捷链接</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/sponsors"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                支持项目
              </a>
              <a
                href="/rss.xml"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                RSS订阅
              </a>
              <a
                href="/sitemap.xml"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                网站地图
              </a>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="flex-center">
          <div className="flex-1 h-px w-full bg-linear-90 from-border via-primary to-border" />
          <div className="flex-center w-10 h-10 bg-border rounded-full text-primary animate-spin-slow">
            <Code size={16} />
          </div>
          <div className="flex-1 h-px w-full bg-linear-90 from-border via-primary to-border" />
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-8">
          <p className="flex-center gap-1 text-sm">
            © {currentYear} {SITE_CONFIG.name}
            <Heart size={14} className="text-red-500" />
            &
            <Coffee size={14} className="text-[#b36d1e]" />
            Made with Vite + React + TypeScript + Tailwindcss
          </p>
        </div>
      </div>
    </footer>
  );
}

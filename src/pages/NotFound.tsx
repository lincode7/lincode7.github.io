import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import MetaTags from "../components/seo/MetaTags";

export default function NotFound() {
  return (
    <>
      <MetaTags
        title="页面未找到 - 404"
        description="抱歉，您访问的页面不存在或已被移除"
      />

      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-primary opacity-20 mb-4">
            404
          </div>
          <h1 className="text-4xl font-bold mb-4">页面未找到</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面可能已被移除、重命名或暂时不可用
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md mx-auto space-y-4"
        >
          <div className="p-6 bg-accent/5 rounded-xl mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Search className="text-primary" />
              <h3 className="font-semibold">您可以尝试以下操作</h3>
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• 检查网址拼写是否正确</li>
              <li>• 使用搜索功能查找内容</li>
              <li>• 返回上一页继续浏览</li>
              <li>• 或者直接返回首页</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              <Home size={18} />
              返回首页
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center gap-2 px-6 py-3"
            >
              <ArrowLeft size={18} />
              返回上一页
            </button>
          </div>

          <div className="pt-8 border-t mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              如果问题持续存在，请通过
              <a
                href="mailto:example@email.com"
                className="text-primary hover:underline ml-1"
              >
                联系我
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

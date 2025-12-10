import { Suspense, lazy, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;

// 代码分割和懒加载
const Home = lazy(() => import("./pages/Home"));
const BlogHome = lazy(() => import("./pages/Blog"));
const BlogList = lazy(() => import("./pages/Blog/BlogList"));
const BlogPost = lazy(() => import("./pages/Blog/BlogPost"));
const Interests = lazy(() => import("./pages/Interests"));
const NotFound = lazy(() => import("./pages/NotFound"));

// 滚动到顶部组件
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 初始化PWA
function initializePWA() {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("ServiceWorker 注册成功:", registration.scope);
        })
        .catch((error) => {
          console.log("ServiceWorker 注册失败:", error);
        });
    });
  }
}

// 初始化应用
function AppInitializer() {
  useEffect(() => {
    // 初始化PWA
    initializePWA();

    // 添加回到顶部按钮逻辑
    const backToTopButton = document.getElementById("back-to-top");

    const handleScroll = () => {
      if (!backToTopButton) return;

      if (window.scrollY > 300) {
        backToTopButton.style.opacity = "1";
        backToTopButton.style.visibility = "visible";
      } else {
        backToTopButton.style.opacity = "0";
        backToTopButton.style.visibility = "hidden";
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 清理函数
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppInitializer />
          <ScrollToTop />
          <Layout>
            <ErrorBoundary
              fallback={
                <div className="flex-center">
                  <p>⚠️Something went wrong</p>
                </div>
              }
            >
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<BlogHome />} />
                  <Route path="/blog/:tag" element={<BlogList />} />
                  <Route path="/blog/:tag/:id" element={<BlogPost />} />
                  <Route path="/interests" element={<Interests />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

import { Buffer } from "buffer";
import { Suspense, lazy, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { ThemeProvider } from "./contexts/ThemeContext";
// @ts-ignore
window.Buffer = Buffer;

// 代码分割和懒加载
const Home = lazy(() => import("./pages/Home"));
const BlogHome = lazy(() => import("./pages/Blog"));
const BlogList = lazy(() => import("./pages/Blog/BlogList"));
const BlogPost = lazy(() => import("./pages/Blog/BlogPost"));
const Interests = lazy(() => import("./pages/Interests"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  }, []);

  return null;
}

// 错误信息
function ErrorMessage() {
  return (
    <div className="page h-screen flex-center">
      <p className="text-4xl">⚠️Something went wrong</p>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppInitializer />
          <Header />
          <ErrorBoundary fallback={<ErrorMessage />}>
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
          <Footer />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

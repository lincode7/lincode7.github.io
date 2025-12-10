import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="layout">
      <Header />
      <Navigation />

      <main className="main-content">
        <div className="content-container">{children}</div>
      </main>

      <Footer />

      {/* 滚动到顶部按钮 */}
      <button
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="滚动到顶部"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default Layout;

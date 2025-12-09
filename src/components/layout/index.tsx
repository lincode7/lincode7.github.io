import type { ReactNode } from "react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* 回到顶部按钮 */}
      <button
        id="back-to-top"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all opacity-0 invisible hover:scale-110"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="回到顶部"
      >
        ↑
      </button>
    </div>
  );
}

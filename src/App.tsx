import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import BlogHomePage from "./pages/BlogHomePage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import HomePage from "./pages/HomePage";
import InterestsPage from "./pages/InterestsPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogHomePage />} />
          <Route path="/blog/tag/:tag" element={<BlogListPage />} />
          <Route path="/blog/post/:id" element={<BlogPostPage />} />
          <Route path="/interests" element={<InterestsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

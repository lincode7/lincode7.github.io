import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagCloud } from "../components/Blog/TagCloud";
import { blogTags } from "../data/sampleData";
import "./BlogHomePage.css";

const BlogHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    // 创建标签云节点数据
    const tagNodes = blogTags.map((tag) => ({
      id: tag.name,
      radius: 20 + tag.count * 5,
      count: tag.count,
      color: tag.color,
    }));

    // 使用d3-force计算标签云布局
    const simulation = forceSimulation(tagNodes)
      .force("charge", forceManyBody().strength(-30))
      .force("center", forceCenter(400, 300))
      .force(
        "collision",
        forceCollide().radius((d) => (d as any).radius)
      )
      .on("tick", () => {
        setNodes([...tagNodes]);
      });

    return () => simulation.stop();
  }, []);

  const handleTagClick = (tagName: string) => {
    navigate(`/blog/tag/${tagName}`);
  };

  return (
    <div className="blog-home-page">
      <h1>博客标签云</h1>
      <p className="subtitle">点击标签查看相关博客</p>

      <div className="tag-cloud-container">
        <TagCloud nodes={nodes} onTagClick={handleTagClick} />
      </div>
    </div>
  );
};

export default BlogHomePage;

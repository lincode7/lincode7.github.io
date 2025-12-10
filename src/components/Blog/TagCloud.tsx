import * as d3 from "d3";
import { Tag } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./TagCloud.css";

interface TagNode {
  id: string;
  radius: number;
  count: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface TagCloudProps {
  nodes: TagNode[];
  onTagClick: (tagName: string) => void;
  width?: number;
  height?: number;
  showLegend?: boolean;
  animationSpeed?: number;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  nodes,
  onTagClick,
  width = 800,
  height = 500,
  showLegend = true,
  animationSpeed = 300,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<TagNode, undefined> | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // 响应式调整尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: Math.min(containerWidth, 1200),
          height: Math.min(containerWidth * 0.625, 600),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 创建力导向图
  const createSimulation = useCallback(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // 清除之前的SVG内容
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
      .attr("style", "max-width: 100%; height: auto;");

    // 添加背景渐变
    const defs = svg.append("defs");
    const gradient = defs
      .append("radialGradient")
      .attr("id", "tag-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "var(--bg-color)")
      .attr("stop-opacity", 0.1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "var(--bg-color)")
      .attr("stop-opacity", 0);

    // 添加背景圆
    svg
      .append("circle")
      .attr("cx", dimensions.width / 2)
      .attr("cy", dimensions.height / 2)
      .attr("r", Math.min(dimensions.width, dimensions.height) * 0.4)
      .attr("fill", "url(#tag-gradient)");

    // 创建力导向图模拟
    const simulation = d3
      .forceSimulation<TagNode>(nodes as any)
      .force("charge", d3.forceManyBody().strength(-30))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force(
        "collision",
        d3.forceCollide<TagNode>().radius((d) => (d as any).radius + 2)
      )
      .force("x", d3.forceX(dimensions.width / 2).strength(0.05))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.05))
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    // 创建标签组
    const tags = svg
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "tag-node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onTagClick(d.id);
      })
      .on("mouseenter", function (event, d) {
        setHoveredTag(d.id);
        d3.select(this)
          .transition()
          .duration(animationSpeed)
          .attr("transform", `translate(${d.x},${d.y}) scale(1.15)`);
      })
      .on("mouseleave", function (event, d) {
        setHoveredTag(null);
        d3.select(this)
          .transition()
          .duration(animationSpeed)
          .attr("transform", `translate(${d.x},${d.y}) scale(1)`);
      });

    // 添加圆形背景
    tags
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.85)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")
      .transition()
      .duration(animationSpeed)
      .attr("opacity", 0.85);

    // 添加标签图标
    tags
      .append("circle")
      .attr("r", (d) => d.radius * 0.3)
      .attr("fill", "#fff")
      .attr("opacity", 0.2);

    // 添加标签文本
    tags
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("fill", "#fff")
      .style("font-size", (d) => `${Math.max(12, d.radius / 3)}px`)
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("text-shadow", "0 1px 2px rgba(0, 0, 0, 0.3)")
      .text((d) => d.id);

    // 添加数量文本
    tags
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .style("fill", "#fff")
      .style("font-size", (d) => `${Math.max(10, d.radius / 4)}px`)
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("opacity", 0.9)
      .text((d) => `${d.count}篇`);

    // 更新节点位置
    simulation.on("tick", () => {
      tags.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // 添加交互效果
    tags
      .on("mouseover", function () {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(animationSpeed)
          .attr("r", (d: any) => d.radius * 1.1)
          .attr("opacity", 1)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(animationSpeed)
          .attr("r", (d: any) => d.radius)
          .attr("opacity", 0.85)
          .attr("stroke-width", 2);
      });

    return () => {
      simulation.stop();
    };
  }, [nodes, onTagClick, dimensions, animationSpeed]);

  useEffect(() => {
    const cleanup = createSimulation();
    return cleanup;
  }, [createSimulation]);

  // 处理点击外部重置
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // 点击容器背景可以触发其他行为
      console.log("TagCloud container clicked");
    }
  };

  // 计算标签统计
  const totalTags = nodes.length;
  const totalPosts = nodes.reduce((sum, node) => sum + node.count, 0);
  const averagePosts = Math.round(totalPosts / totalTags);

  return (
    <div
      className="tag-cloud-container"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="tag-cloud-wrapper">
        <div className="tag-cloud" style={{ height: dimensions.height }}>
          <svg ref={svgRef} className="tag-cloud-svg"></svg>
        </div>

        {showLegend && (
          <div className="tag-cloud-legend">
            <div className="legend-header">
              <Tag size={20} />
              <h3>标签统计</h3>
            </div>

            <div className="legend-stats">
              <div className="stat-item">
                <span className="stat-label">标签总数</span>
                <span className="stat-value">{totalTags}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">文章总数</span>
                <span className="stat-value">{totalPosts}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">平均文章数</span>
                <span className="stat-value">{averagePosts}</span>
              </div>
            </div>

            {hoveredTag && (
              <div className="hover-info">
                <div className="hover-info-header">
                  <span className="hover-tag">{hoveredTag}</span>
                </div>
                <div className="hover-info-content">点击查看相关文章</div>
              </div>
            )}

            <div className="legend-hint">
              <span className="hint-text">
                提示：点击标签查看相关文章，标签大小表示文章数量
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

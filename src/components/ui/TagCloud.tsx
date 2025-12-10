import * as d3 from "d3";
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from "d3-force";
import { BarChart3, Filter, Grid3x3, Tag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../utils/helper";
import { Card } from "./Card";
import StatCard from "./StatsCard";

interface TagNode {
  id: string;
  radius: number;
  count: number;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface TagCloudProps {
  nodes: TagNode[];
  onTagClick: (tagName: string) => void;
  showLegend?: boolean;
  animationSpeed?: number;
}

export default function TagCloud({
  nodes,
  onTagClick,
  showLegend = true,
  animationSpeed = 300,
}: TagCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<TagNode, undefined> | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [tagNodes, setTagNodes] = useState<TagNode[]>([]);

  // 初始化节点数据，确保所有节点都有位置
  useEffect(() => {
    if (nodes.length > 0) {
      const initializedNodes = nodes.map((node, i) => ({
        ...node,
        x: dimensions.width / 2 + (Math.random() - 0.5) * 100,
        y: dimensions.height / 2 + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0,
        color: node.color || getRandomColor(i), // 确保有颜色
      }));
      setTagNodes(initializedNodes);
    }
  }, [nodes, dimensions]);

  // 生成随机颜色
  const getRandomColor = (index: number) => {
    const colors = [
      "#3B82F6", // blue-500
      "#10B981", // emerald-500
      "#8B5CF6", // violet-500
      "#EF4444", // red-500
      "#F59E0B", // amber-500
      "#06B6D4", // cyan-500
      "#EC4899", // pink-500
      "#14B8A6", // teal-500
      "#F97316", // orange-500
      "#6366F1", // indigo-500
    ];
    return colors[index % colors.length];
  };

  // 响应式调整尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: Math.min(containerWidth * 0.8, 600),
        });
      }
    };

    debounce(setTimeout, 100);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // 创建力导向图
  const createSimulation = useCallback(() => {
    if (!svgRef.current || tagNodes.length === 0) return;

    // 停止之前的模拟
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    // 清除之前的SVG内容
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height].join(" "))
      .style("width", "100%")
      .style("height", "100%");

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

    // 创建标签组
    const tags = svg
      .selectAll("g")
      .data(tagNodes)
      .enter()
      .append("g")
      .attr("class", "tag-node")
      .style("cursor", "pointer")
      .on("click", (event) => {
        event.stopPropagation();
      })
      .on("mouseenter", function (this: any, _event, d) {
        d3.select(this)
          .transition()
          .duration(animationSpeed)
          .attr("transform", `translate(${d.x},${d.y}) scale(1.15)`);
      })
      .on("mouseleave", function (this: any, _event, d) {
        d3.select(this)
          .transition()
          .duration(animationSpeed)
          .attr("transform", `translate(${d.x},${d.y}) scale(1)`);
      });

    // 添加圆形背景
    tags
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color!)
      .attr("opacity", 0.85)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")
      .transition()
      .duration(animationSpeed)
      .attr("opacity", 0.85);

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

    // 创建力导向图模拟
    const simulation = forceSimulation<TagNode>(tagNodes)
      .force("charge", forceManyBody().strength(-20))
      .force("center", forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force(
        "collision",
        forceCollide<TagNode>().radius((d) => (d as any).radius + 2)
      )
      .force("x", forceX(dimensions.width / 2).strength(0.05))
      .force("y", forceY(dimensions.height / 2).strength(0.05))
      .alphaDecay(0.02)
      .alpha(0.3)
      .restart();

    simulationRef.current = simulation;

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

    // 添加点击动画
    tags.on("click", function (this: any, _event, d) {
      onTagClick(d.id);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [tagNodes, onTagClick, dimensions, animationSpeed]);

  useEffect(() => {
    if (tagNodes.length > 0) {
      const cleanup = createSimulation();
      return cleanup;
    }
  }, [createSimulation, tagNodes]);

  // 计算标签统计
  const totalTags = nodes.length;
  const totalPosts = nodes.reduce((sum, node) => sum + node.count, 0);
  const averagePosts = Math.round(totalPosts / totalTags);

  return (
    <Card className="p-4 mb-12 flex-left gap-8" ref={containerRef}>
      {/* 标签云主体 */}
      <div className={`rounded-xl overflow-hidden border`}>
        <svg className="w-full h-full" ref={svgRef}></svg>
      </div>

      {/* 图例 */}
      {showLegend && (
        <div className="flex-col gap-6">
          <div className="flex-left gap-3 pb-4 border-b">
            <Tag size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="m-0">标签统计</h3>
          </div>

          <div className="flex-col gap-6">
            <StatCard
              className="p-4"
              icon={BarChart3}
              title="标签总数"
              value={totalTags}
              description="分类维度"
            />
            <StatCard
              className="p-4"
              icon={Filter}
              title="文章总数"
              value={totalPosts}
              description="累计创作"
            />
            <StatCard
              className="p-4"
              icon={Grid3x3}
              title="平均文章数"
              value={averagePosts}
              description="标签平均文章"
            />
          </div>

          {/* 悬停信息
          {hoveredTag && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-slideIn">
              <div className="flex-left gap-2 mb-2">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  {hoveredTag}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                点击查看相关文章
              </div>
            </div>
          )} */}

          {/* 提示信息 */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed block">
              提示：点击标签查看相关文章，标签大小表示文章数量
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

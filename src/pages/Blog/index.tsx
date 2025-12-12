// src/pages/TagCloudPage.tsx (新的独立标签云页)
import { useNavigate } from "react-router-dom";
import MetaTags from "../../components/seo/MetaTags";
import { Card } from "../../components/ui/Card";
import TagCloud from "../../components/ui/TagCloud";
import { blogAPI } from "../../utils/api/posts";
import { createSuspenseResource } from "../../utils/suspense";

const tagsResource = createSuspenseResource(blogAPI.getTags);

export default function TagCloudPage() {
  const navigate = useNavigate();
  const tags = tagsResource.read();
  const filteredTags = tags;
  const nodes = tags.map((tag) => ({
    id: tag.name,
    radius: 20 + Math.sqrt(tag.count) * 8,
    count: tag.count,
    color: tag.color,
  }));

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    navigate(`/blog/${tagName}`);
  };

  return (
    <>
      <MetaTags title="Blog" description="博客主页" />

      <div className="container animate-slide-up">
        {/* 主标签云区域 */}
        <TagCloud nodes={nodes} onTagClick={handleTagClick} />

        {/* 标签列表 (备用视图) */}
        <Card hover={false}>
          <div className="flex justify-between items-center mb-6">
            <h2>全部标签 ({tags.length})</h2>
            <div className="text-sm text-foreground/60">
              按 <span className="font-semibold">文章数量</span> 排序
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => (
              <button key={tag.name} onClick={() => handleTagClick(tag.name)}>
                <div className="px-5 py-2.5 rounded-full shadow-md border border-foreground/10 hover-shadow">
                  <span className="font-medium ">#{tag.name}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {tag.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

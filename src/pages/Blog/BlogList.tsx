import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import MetaTags from "../../components/seo/MetaTags";
import type { BlogPost } from "../../types";
import { blogAPI } from "../../utils/api";
import { formatDate } from "../../utils/helper";
import { createSuspenseResource } from "../../utils/suspense";

interface BlogListProps {
  tag: string;
  posts: BlogPost[];
}

function BlogList({ tag, posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 animate-slide-up">
        <p className="text-gray-500 dark:text-gray-400">暂无文章，请稍后再来</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="card hover-shadow p-6 animate-slide-up"
        >
          <div className="flex flex-col gap-6">
            {/* 头图 */}
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-48 object-cover rounded-lg"
                loading="lazy"
              />
            )}
            {/* 日期、字数、分类 */}
            <div className="flex-left gap-4 text-sm text-foreground/50 mb-3">
              <span className="flex-left gap-1">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex-left gap-1">
                <Clock size={14} />
                {post.readTime} 分钟阅读
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                {post.category}
              </span>
            </div>
            {/* 标题 */}
            <Link to={`/blog/${tag}/${post.id}`}>
              <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            {/* 摘要 */}
            <p className="mb-4">{post.excerpt}</p>
            {/* 标签 */}
            <div className="flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-gray-400" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* 阅读全文 */}
            <Link
              to={`/blog/${tag}/${post.id}`}
              className="inline-block mt-4 text-primary hover:text-primary-hover font-medium"
            >
              阅读全文 →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

const postsResource = createSuspenseResource(blogAPI.getPosts);
const tagsResource = createSuspenseResource(blogAPI.getTags);

export default function BlogListPage() {
  const { tag: tagParam } = useParams<{ tag: string }>();
  const posts = postsResource.read(1, 50, tagParam).posts;
  const tags = tagsResource.read();
  const tagStats = tags.find((tag) => tag.name === tagParam);
  const relatedTags = tags
    .filter((tag) => tag.name !== tagParam)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 当前标签的详细信息
  const currentTagInfo = useMemo(() => {
    return relatedTags.find((tag) => tag.name === tagParam);
  }, [tagStats, relatedTags]);

  return (
    <>
      <MetaTags
        title={tagParam ? `#${tagParam} - 文章列表` : "文章列表"}
        description={`浏览${tagParam}标签下的技术文章和心得分享`}
      />

      <div className="container mx-auto px-4 py-8 animate-slide-up">
        {/* 返回按钮和标题 */}
        <div className="mb-8 border-b pb-4">
          <Link
            to="/blog"
            className="flex-left gap-2 text-foreground/50 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            返回标签云
          </Link>

          <div className="flex-left gap-4">
            <h1 className="text-3xl font-bold">
              {tagParam ? `# ${tagParam}` : "所有文章"}
            </h1>
            {tagParam && currentTagInfo && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                共有 {currentTagInfo.count} 篇相关文章
              </p>
            )}
          </div>
        </div>

        {/* 文章列表 */}
        <div className="mt-8">
          {posts.length > 0 ? (
            <BlogList tag={tagParam!} posts={posts} />
          ) : (
            <p className="flex-center py-12 mb-4 text-xl text-foreground/50">
              暂无相关文章
            </p>
          )}
        </div>
      </div>
    </>
  );
}

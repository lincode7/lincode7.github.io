import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = "个人主页",
  description = "一个展示个人博客和兴趣爱好的网站",
  keywords = ["博客", "个人网站", "技术分享", "兴趣爱好"],
  author = "张三",
  url = window.location.href,
  image = "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
}) => {
  const siteTitle = title === "个人主页" ? title : `${title} | 个人主页`;
  const fullDescription =
    description.length > 160 ? `${description.slice(0, 157)}...` : description;

  return (
    <Helmet>
      {/* 基础元标签 */}
      <title>{siteTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Open Graph 标签 */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="个人主页" />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "BlogPosting" : "WebSite",
          headline: title,
          description: fullDescription,
          author: {
            "@type": "Person",
            name: author,
          },
          publisher: {
            "@type": "Person",
            name: author,
          },
          url: url,
          image: image,
          ...(type === "article" && {
            datePublished: publishedTime,
            dateModified: modifiedTime || publishedTime,
            keywords: tags.join(", "),
          }),
        })}
      </script>

      {/* 额外的链接标签 */}
      <link rel="canonical" href={url} />

      {/* 字体预加载 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};

export default SEO;

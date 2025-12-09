import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "../../utils/constants";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export default function MetaTags({
  title,
  description,
  keywords = ["Home", "Blogs", "Technical", "Interests"],
  image = "https://via.placeholder.com/1200x630",
  url = window.location.href,
  type = "website",
}: MetaTagsProps) {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return (
    <Helmet>
      {/* 基础标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_CONFIG.name,
          description: description,
          url: window.location.origin,
          potentialAction: {
            "@type": "SearchAction",
            target: `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
}

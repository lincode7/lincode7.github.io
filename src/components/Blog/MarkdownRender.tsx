import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./MarkdownRender.css";

interface MarkdownRenderProps {
  content: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
  const [copyText, setCopyText] = useState<string>("复制");
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    // 提取标题生成目录
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const extractedHeadings = Array.from(headingElements).map(
      (heading, index) => {
        const id =
          heading.textContent?.toLowerCase().replace(/\s+/g, "-") ||
          `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName[1]),
        };
      }
    );

    setHeadings(extractedHeadings);
  }, [content]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyText("已复制!");
      setTimeout(() => setCopyText("复制"), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="markdown-renderer">
      {headings.length > 0 && (
        <div className="toc-sidebar">
          <h4>目录</h4>
          <ul className="toc-list">
            {headings.map((heading, index) => (
              <li key={index} className={`toc-item level-${heading.level}`}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="markdown-h1" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="markdown-h2" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="markdown-h3" {...props} />
            ),
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const code = String(children).replace(/\n$/, "");

              return !node?.properties.inline && match ? (
                <div className="code-block">
                  <div className="code-header">
                    <span className="language-label">{match[1]}</span>
                    <button
                      className="copy-button"
                      onClick={() => handleCopyCode(code)}
                    >
                      {copyText}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table: ({ node, ...props }) => (
              <div className="table-wrapper">
                <table className="markdown-table" {...props} />
              </div>
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="markdown-blockquote" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="markdown-link" {...props} />
            ),
            img: ({ node, ...props }) => (
              <img className="markdown-image" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRender;

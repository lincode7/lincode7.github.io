import hljs from "highlight.js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";

export default async function pharse(markdown: string) {
  const html = await marked
    .use({
      async: true,
      gfm: true,
      breaks: true,
    })
    .use(
      markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "shell";
          return hljs.highlight(code, { language }).value;
        },
      })
    )
    .parse(markdown);

  return html;
}

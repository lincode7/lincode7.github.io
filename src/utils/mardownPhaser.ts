import hljs from "highlight.js";
import { marked } from "marked";
import extendedTables from "marked-extended-tables";
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";

const myMarked = marked
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
  .use(markedKatex({ nonStandard: true }))
  .use(extendedTables());

export default async function pharse(markdown: string) {
  return await myMarked.parse(markdown);
}

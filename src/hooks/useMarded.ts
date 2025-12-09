import { marked } from "marked";
import { createSuspenseResource, type useAsyncOptions } from "./useAsync";

export function useMarked(markdown: string, options?: useAsyncOptions<string>) {
  return createSuspenseResource(
    marked.parse(markdown, { async: true }),
    options
  ).read();
}

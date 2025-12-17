// src/i18n/config.ts
export const i18nConfig = {
  supportedLngs: ["zh-CN", "en-US"],
  fallbackLng: "zh-CN",
  defaultNS: "common",
  ns: ["common", "home", "user"], // 命名空间
  interpolation: {
    escapeValue: false, // React 已经处理 XSS
  },
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng",
    htmlTag: document.documentElement,
  },
  backend: {
    // 注意：纯前端不需要 HTTP 加载，使用 import
  },
  react: {
    useSuspense: false, // 避免 Suspense 问题
  },
};

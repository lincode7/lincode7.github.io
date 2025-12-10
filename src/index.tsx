import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// 如果你希望你的应用可以离线工作并加载更快，可以更改下面的 unregister() 为 register()
// 但请注意，这有一些陷阱。了解更多关于 service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: () => console.log("Service Worker 注册成功"),
  onUpdate: (registration) => {
    console.log("新版本可用，正在更新...");
    if (registration.waiting) {
      // 显示更新通知
      if (window.confirm("新版本可用，是否立即更新？")) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  },
});

// 如果你想开始测量应用的性能，传递一个函数来记录结果
// (例如：reportWebVitals(console.log))
// 或发送到分析端点。了解更多：https://bit.ly/CRA-vitals
reportWebVitals(console.log);

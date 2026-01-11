const CACHE_NAME = "personal-site-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

// 安装 Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("缓存已打开");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 拦截请求
self.addEventListener("fetch", (event) => {
  // 忽略非 GET 请求
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中
      if (response) {
        return response;
      }

      // 否则进行网络请求
      return fetch(event.request)
        .then((response) => {
          // 检查响应是否有效
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // 克隆响应
          const responseToCache = response.clone();

          // 将响应添加到缓存
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // 网络请求失败，返回离线页面
          return caches.match("/offline.html");
        });
    })
  );
});

// 后台同步
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-articles") {
    event.waitUntil(syncArticles());
  }
});

async function syncArticles() {
  // 这里可以实现后台同步功能
  console.log("后台同步开始");
}

// 推送通知
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "个人主页";
  const options = {
    body: data.body || "有新内容更新",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "general",
    data: data.url || "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // 如果已经有窗口打开，聚焦它
      for (const client of windowClients) {
        if (client.url === event.notification.data && "focus" in client) {
          return client.focus();
        }
      }

      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

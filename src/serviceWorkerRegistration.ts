// 这个可选的文件用于自定义 service worker 的注册逻辑
// 你可以在这里添加额外的功能，如推送通知等

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 在 localhost 上检查 service worker 是否仍然可用
        checkValidServiceWorker(swUrl, config);

        // 添加一些额外的日志到 localhost
        navigator.serviceWorker.ready.then(() => {
          console.log("这个网页是通过 service worker 缓存的。");
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // 此时有新内容可用
              console.log("新内容可用；请刷新。");

              // 执行回调
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 内容已缓存供离线使用
              console.log("内容已缓存供离线使用。");

              // 执行回调
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Service worker 注册期间出错：", error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // 检查 service worker 是否可以找到。如果不能，重新加载页面。
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // 确保 service worker 存在，并且我们真的得到了一个 JS 文件。
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // 没有找到 service worker。可能是一个不同的应用。重新加载页面。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // service worker 找到。继续正常注册。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("没有互联网连接。应用在离线模式下运行。");
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// 性能监控工具

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  // 初始化性能监控
  init() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      this.setupPerformanceObservers();
      this.collectCoreWebVitals();
    }
  }

  // 设置性能观察者
  private setupPerformanceObservers() {
    // 监控长任务
    if ("PerformanceObserver" in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.addMetric({
              name: "long-task",
              value: entry.duration,
              unit: "ms",
              timestamp: Date.now(),
            });
          }
        });
        longTaskObserver.observe({ entryTypes: ["longtask"] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn("长任务监控不可用:", e);
      }
    }
  }

  // 收集核心Web指标
  private collectCoreWebVitals() {
    // LCP (最大内容绘制)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.addMetric({
            name: "LCP",
            value: lastEntry.startTime,
            unit: "ms",
            timestamp: Date.now(),
          });
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn("LCP监控不可用:", e);
      }
    }

    // CLS (累积布局偏移)
    if ("PerformanceObserver" in window) {
      try {
        let clsValue = 0;
        let clsEntries: any[] = [];

        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsEntries.push(entry);
              clsValue += entry.value;
            }
          }
        });

        clsObserver.observe({ type: "layout-shift", buffered: true });
        this.observers.push(clsObserver);

        // 页面可见性变化时记录CLS
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            this.addMetric({
              name: "CLS",
              value: clsValue,
              unit: "分数",
              timestamp: Date.now(),
            });
            clsValue = 0;
            clsEntries = [];
          }
        });
      } catch (e) {
        console.warn("CLS监控不可用:", e);
      }
    }
  }

  // 添加性能指标
  addMetric(metric: Omit<PerformanceMetric, "timestamp">) {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    });

    // 开发环境下输出到控制台
    if (import.meta.env.DEV) {
      console.log(
        `📊 性能指标 - ${metric.name}: ${metric.value}${metric.unit}`
      );
    }
  }

  // 获取性能报告
  getReport(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // 清理
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// 页面加载时间监控
export const measurePageLoad = () => {
  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;

      console.log(`页面加载时间: ${loadTime}ms`);
    });
  }
};

// 资源加载监控
export const measureResourceLoading = () => {
  if ("PerformanceObserver" in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (
          entry.initiatorType === "script" ||
          entry.initiatorType === "link"
        ) {
          console.log(`${entry.initiatorType} 加载时间:`, {
            name: entry.name,
            duration: entry.duration.toFixed(2) + "ms",
            size: entry.transferSize,
          });
        }
      });
    });
    resourceObserver.observe({ entryTypes: ["resource"] });
  }
};

// 创建单例实例
export const performanceMonitor = new PerformanceMonitor();

// 在应用启动时初始化
export const initPerformanceMonitoring = () => {
  performanceMonitor.init();
  measurePageLoad();
  measureResourceLoading();
};

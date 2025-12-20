---
title: "React 滚动加载实践"
date: "2025-12-16"
tags: ["React", "react-intersection-observer"]
category: "技术"
excerpt: "什么是IntersectionObserver？如何实现滚动加载？在什么场景下需要滚动加载？"
coverImage: "https://tse2-mm.cn.bing.net/th/id/OIP-C.Uxnhkrsdbo7w5FgefEhxlwHaEn?w=230&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"
readTime: 5
---

## `react-intersection-observer` 包用法

> env: one vite-react project with `tailwindcss` and `vite-tailwindcss` plugin

1. `useInView` hook

   > When you want to monitor a target and have other targets respond to it

   ```typescript
   function X(...) {
      const { ref, inView } = useInView(options);
      return (
        <div>
          <div className="h-200"/>
          <p ref={ref}>i am moniterd, isvisible: {inView}. </p>
          {inView&&<p className="fixed w-full h-12 b-0 bg-conic-0">see me when monited target is visible</p>}
          <div className="h-200"/>
        </div>
      );
   }
   ```

2. `useOnInView` hook

   > When you want to monitor a target and trigger some callbacks

   ```typescript
   function X(...) {
      // just monitor a target without any State, like inView, entry in the previous useage
      const trackingRef  = useOnInView(
        (inView, entry) => {
          if (inView) {
            console.log("Element is in view", entry.target);
          } else {
            console.log("Element left view", entry.target);
          }
       },
      );
      return (
        <div ref={trackingRef }>
          <p>This element is being tracked, it would not be re-rendered</p>
        </div>
      );
   }
   ```

3. `InView` component

   > When you want to loading a target when is visible

   ```typescript
   function A() {
     return (
       <InView threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)}>
         {({ ref, entry }) => {
           const ratio = entry?.intersectionRatio ?? 0;
           const style = {
             opacity: ratio,
           };
           return (
             <div>
               <p>you alway can see me</p>
               <p ref={ref} style={style}>
                 you would see different opacity when scrolling.
               </p>
             </div>
           );
         }}
       </InView>
     );
   }
   ```

## 场景 1：组件从底部滚动加载

![alt text](/public/posts/react/scrolling_animation/slideup.gif)

```typescript
function SlideUP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <InView
      // 可见比例阈值：1%-100%
      threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)}
      // t r b l. 扩大顶部判断边界，保证向下滚动过程中，组件滚出屏幕但不会滚出判断边界；缩小底部边界，让滚动边界往中间靠，更符合视觉中心。
      rootMargin="100% 0px -20% 0px"
    >
      {({ inView, ref, entry }) => {
        const opacity = entry?.intersectionRatio ?? 0; // 可见比例
        const y = Math.floor(10 * (1 - opacity)) * 4; // 位移40px
        const style = {
          opacity,
          transform: `translateY(${y}px)`,
        };
        return (
          <div
            ref={ref}
            className={cn("duration-500", className)}
            // 组件进入视觉中心后，从底部滑出，一般可用于标题、文本滚动加载
            style={style}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
}
```

## 场景 2：组件从顶部折叠消失

![alt text](/public/posts/react/scrolling_animation/flip_onTop.gif)

```typescript
function Flip_onTop() {
  return (
    <InView
      threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)} // 扩展下边界，组件从下方出现前，提前渲染，向上移动到屏幕边界时，触发消失动画
      rootMargin="-400px 0px 1000% 0px"
    >
      {({ ref, entry }) => {
        const ratio = entry?.intersectionRatio ?? 0;
        const opacity = ratio;
        const rotateX = Math.floor(-90 * (1 - ratio)); // 向屏幕内旋转90°
        const translateZ = ratio < 0.5 ? Math.floor(100 * (1 - ratio)) : 0; // 旋转45°后，像屏幕内移动100px

        const style = {
          opacity,
          transform: `rotateX(${rotateX}deg) translate3d(0px,0px,${translateZ}px)`,
        };

        return (
          <div className="mt-40 border-t-2 border-red-300 perspective-[1000px]">
            <div
              ref={ref}
              className={cn(
                `${ratio}`,
                "mt-10 h-100 w-full bg-amber-100 text-black text-4xl rounded-lg duration-300 origin-top"
              )}
              style={style}
            >
              ssssssssssss
            </div>
          </div>
        );
      }}
    </InView>
  );
}
```

## 场景 2.1： 列表从顶部滚动消失

![alt text](/public/posts/react/scrolling_animation/list_flip_onTop.gif)

```typescript
function List_Flip_onTop() {
  return (
    <InView
      threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)}
      // 扩展下边界，组件从下方出现前，提前渲染，向上移动到屏幕边界时，触发消失动画
      rootMargin="0px 0px 1000% 0px"
    >
      {({ ref, entry }) => {
        const ratio = entry?.intersectionRatio ?? 0;
        const num = 5;
        return (
          <div ref={ref} className="w-full space-y-10 perspective-[1000px]">
            {...Array.from({ length: num }, (_, index) => {
              // 可见比例平均映射到每一个子组件
              // index==0, ratio:[1,0.8]->scaledRatio:[1,0]
              const l = 1 - index / num;
              const r = 1 - (index + 1) / num;
              const scaledRatio = Math.min(
                (ratio > l ? index / num : ratio < r ? 0 : ratio - r) * num,
                1
              );
              const opacity = scaledRatio;
              const rotateX = Math.floor(-90 * (1 - scaledRatio)); // 向屏幕内旋转90°
              const translateZ =
                scaledRatio < 0.5 ? Math.floor(100 * (1 - scaledRatio)) : 0; // 旋转45°后，像屏幕内移动50px

              const style = {
                opacity,
                transform: `rotateX(${rotateX}deg) translate3d(0px,0px,${translateZ}px)`,
              };
              return (
                <div
                  className="sticky top-15 rounded-lg h-50 w-full bg-amber-200 origin-top duration-500"
                  style={style}
                />
              );
            })}
          </div>
        );
      }}
    </InView>
  );
}
```

## 场景 3：无限滚动列表

![alt text](/public/posts/react/scrolling_animation/infinite_list.gif)

```typescript
let n = 0;
function InfiniteList<T>({
  loadMore = async (): Promise<{ data: T[]; hasMore: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (n > 10) return { data: [], hasMore: false };
    n++;
    return {
      data: Array.from({ length: 10 }, (_, i) => n * 10 + i) as T[],
      hasMore: true,
    };
  },
  direction = "col",
}: {
  loadMore?: () => Promise<{
    data: T[];
    hasMore: boolean;
  }>;
  direction?: "row" | "col";
}) {
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const ref = useOnInView(
    async (inView) => {
      if (inView && hasMore) {
        setLoading(true);
        const list2 = await loadMore();
        setData((prev) => [...prev, ...list2.data]);
        setHasMore(list2.hasMore);
        setLoading(false);
      }
    },
    {
      threshold: 0.5,
    }
  );

  return (
    <ul
      className={cn(
        "h-500",
        direction == "col"
          ? "flex-col overflow-y-auto"
          : "flex-row overflow-x-auto",
        "flex gap-3 scroll-smooth md:[&::-webkit-scrollbar]:hidden"
      )}
    >
      {...data.map((item) => (
        <div
          className={cn(
            "bg-amber-300 flex items-center justify-center",
            direction == "col" ? "min-h-1/5" : "min-w-1/3 aspect-auto"
          )}
        >
          <p>{JSON.stringify(item)}</p>
        </div>
      ))}
      {loading && (
        <p className="h-20 w-full flex items-center justify-center">
          加载中...
        </p>
      )}
      {!loading && <p ref={ref}>{hasMore ? "滑动加载更多" : "到底了"}</p>}
    </ul>
  );
}
```

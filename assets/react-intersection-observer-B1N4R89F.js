const n=`---
title: "React 滚动加载实践"
date: "2025-12-16"
tags: ["React", "react-intersection-observer"]
category: "技术"
excerpt: "什么是IntersectionObserver？如何实现滚动加载？在什么场景下需要滚动加载？"
coverImage: "https://tse2-mm.cn.bing.net/th/id/OIP-C.Uxnhkrsdbo7w5FgefEhxlwHaEn?w=230&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"
readTime: 5
---

## react-intersection-observer 包用法

1. \`useInView\` hook

   > When you want to monitor a target and have other targets respond to it

   \`\`\`typescript
   function X(...) {
       const { ref, inView, entry } = useInView(options);
       return (
           <div>
               <p ref={ref}>isvisible: {inView}. </p>
               {inView&&<p >render when visible</p>}
           </div>
       );
   }
   \`\`\`

2. \`useOnInView\` hook

   > When you want to monitor a target and trigger some callbacks

   \`\`\`typescript
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
   \`\`\`

3. \`InView\` component

   > When you want to loading a tart when is visible

   \`\`\`typescript
   function X(...) {
        return (
           <InView>
               <p>you alway can see me</p>
               ({inView, ref, entry} => {
                    const ratio = entry?.intersectionRatio ?? 0;
                    return (
                        <p
                          ref={ref}
                          style={{
                            opacity: ratio,
                          }}
                        >
                            This element is being tracked, it would not be re-rendered
                        </p>
                    );
               })
           </InView>
        );
   }
   \`\`\`

## 场景 1：组件从底部滚动加载

\`\`\`typescript
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
      // t l b r. 扩大顶部判断边界，保证向下滚动过程中，组件滚出屏幕但不会滚出判断边界；缩小底部边界，让滚动边界往中间靠，更符合视觉中心。
      rootMargin="100% 0px -20% 0px"
    >
      {({ inView, ref, entry }) => {
        const opacity = entry?.intersectionRatio ?? 0; // 可见比例
        const y = Math.floor(10 * (1 - opacity)) * 4; // 位移40px

        return (
          <div
            ref={ref}
            className={cn("duration-500", className)}
            // 组件进入视觉中心后，从底部滑出，一般可用于标题、文本滚动加载
            style={{
              opacity,
              transform: \`translateY(\${y}px)\`,
            }}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
}
\`\`\`

## 场景 2：组件从顶部滚动消失

\`\`\`typescript
function XXXX(...) {
    const { ref, inView, entry } = useInView(options);


  return (
    <>
        <div ref={ref} />

        <div
          className="h-200 w-full bg-black rounded-lg"
          style={{

          }}
        >

        </div>
    </>
  );
}
\`\`\`

## 场景 2：无限滚动列表

\`\`\`typescript
function InfiniteScorling({
  hasMore,loading，loadMore
}: {
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
}) {
  return (
    <InView
      threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)}
      rootMargin="100% 0px 0px 0px" // t l b r. 扩大顶部判断边界，保证向下滚动过程中，组件滚出屏幕但不会滚出判断边界。
    >
      {({ inView, ref, entry }) => {
        const opacity = entry?.intersectionRatio ?? 0;
        const y = Math.floor(10 * (1 - opacity)) * 4;

        return (
          <div
            ref={ref}
            className={cn("duration-500", className)}
            // 组件进入视觉中心后，从底部滑出，一般可用于标题渲染
            style={{
              opacity: fade ? opacity : 1,
              transform: \`translateY(\${y}px)\`,
            }}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
}
\`\`\`
`;export{n as default};

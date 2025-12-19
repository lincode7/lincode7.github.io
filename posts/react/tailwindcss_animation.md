---
title: "Tailwindcss4 动画实践"
date: "2025-12-15"
tags: ["CSS", "Tailwindcss", "React"]
category: "技术"
excerpt: "动画"
coverImage: "https://tse4-mm.cn.bing.net/th/id/OIP-C.tTTuwLk-IMK6_JEiQ53m-QHaEo?w=245&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"
readTime: 5
---

> [官方动画](https://tailwindcss.zhcndoc.com/docs/animation)

> [演示](https://fql3fd.csb.app/)

## loading

```html
<div
  class="inline-block h-20 w-20 border-b-2 border-black rounded-full animate-spin"
/>
```

| tailwindcss    | funtion          |
| -------------- | ---------------- |
| inline-block   | 行内居中         |
| border-b-2     | 底部边框，宽 2px |
| border-primary | 边框使用主题色   |
| rounded-full   | 圆形             |
| animate-spin   | 使用旋转动画     |

**使用场景**：

```typescript
// App.tsx
...
import { Suspense } from "react";
...
const LoadingSpinner => ()=> (<div class="border-b-2 border-primary rounded-full animate-spin inline-block" />);
...
    <Suspense fallback={<LoadingSpinner />}>
    {/*content*/}
    </Suspense>
...
```

## Drawer

```html
...
<style type="text/tailwindcss">
  @theme {
    --animate-drawer: drawer 5s ease-in-out infinite;

    @keyframes drawer {
      0% {
        transform: scaleY(1);
      }
      50% {
        transform: scaleY(0);
      }
      100% {
        transform: scaleY(1);
      }
    }
  }
  @layer base {
    * {
      @apply transition-discrete;
    }
  }
</style>
...
<div class="inline-block h-20 w-20 bg-black animate-drawer" />
...
```

**使用场景**：

```html
// Header.tsx
...
function Drawer({..., isOpen}) {
    ...
        <div className={cn(
            "w-24 h-24 origin-top scale-y-0 duration-600",
            isOpen && "scale-y-100"
        )}>
        {/* content */}
        </div>
    ...
}
...
```

## 列表聚焦

```html
<ul class="group flex flex-col items-center justify-center gap-3">
  <li
    class="h-5 w-10 bg-black group-hover:opacity-20 group-hover:hover:opacity-100"
  ></li>
  <li
    class="h-5 w-10 bg-black group-hover:opacity-20 group-hover:hover:opacity-100"
  ></li>
  <li
    class="h-5 w-10 bg-black group-hover:opacity-20 group-hover:hover:opacity-100"
  ></li>
</ul>
```

## 文本内容更新

```css
@theme {
  --animate-fade-in: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
```

```typescript
function xxx(...){
    const [text, setText] = useState("");
    ...
        <p key={text} className="animate-fade-in">{text}</p>
    ...
}
```

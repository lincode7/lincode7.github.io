const a=t=>new Promise(o=>setTimeout(o,t)),d={async getPosts(t=1,o=10,n){await a(300);const s=Array.from({length:20},(i,e)=>({id:`${e+1}`,title:`博客文章标题 ${e+1}`,content:`这是第 ${e+1} 篇博客文章的内容...`,excerpt:`这是第 ${e+1} 篇博客文章的摘要，这里会简要介绍文章的主要内容。`,date:new Date(Date.now()-e*864e5).toISOString(),tags:e%2===0?["React","前端"]:["Node.js","后端"],readTime:Math.floor(Math.random()*10)+5,category:e%3===0?"技术":e%3===1?"生活":"旅行",coverImage:e%4===0?"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800":void 0}));let c=s;n&&(c=s.filter(i=>i.tags.includes(n)));const r=(t-1)*o,m=r+o;return{posts:c.slice(r,m),total:c.length,page:t,limit:o}},async getPost(t){return await a(200),{id:t,title:"React 性能优化指南",content:`# React 性能优化指南

## 前言
在现代Web应用中，性能是用户体验的关键因素之一。React作为一个声明式的UI库，虽然为我们提供了高效的更新机制，但在复杂应用中仍需要注意性能优化。

## 核心优化技巧

### 1. 使用React.memo
\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 只在props改变时重新渲染 */
});
\`\`\`

### 2. 使用useCallback和useMemo
\`\`\`jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
\`\`\`

### 3. 虚拟化长列表
对于长列表，使用虚拟化技术只渲染可见部分：
- react-window
- react-virtualized

### 4. 代码分割
使用React.lazy和Suspense实现按需加载：
\`\`\`jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
\`\`\`

## 性能监控工具

1. **React DevTools Profiler**
2. **Chrome Performance Tab**
3. **Lighthouse**

## 总结
性能优化是一个持续的过程，需要根据应用的具体情况进行调整。`,excerpt:"深入探讨React应用性能优化的各种技巧",date:"2024-01-15",tags:["React","性能优化","前端","JavaScript"],readTime:8,category:"技术",coverImage:"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"}},async getTags(){return await a(150),[{name:"React",count:15,color:"#61dafb"},{name:"TypeScript",count:12,color:"#3178c6"},{name:"Node.js",count:8,color:"#68a063"},{name:"CSS",count:10,color:"#264de4"},{name:"Webpack",count:6,color:"#8dd6f9"},{name:"Docker",count:5,color:"#2496ed"},{name:"算法",count:7,color:"#f34b7d"},{name:"设计模式",count:4,color:"#ff6b6b"},{name:"数据库",count:6,color:"#4ecdc4"},{name:"微服务",count:3,color:"#45b7d1"}]}},p={async getStats(){return await a(200),{games:156,movies:342,music:789,travel:24}},async getRecentActivities(){return await a(250),[{id:"1",type:"game",title:"塞尔达传说：王国之泪",description:"完成了100%收集，包括所有神殿、呀哈哈和装备",date:"2024-01-20",tags:["Switch","动作冒险","开放世界"],rating:5,image:"https://via.placeholder.com/300x200"},{id:"2",type:"movie",title:"奥本海默",description:"克里斯托弗·诺兰的又一力作，震撼的叙事和视觉效果",date:"2024-01-18",tags:["传记","历史","诺兰"],rating:4.5,image:"https://via.placeholder.com/300x200"},{id:"3",type:"music",title:"Midnights - Taylor Swift",description:"泰勒·斯威夫特的第十张录音室专辑，午夜时分的自我反思",date:"2024-01-15",tags:["流行","泰勒·斯威夫特"],rating:4},{id:"4",type:"travel",title:"日本东京",description:"东京深度游，体验传统与现代的完美融合",date:"2024-01-10",tags:["日本","东京","自由行"],rating:5,image:"https://via.placeholder.com/300x200"}]}};export{d as b,p as i};

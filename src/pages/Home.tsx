import {
  Github,
  Mail,
  MapPin,
  Mars,
  MessageCircleMore,
  PhoneCall,
  Tag,
  Venus,
} from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import FlipUP from "../components/animation/FlipUP";
import SlideUP from "../components/animation/SlideUP";
import MetaTags from "../components/seo/MetaTags";
import { blogAPI } from "../utils/api/posts";
import { SITE_CONFIG } from "../utils/constants";
import { cn } from "../utils/helper";
import { createSuspenseResource } from "../utils/suspense";

function Profile({ className }: { className?: string }) {
  return (
    <div
      className={cn("mb-6 border-t-2 border-foreground/40 pt-12", className)}
    >
      <div className="grid gap-[5px] grid-cols-[1fr_auto] lg:gap-y-0 lg:gap-x-[15px]">
        <img
          src={SITE_CONFIG.author.avatar}
          alt="avatar"
          className="avatar col-span-2 lg:col-span-1 lg:row-span-2 md:justify-self-end lg:justify-self-start md:self-end lg:self-start"
        />

        <span className="col-span-2 lg:col-span-1 lg:justify-self-end mb-2.5 mt-[15px] lg:m-0 text-sm">
          Profile info
        </span>

        {/* TODO: 滚动显示: 位置y：20-0 */}
        {SITE_CONFIG.author.label.map((label, index) => (
          <SlideUP
            className={cn(
              index == 0
                ? "lg:justify-self-end lg:self-end"
                : cn(
                    "col-span-2",
                    index % 4 == 0 && "lg:justify-self-end lg:self-end",
                    (index % 4 == 1 || index % 4 == 3) &&
                      "justify-self-center lg:justify-self-end lg:self-end lg:mr-[415px]",
                    index % 4 == 2 && "justify-self-end self-end"
                  )
            )}
          >
            <p
              className={cn(
                "overflow-hidden text-5xl lg:text-9xl font-bold lg:mb-[-13px]"
              )}
            >
              <span className="block">{label}</span>
            </p>
          </SlideUP>
        ))}
      </div>

      <div className="mt-[50px] lg:mt-[130px] flex justify-between items-end flex-wrap gap-10 lg:gap-5">
        {/* TODO: 滚动显示：透明度0-1，位置y：20-0*/}
        <div className="grid gap-[5px_0] max-w-[400px] text-2xl text-foreground/50">
          <SlideUP fade={false}>
            <p className="flex flex-row gap-1 items-center">
              {SITE_CONFIG.author.name}
              {SITE_CONFIG.author.gender == "male" ? (
                <Mars size={20} />
              ) : (
                <Venus size={20} />
              )}
            </p>
          </SlideUP>
          <SlideUP fade={false}>
            {" "}
            <p className="flex flex-row gap-1 items-center">
              <MapPin size={20} />
              {SITE_CONFIG.author.location}
            </p>
          </SlideUP>
        </div>

        <ul className="logosPodcast flex gap-[15px] lg:gap-5">
          {Object.entries(SITE_CONFIG.author.contacts).map(([key, value]) => {
            return (
              <li className="w-[17px] lg:w-7 grid place-items-center">
                {key === "github" && (
                  <a key={key} href={`https://github.com/${value}`}>
                    <Github />
                  </a>
                )}
                {key === "email" && (
                  <a key={key} href={`mailto:${value}`}>
                    <Mail />
                  </a>
                )}
                {key === "phone" && <PhoneCall />}
                {key === "wechat" && <MessageCircleMore />}
                {key === "qq" && <MessageCircleMore />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const categoriesResource = createSuspenseResource(blogAPI.getCategories);

function GridCategores() {
  const categories = categoriesResource.read();

  return (
    <div className={cn("lg:grid lg:grid-cols-4 gap-5 items-start")}>
      <div className="hidden lg:flex justify-end items-end">
        <p className="block">some infor about category</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-5 lg:gap-y-[60px] col-span-3">
        {categories.map((category) => (
          <FlipUP className="cursor-pointer">
            <div className="aspect-square rounded-md bg-foreground/40 hover:opacity-50 duration-500 flex-center flex-col">
              <p className="text-7xl lg:text-9xl font-bold">{category.count}</p>
              <p className="text-4xl">{category.name}</p>
            </div>
            <p className="pointer-events-none overflow-hidden">
              {category.hotTags}
            </p>
          </FlipUP>
        ))}
      </div>
    </div>
  );
}

const tagsResource = createSuspenseResource(blogAPI.getTags);

function FixedTags({}) {
  const tags = tagsResource.read();

  return (
    <ul
      className={cn(
        "uppercase text-[10px] tracking-[0]",
        "z-80",
        "pointer-events-none",
        "fixed top-0 lg:top-auto lg:bottom-0 left-0",
        "w-full max-w-full px-5 lg:px-0 py-[25px] mx-auto justify-center flex flex-wrap gap-2.5 lg:gap-5 xl:gap-[35px] md:gap-y-[15px] ",
        "bg-background"
        // "hidden"
      )}
    >
      {tags.map((tag) => (
        <li>{tag.name}</li>
      ))}
    </ul>
  );
}

function CategoresAndTags({ className }: { className?: string }) {
  const { ref, inView } = useInView({
    rootMargin: "-200px",
  });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <GridCategores />
      {inView && <FixedTags />}
    </div>
  );
}

const recentPostsResource = createSuspenseResource(blogAPI.getPosts);

function RecentPosts({ className }: { className?: string }) {
  const { posts: recentPosts } = recentPostsResource.read(1, 3);

  return (
    <div className={cn(className)}>
      <div className="relative grid md:grid-cols-[1fr_auto_auto_1fr] gap-x-[15px] gap-y-[5px] uppercase">
        {/* 绝对位置标签 */}
        <span className="hidden md:block absolute right-0 text-[10px]">
          blog service
        </span>
        {/* 网格内容 */}
        <SlideUP className="md:col-span-2">
          <h2 className="overflow-hidden text-4xl md:text-7xl">blogs</h2>
        </SlideUP>

        <SlideUP className="md:col-start-2 md:col-end-4 justify-self-center">
          <h2 className="overflow-hidden text-4xl md:text-7xl">notes</h2>
        </SlideUP>

        <SlideUP className="md:col-start-3 md:col-end-5 justify-self-end">
          <h2 className="overflow-hidden text-4xl md:text-7xl">photos</h2>
        </SlideUP>
      </div>

      {/* 近期博客，3篇 */}
      <div className="cardsOffre mt-12 lg:mt-30 perspective-[1000px] space-y-10">
        {...recentPosts.map((post, index) => (
          <div
            className={cn(
              "lg:sticky lg:top-15 last:relative last:top-0 mb-10 lg:mb-10 lg:last:mb-0",
              "lg:min-h-[545px] px-6 lg:px-20 py-6 lg:py-12 my-5 lg:my-0 rounded-[10px]",
              "grid auto-rows-max-remove grid-rows-[auto_1fr] md:grid-cols-2 xl:grid-cols-[60%_auto]",
              "group origin-top",
              "bg-foreground",
              "duration-500 transition-discrete",
              "text-background"
            )}
          >
            <a
              href={`/blog/${post.tags[0]}/${post.id}`}
              className="lg:col-span-2 lg:-order-1 lg:pb-5 lg:border-b-2 lg:border-background/30 uppercase text-2xl md:text-4xl cursor-pointer hover:text-primary"
            >
              {post.title}
            </a>
            <span
              className={cn(
                "block text-7xl lg:text-[300px] tracking-[-0.02em] leading-none lg:leading-[0.75] self-center lg:self-end justify-self-end lg:justify-self-start opacity-10"
              )}
            >
              {index + 1}
            </span>
            <div className="pt-[5px] lg:max-w-[380px] col-span-2 lg:self-end lg:col-span-1 mt-5 border-t border-background/30 lg:border-none space-y-3">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full aspect-4/2 object-cover rounded-lg"
                loading="lazy"
              />
              <p className="flex-left flex-row gap-1.5 font-semibold text-background/50">
                <p className="rounded-xl bg-primary/50 px-3 py-1 w-fit">
                  {post.category}
                </p>
                {post.date}
              </p>

              <p className="flex-left flex-wrap gap-1.5 text-background/70">
                {...post.tags.map((tag) => (
                  <span className="flex-left flex-row gap-0.5 text-sm">
                    <Tag size={12}></Tag>
                    {tag}
                  </span>
                ))}
              </p>

              <p>{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <MetaTags
        title="Home"
        description="欢迎来到我的个人主页，这里展示了我的个人信息、技能和最新动态"
      />

      <div className="page">
        <h1 className="text-7xl text-right lg:max-w-fit lg:ml-auto lg:mr-0">
          <div className="lg:overflow-hidden">
            <span className="inline-block">{SITE_CONFIG.name}</span>
          </div>
          <div className="lg:overflow-hidden">
            <span className="inline-block text-3xl lg:text-7xl">
              {SITE_CONFIG.description}
            </span>
          </div>
        </h1>

        {/* TODO: 填充什么内容 */}
        <div className="h-150" />

        <Profile className="mt-25 md:mt-50" />

        <CategoresAndTags className="pt-7 lg:pt-px pb-6 px-5 md:px-12 mt-10 lg:mt-30" />

        <RecentPosts className="px-5 md:px-12 pt-10 lg:pt-0 lg:mt-[270px]" />

        <div className="h-200" />
      </div>
    </>
  );
}

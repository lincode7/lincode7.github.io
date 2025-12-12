import {
  Book,
  Calendar,
  Github,
  Mail,
  MapPin,
  MessageCircleMore,
  PhoneCall,
} from "lucide-react";
import MetaTags from "../components/seo/MetaTags";
import { Card } from "../components/ui/Card";
import ContactInfo from "../components/ui/ContactInfo";
import StatCard from "../components/ui/StatsCard";
import { blogAPI } from "../utils/api/posts";
import { SITE_CONFIG } from "../utils/constants";
import { createSuspenseResource } from "../utils/suspense";

const BlogStatsResource = createSuspenseResource(blogAPI.getStats);

export default function Home() {
  const stats = BlogStatsResource.read();

  return (
    <>
      <MetaTags
        title="Home"
        description="欢迎来到我的个人主页，这里展示了我的个人信息、技能和最新动态"
      />

      <div className="container animate-slide-up">
        {/* 个人信息区域 */}
        <div className=" mb-12 relative after:absolute after:h-0.5 after:w-max after:shadow-sm">
          {/* 个人信息 */}
          <div className="mb-8 flex-center flex-col md:flex-row gap-6">
            <img
              src={SITE_CONFIG.author.avatar}
              alt="个人头像"
              className="avatar"
            />
            <div className="flex flex-col">
              <h1 className="text-center md:text-left">
                {SITE_CONFIG.author.name}
              </h1>
              <p className="mb-4">{SITE_CONFIG.author.label}</p>
              <div className="flex-left gap-2">
                <MapPin size={20} />
                <span>{SITE_CONFIG.author.location}</span>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h2 className="bootom-line">联系方式</h2>
            <Card className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(SITE_CONFIG.author.contacts).map(
                ([key, value]) => {
                  switch (key) {
                    case "github":
                      return (
                        <ContactInfo
                          key={key}
                          icon={Github}
                          value={value}
                          link={`https://github.com/${value}`}
                        />
                      );
                    case "email":
                      return (
                        <ContactInfo
                          key={key}
                          icon={Mail}
                          value={value}
                          link={`mailto:${value}`}
                        />
                      );
                    case "phone":
                      return (
                        <ContactInfo key={key} icon={PhoneCall} value={value} />
                      );
                    case "wechat":
                      return (
                        <ContactInfo
                          key={key}
                          icon={MessageCircleMore}
                          value={value}
                        />
                      );
                    case "qq":
                      return (
                        <ContactInfo
                          key={key}
                          icon={MessageCircleMore}
                          value={value}
                        />
                      );
                  }
                }
              )}
            </Card>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-12">
          <h2 className="bootom-line">博客统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={Book}
              title="博客数量"
              value={stats.total}
              description={"总计发布"}
            />
            <StatCard
              icon={Calendar}
              title="最近更新"
              value={stats.recentCount}
              description={"近期活跃"}
            />
          </div>
        </div>

        {/* 近期博客分类 */}
        <Card hover={false}>
          <h2 className="bootom-line">近期博客分类</h2>
          <div className="flex flex-wrap gap-3">
            {stats.recentCategories.map((category, index) => (
              <span key={index} className="tag">
                {category}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

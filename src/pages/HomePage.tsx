import {
  Calendar,
  FileText,
  Github,
  Mail,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import React from "react";
import ContactInfo from "../components/Common/ContactInfo";
import StatsCard from "../components/Common/StatsCard";
import { blogStats, userInfo } from "../data/sampleData";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* 个人信息区域 */}
      <div className="profile-section">
        <div className="profile-header">
          <img src={userInfo.avatar} alt="头像" className="profile-avatar" />
          <div className="profile-info">
            <h1>{userInfo.name}</h1>
            <p className="bio">{userInfo.bio}</p>
            {userInfo.location && (
              <p className="location">
                <User size={16} /> {userInfo.location}
              </p>
            )}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="contacts-section">
          <h2>联系方式</h2>
          <div className="contacts-grid">
            <ContactInfo
              icon={<Github />}
              label="GitHub"
              value={userInfo.contacts.github}
              link={`https://github.com/${userInfo.contacts.github}`}
            />
            <ContactInfo
              icon={<Mail />}
              label="Email"
              value={userInfo.contacts.email}
              link={`mailto:${userInfo.contacts.email}`}
            />
            {userInfo.contacts.phone && (
              <ContactInfo
                icon={<Phone />}
                label="Phone"
                value={userInfo.contacts.phone}
              />
            )}
            {userInfo.contacts.wechat && (
              <ContactInfo
                icon={<MessageCircle />}
                label="WeChat"
                value={userInfo.contacts.wechat}
              />
            )}
            {userInfo.contacts.qq && (
              <ContactInfo
                icon={<MessageCircle />}
                label="QQ"
                value={userInfo.contacts.qq}
              />
            )}
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <h2>博客统计</h2>
        <div className="stats-grid">
          <StatsCard
            icon={<FileText />}
            title="博客数量"
            value={blogStats.totalPosts.toString()}
            description="总计发布"
          />
          {/* <StatsCard
            icon={<Eye />}
            title="总访问量"
            value={blogStats.totalViews.toString()}
            description="累计访问"
          /> */}
          <StatsCard
            icon={<Calendar />}
            title="本月更新"
            value={blogStats.monthlyPosts.toString()}
            description="近期活跃"
          />
        </div>
      </div>

      {/* 近期博客分类 */}
      <div className="recent-section">
        <h2>近期博客分类</h2>
        <div className="tags-cloud-mini">
          {blogStats.recentTags.map((tag, index) => (
            <span key={index} className="tag-mini">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

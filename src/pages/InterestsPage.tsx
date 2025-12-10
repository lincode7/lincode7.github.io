import {
  Calendar,
  Film,
  Gamepad2,
  MapPin,
  Music,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import GameCard from "../components/Interests/GameCard";
import MovieCard from "../components/Interests/MovieCard";
import MusicCard from "../components/Interests/MusicCard";
import TravelCard from "../components/Interests/TravelCard";
import { InterestStats } from "../types/interests";
import "./InterestsPage.css";

const InterestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "games" | "movies" | "music" | "travel"
  >("games");
  const [stats, setStats] = useState<InterestStats>({
    totalGames: 0,
    totalMovies: 0,
    totalAlbums: 0,
    totalLocations: 0,
    recentActivity: {
      games: [],
      movies: [],
      music: [],
      travels: [],
    },
  });

  useEffect(() => {
    // 模拟获取数据
    const mockStats: InterestStats = {
      totalGames: 42,
      totalMovies: 156,
      totalAlbums: 89,
      totalLocations: 23,
      recentActivity: {
        games: [
          {
            id: "1",
            title: "Cyberpunk 2077",
            platform: ["PC", "PS5"],
            hoursPlayed: 68,
            status: "completed",
            rating: 9,
            lastPlayed: "2024-01-15",
            coverImage:
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
          },
        ],
        movies: [
          {
            id: "1",
            title: "Inception",
            year: 2010,
            rating: 9.8,
            watchedDate: "2024-01-10",
            review: "Mind-blowing masterpiece",
            poster:
              "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w-300",
          },
        ],
        music: [
          {
            id: "1",
            title: "Midnight City",
            artist: "M83",
            genre: ["Synth-pop", "Electronic"],
            rating: 9.5,
            lastListened: "2024-01-12",
            coverImage:
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
          },
        ],
        travels: [
          {
            id: "1",
            name: "Tokyo",
            country: "Japan",
            visitDate: "2023-12-20",
            rating: 9.9,
            photos: [
              "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
            ],
            description: "Vibrant city with amazing culture",
          },
        ],
      },
    };

    setStats(mockStats);
  }, []);

  const tabs = [
    {
      id: "games",
      label: "游戏",
      icon: <Gamepad2 size={20} />,
      color: "#ff6b6b",
    },
    { id: "movies", label: "电影", icon: <Film size={20} />, color: "#4ecdc4" },
    { id: "music", label: "音乐", icon: <Music size={20} />, color: "#45b7d1" },
    {
      id: "travel",
      label: "旅行",
      icon: <MapPin size={20} />,
      color: "#96ceb4",
    },
  ];

  const renderContent = () => {
    const recentActivity = stats.recentActivity[activeTab];

    if (!recentActivity || recentActivity.length === 0) {
      return (
        <div className="no-data">
          <p>暂无数据</p>
        </div>
      );
    }

    switch (activeTab) {
      case "games":
        return (
          <div className="content-grid">
            {recentActivity.map((item: any) => (
              <GameCard key={item.id} game={item} />
            ))}
          </div>
        );
      case "movies":
        return (
          <div className="content-grid">
            {recentActivity.map((item: any) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        );
      case "music":
        return (
          <div className="content-grid">
            {recentActivity.map((item: any) => (
              <MusicCard key={item.id} album={item} />
            ))}
          </div>
        );
      case "travel":
        return (
          <div className="content-grid">
            {recentActivity.map((item: any) => (
              <TravelCard key={item.id} location={item} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="interests-page">
      <div className="interests-header">
        <h1>兴趣主页</h1>
        <p className="subtitle">记录我的数字生活轨迹</p>
      </div>

      <div className="stats-overview">
        {[
          { label: "游戏数量", value: stats.totalGames, icon: <Gamepad2 /> },
          { label: "观影数量", value: stats.totalMovies, icon: <Film /> },
          { label: "音乐专辑", value: stats.totalAlbums, icon: <Music /> },
          { label: "旅行地点", value: stats.totalLocations, icon: <MapPin /> },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tabs-section">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id as any)}
              style={{ "--tab-color": tab.color } as React.CSSProperties}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <div className="tab-indicator"></div>}
            </button>
          ))}
        </div>

        <div className="tabs-content">
          <div className="content-header">
            <h3>近期动态</h3>
            <div className="header-actions">
              <Calendar size={16} />
              <span>最近更新</span>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>

      <div className="activity-chart">
        <h3>活动趋势</h3>
        <div className="chart-container">
          {/* 这里可以集成一个简单的图表库，如 recharts */}
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>活动趋势图表</p>
            <small>（可集成图表库展示月度统计）</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsPage;

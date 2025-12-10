import {
  Headphones,
  Heart,
  Music,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
} from "lucide-react";
import React, { useState } from "react";
import { MusicAlbum } from "../../types/interests";
import "./MusicCard.css";

interface MusicCardProps {
  album: MusicAlbum;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  album,
  isPlaying = false,
  onPlay,
  onPause,
  onLike,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(80);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />);
      } else {
        stars.push(<Star key={i} size={14} color="#d1d5db" />);
      }
    }

    return stars;
  };

  return (
    <div className="music-card">
      <div className="music-card-header">
        <div className="album-cover">
          {!imageError ? (
            <img
              src={album.coverImage}
              alt={album.title}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="cover-fallback">
              <Music size={40} />
            </div>
          )}

          <div className="album-overlay">
            <button
              className="play-control"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>

        <div className="album-info">
          <div className="album-header">
            <h4 className="album-title">{album.title}</h4>
            <div className="album-artist">
              <Headphones size={14} />
              <span>{album.artist}</span>
            </div>
          </div>

          <div className="album-genres">
            {album.genre.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="music-card-content">
        <div className="rating-section">
          <div className="rating-stars">
            {renderStars(album.rating)}
            <span className="rating-value">{album.rating.toFixed(1)}</span>
          </div>

          <div className="last-listened">
            最近收听: {formatDate(album.lastListened)}
          </div>
        </div>

        <div className="player-controls">
          <div className="transport-controls">
            <button className="control-button" aria-label="上一首">
              <SkipBack size={18} />
            </button>

            <button
              className="play-pause-button"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button className="control-button" aria-label="下一首">
              <SkipForward size={18} />
            </button>
          </div>

          <div className="volume-control">
            <Volume2 size={16} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="音量控制"
            />
            <span className="volume-percent">{volume}%</span>
          </div>
        </div>

        <div className="music-stats">
          <div className="stat-item">
            <div className="stat-label">风格</div>
            <div className="stat-value">
              {album.genre.slice(0, 2).join(", ")}
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">评分</div>
            <div className="stat-value">
              <Star size={14} />
              <span>{album.rating.toFixed(1)}/10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="music-card-footer">
        <div className="action-buttons">
          <button
            className={`action-button like-button ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={isLiked ? "取消喜欢" : "喜欢"}
          >
            <Heart size={18} />
            <span>{isLiked ? "已喜欢" : "喜欢"}</span>
          </button>

          <button
            className="action-button share-button"
            onClick={onShare}
            aria-label="分享"
          >
            <Share2 size={18} />
            <span>分享</span>
          </button>
        </div>

        <div className="playback-info">
          <div className="playback-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: isPlaying ? "60%" : "0%" }}
              />
            </div>
            <div className="time-display">
              <span className="current-time">2:30</span>
              <span className="total-time">4:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
export type { MusicCardProps };

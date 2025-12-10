import {
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Info,
  Play,
  Star,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";
import { Movie } from "../../types/interests";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  showDetails?: boolean;
  onPlay?: () => void;
  onDetails?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showDetails = false,
  onPlay,
  onDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "#10b981";
    if (rating >= 7) return "#f59e0b";
    return "#ef4444";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="movie-card">
      <div className="movie-card-header">
        <div className="movie-poster">
          {!imageError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="poster-fallback">
              <Film size={32} />
              <span>{movie.title.charAt(0)}</span>
            </div>
          )}

          <div className="movie-year">
            <Calendar size={12} />
            {movie.year}
          </div>

          <div
            className="movie-rating"
            style={{ backgroundColor: getRatingColor(movie.rating) }}
          >
            <Star size={12} />
            {movie.rating.toFixed(1)}
          </div>
        </div>

        <div className="movie-quick-actions">
          {onPlay && (
            <button
              className="action-button play-button"
              onClick={onPlay}
              aria-label="播放预告片"
            >
              <Play size={16} />
            </button>
          )}

          {onDetails && (
            <button
              className="action-button details-button"
              onClick={onDetails}
              aria-label="查看详情"
            >
              <Info size={16} />
            </button>
          )}

          <button
            className="action-button expand-button"
            onClick={toggleExpand}
            aria-label={isExpanded ? "收起详情" : "展开详情"}
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      <div className="movie-card-content">
        <h4 className="movie-title">{movie.title}</h4>

        <div className="movie-meta">
          <div className="meta-item watched-date">
            <Calendar size={14} />
            <span>{formatDate(movie.watchedDate)}</span>
          </div>
        </div>

        {movie.review && isExpanded && (
          <div className="movie-review">
            <div className="review-label">
              <ThumbsUp size={14} />
              <span>我的评价</span>
            </div>
            <p className="review-content">{movie.review}</p>
          </div>
        )}

        <div className="movie-stats">
          <div className="stat-item">
            <div className="stat-label">评分</div>
            <div className="stat-value">
              <Star size={14} />
              <span>{movie.rating.toFixed(1)}/10</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">观看时间</div>
            <div className="stat-value">
              <Clock size={14} />
              <span>{formatDate(movie.watchedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-card-footer">
        <div className="rating-bar">
          <div
            className="rating-fill"
            style={{
              width: `${movie.rating * 10}%`,
              backgroundColor: getRatingColor(movie.rating),
            }}
          />
        </div>

        <div className="rating-label">
          <span className="rating-text">推荐指数</span>
          <span className="rating-value">{movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
export type { MovieCardProps };

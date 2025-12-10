import {
  Calendar,
  Globe,
  Heart,
  Image,
  MapPin,
  Maximize2,
  Navigation,
  Share2,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import { TravelLocation } from "../../types/interests";
import "./TravelCard.css";

interface TravelCardProps {
  location: TravelLocation;
  onExpand?: () => void;
  onNavigate?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

const TravelCard: React.FC<TravelCardProps> = ({
  location,
  onExpand,
  onNavigate,
  onLike,
  onShare,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === location.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? location.photos.length - 1 : prev - 1
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "#10b981";
    if (rating >= 7) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="travel-card">
      <div className="travel-card-header">
        <div className="location-gallery">
          {location.photos.length > 0 ? (
            <div className="main-photo">
              <img
                src={location.photos[currentImageIndex]}
                alt={`${location.name} - 照片 ${currentImageIndex + 1}`}
                loading="lazy"
              />

              {location.photos.length > 1 && (
                <>
                  <button
                    className="gallery-nav prev-button"
                    onClick={prevImage}
                    aria-label="上一张照片"
                  >
                    ←
                  </button>
                  <button
                    className="gallery-nav next-button"
                    onClick={nextImage}
                    aria-label="下一张照片"
                  >
                    →
                  </button>

                  <div className="gallery-counter">
                    <Image size={14} />
                    <span>
                      {currentImageIndex + 1} / {location.photos.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="no-photo">
              <Image size={48} />
              <span>暂无照片</span>
            </div>
          )}

          {location.photos.length > 1 && !showAllPhotos && (
            <div className="thumbnail-grid">
              {location.photos.slice(0, 3).map((photo, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`查看照片 ${index + 1}`}
                >
                  <img src={photo} alt={`缩略图 ${index + 1}`} />
                </button>
              ))}
              {location.photos.length > 3 && (
                <button
                  className="thumbnail more-thumbnails"
                  onClick={() => setShowAllPhotos(true)}
                  aria-label={`查看全部 ${location.photos.length} 张照片`}
                >
                  +{location.photos.length - 3}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="location-header">
          <div className="location-title-section">
            <h3 className="location-name">{location.name}</h3>
            <div className="location-country">
              <Globe size={14} />
              <span>{location.country}</span>
            </div>
          </div>

          <div className="location-rating">
            <div
              className="rating-badge"
              style={{ backgroundColor: getRatingColor(location.rating) }}
            >
              <Star size={14} />
              <span>{location.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="travel-card-content">
        <div className="location-info">
          <div className="info-item visit-date">
            <Calendar size={16} />
            <div className="info-content">
              <div className="info-label">访问时间</div>
              <div className="info-value">{formatDate(location.visitDate)}</div>
            </div>
          </div>

          <div className="info-item location-rating-info">
            <Star size={16} />
            <div className="info-content">
              <div className="info-label">评分</div>
              <div className="info-value">{location.rating.toFixed(1)}/10</div>
            </div>
          </div>
        </div>

        <div className="location-description">
          <p>{location.description}</p>
        </div>

        {showAllPhotos && (
          <div className="full-gallery">
            <div className="gallery-header">
              <h4>所有照片 ({location.photos.length})</h4>
              <button
                className="close-gallery"
                onClick={() => setShowAllPhotos(false)}
                aria-label="关闭图库"
              >
                ×
              </button>
            </div>
            <div className="gallery-grid">
              {location.photos.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <img src={photo} alt={`照片 ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="travel-card-footer">
        <div className="action-buttons">
          <button
            className="action-button navigate-button"
            onClick={onNavigate}
            aria-label="查看地图"
          >
            <Navigation size={18} />
            <span>导航</span>
          </button>

          <button
            className={`action-button like-button ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={isLiked ? "取消收藏" : "收藏"}
          >
            <Heart size={18} />
            <span>{isLiked ? "已收藏" : "收藏"}</span>
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

        <div className="location-meta">
          <div className="meta-item">
            <MapPin size={14} />
            <span>{location.country}</span>
          </div>

          {onExpand && (
            <button
              className="expand-button"
              onClick={onExpand}
              aria-label="查看详情"
            >
              <Maximize2 size={16} />
              查看详情
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelCard;
export type { TravelCardProps };

import {
  Bookmark,
  CheckCircle,
  Clock,
  Gamepad2,
  PlayCircle,
  Star,
} from "lucide-react";
import React from "react";
import { Game } from "../../types/interests";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const getStatusIcon = (status: Game["status"]) => {
    switch (status) {
      case "playing":
        return <PlayCircle className="status-icon playing" />;
      case "completed":
        return <CheckCircle className="status-icon completed" />;
      case "backlog":
        return <Bookmark className="status-icon backlog" />;
      default:
        return <Gamepad2 className="status-icon" />;
    }
  };

  const getStatusText = (status: Game["status"]) => {
    switch (status) {
      case "playing":
        return "游玩中";
      case "completed":
        return "已完成";
      case "backlog":
        return "待玩";
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-header">
        <img
          src={game.coverImage}
          alt={game.title}
          className="game-cover"
          loading="lazy"
        />

        <div className="game-status">
          {getStatusIcon(game.status)}
          <span className="status-text">{getStatusText(game.status)}</span>
        </div>
      </div>

      <div className="game-card-content">
        <h4 className="game-title">{game.title}</h4>

        <div className="game-platforms">
          {game.platform.map((platform, index) => (
            <span key={index} className="platform-tag">
              {platform}
            </span>
          ))}
        </div>

        <div className="game-stats">
          <div className="stat">
            <Clock size={14} />
            <span>{game.hoursPlayed} 小时</span>
          </div>

          {game.rating && (
            <div className="stat">
              <Star size={14} />
              <span>{game.rating}/10</span>
            </div>
          )}
        </div>

        <div className="game-meta">
          <span className="last-played">
            上次游玩: {new Date(game.lastPlayed).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
export type { GameCardProps };

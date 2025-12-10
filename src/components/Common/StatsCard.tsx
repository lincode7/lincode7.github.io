import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import React, { ReactNode } from "react";
import "./StatsCard.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  trendLabel?: string;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  loading?: boolean;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  trendLabel,
  color = "primary",
  loading = false,
  onClick,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="trend-icon trend-up" />;
      case "down":
        return <TrendingDown size={16} className="trend-icon trend-down" />;
      case "neutral":
        return <Minus size={16} className="trend-icon trend-neutral" />;
      default:
        return null;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "stats-card-primary";
      case "secondary":
        return "stats-card-secondary";
      case "accent":
        return "stats-card-accent";
      case "success":
        return "stats-card-success";
      case "warning":
        return "stats-card-warning";
      case "error":
        return "stats-card-error";
      default:
        return "stats-card-primary";
    }
  };

  const formatTrendValue = (val: number | undefined) => {
    if (val === undefined) return "";
    return val > 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="stats-card stats-card-loading">
        <div className="stats-card-skeleton">
          <div className="skeleton-icon"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
            <div className="skeleton-description"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`stats-card ${getColorClass()} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stats-card-header">
        <div className="stats-card-icon">{icon}</div>
        {(trend || trendValue !== undefined) && (
          <div className="stats-card-trend">
            {getTrendIcon()}
            {trendValue !== undefined && (
              <span className="trend-value">
                {formatTrendValue(trendValue)}
              </span>
            )}
            {trendLabel && !trendValue && (
              <span className="trend-label">{trendLabel}</span>
            )}
          </div>
        )}
      </div>

      <div className="stats-card-content">
        <div className="stats-card-title">{title}</div>
        <div className="stats-card-value">{value}</div>
        {description && (
          <div className="stats-card-description">{description}</div>
        )}
      </div>

      <div className="stats-card-footer">
        <div className="stats-card-bg-effect"></div>
      </div>
    </div>
  );
};

export default StatsCard;
export type { StatsCardProps };

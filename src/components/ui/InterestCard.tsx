import { Calendar } from "lucide-react";
import type {
  GameInterest,
  Interest,
  MovieInterest,
  MusicInterest,
  TravelInterest,
} from "../../types/interests";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

interface InterestCardProps {
  icon: any;
  data: Interest;
  className?: string;
}

export default function InterestCard({
  icon: Icon,
  data,
  className,
}: InterestCardProps) {
  return (
    <Card
      className={`overflow-hidden break-inside-avoid p-2 mb-6 flex flex-col gap-1.5 hover:scale-105 group ${className}`}
    >
      <CardHeader>
        <CardTitle className="group-hover-show">{data.title}</CardTitle>

        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="w-full object-cover rounded-md"
          />
        ) : null}

        <CardDescription className="group-hover-show">
          {data.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="group-hover-show">
        {data.type === "music" && (data as MusicInterest).artist && (
          <p className="text-sm">艺术家: {(data as MusicInterest).artist}</p>
        )}

        {data.type === "movie" && (data as MovieInterest).director && (
          <p className="text-sm">导演: {(data as MovieInterest).director}</p>
        )}

        {data.type === "travel" && (data as TravelInterest).period && (
          <p className="text-sm">期间: {(data as TravelInterest).period}</p>
        )}

        {data.type === "game" && (data as GameInterest).hours && (
          <p className="text-sm">
            游玩时长: {(data as GameInterest).hours} 小时
          </p>
        )}

        {data.type === "movie" && (data as MovieInterest).duration && (
          <p className="text-sm">
            时长: {(data as MovieInterest).duration} 分钟
          </p>
        )}

        {/* tag */}
        {data.tags && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <span key={tag} className="tag text-xs px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* date */}
        <div className="flex-left gap-1.5 text-accent">
          <Calendar size={16} />
          <span>{data.date}</span>
        </div>
      </CardContent>

      <CardFooter className="text-sm text-secondary">
        <Icon />
      </CardFooter>
    </Card>
  );
}

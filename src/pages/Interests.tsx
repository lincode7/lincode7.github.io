import { Film, Gamepad, Music, Plane } from "lucide-react";
import MetaTags from "../components/seo/MetaTags";
import InterestCard from "../components/ui/InterestCard";
import { interestsAPI } from "../utils/api/interests";
import { createSuspenseResource } from "../utils/suspense";

const recentActivitiesResource = createSuspenseResource(
  interestsAPI.getRecentActivities
);

export default function Interests() {
  const recentActivities = recentActivitiesResource.read();

  const icon = {
    game: Gamepad,
    movie: Film,
    music: Music,
    travel: Plane,
  };

  return (
    <>
      <MetaTags
        title="兴趣主页 - 游戏、电影、音乐与旅行"
        description="记录生活足迹"
      />

      <div className="container mx-auto px-4 py-8 animate-slide-up">
        {/* 近期活动 */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
          {recentActivities.map((activity, index) => (
            <InterestCard
              key={index}
              icon={icon[activity.type as keyof typeof icon]}
              data={activity}
            />
          ))}
        </div>
      </div>
    </>
  );
}

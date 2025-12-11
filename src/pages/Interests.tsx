import { Film, Gamepad2, Music, Plane } from "lucide-react";
import MetaTags from "../components/seo/MetaTags";
import { Card } from "../components/ui/Card";
import { interestsAPI } from "../utils/api";
import { createSuspenseResource } from "../utils/suspense";

const statsResource = createSuspenseResource(interestsAPI.getStats);
const recentActivitiesResource = createSuspenseResource(
  interestsAPI.getRecentActivities
);
export default function Interests() {
  const stats = statsResource.read();

  const recentActivities = recentActivitiesResource.read();

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number;
    color: string;
  }) => (
    <Card className={`border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={32} className={`text-${color}-500`} />
      </div>
    </Card>
  );

  return (
    <>
      <MetaTags
        title="兴趣主页 - 游戏、电影、音乐与旅行"
        description="记录我的兴趣生活：游戏、电影、音乐欣赏和旅行足迹"
      />

      <div className="container mx-auto px-4 py-8 animate-slide-up">
        <div className="flex flex-col-left mb-6">
          <h1 className="mb-2">兴趣主页</h1>
          <p>记录生活中的美好瞬间和兴趣爱好</p>
        </div>
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Gamepad2}
            label="游戏数量"
            value={stats.games}
            color="blue"
          />
          <StatCard
            icon={Film}
            label="观影数量"
            value={stats.movies}
            color="green"
          />
          <StatCard
            icon={Music}
            label="音乐收藏"
            value={stats.music}
            color="purple"
          />
          <StatCard
            icon={Plane}
            label="旅行地点"
            value={stats.travel}
            color="orange"
          />
        </div>

        {/* 近期活动 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentActivities.map((activity, index) => (
            <Card key={index} className="overflow-hidden">
              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {activity.type === "game" && <Gamepad2 size={18} />}
                  {activity.type === "movie" && <Film size={18} />}
                  {activity.type === "music" && <Music size={18} />}
                  {activity.type === "travel" && <Plane size={18} />}
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {activity.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

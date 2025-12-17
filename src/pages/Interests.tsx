import MetaTags from "../components/seo/MetaTags";
import InterestCard from "../components/ui/InterestCard";
import { interestsAPI } from "../utils/api/interests";
import { createSuspenseResource } from "../utils/suspense";

const interestsResource = createSuspenseResource(interestsAPI.getList);

export default function Interests() {
  const interests = interestsResource.read();

  return (
    <>
      <MetaTags title="Footmarks" description="记录生活足迹" />

      <div className="page">
        {/* 近期活动 */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          {interests.map((activity, index) => (
            <InterestCard key={index} data={activity} />
          ))}
        </div>
      </div>
    </>
  );
}

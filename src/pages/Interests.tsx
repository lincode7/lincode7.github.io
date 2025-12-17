import { useState } from "react";
import { useOnInView } from "react-intersection-observer";
import MetaTags from "../components/seo/MetaTags";
import InterestCard from "../components/ui/InterestCard";
import { interestsAPI } from "../utils/api/interests";
import { createSuspenseResource } from "../utils/suspense";

const interestsResource = createSuspenseResource(interestsAPI.getList);

export default function Interests() {
  const [interests, setInterests] = useState(() => interestsResource.read());
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = () => {
    const nextPage = page + 1;
    const data = interestsResource.read(nextPage);
    setHasMore(data.length !== 0);
    setInterests((prev) => [...prev, ...data]);
    setPage(nextPage);
  };

  const ref = useOnInView(
    (inView) => {
      if (inView && hasMore) {
        loadMore();
      }
    },
    {
      threshold: 0.1,
    }
  );

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

        <div className="flex-center mt-10">
          <p ref={ref} className="font-semibold text-foreground/50">
            {hasMore ? "滑动加载更多" : "到底了"}
          </p>
        </div>
      </div>
    </>
  );
}

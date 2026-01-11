import { useState } from "react";
import { useOnInView } from "react-intersection-observer";
import { cn, debounce } from "../../utils/helper";
import LoadingSpinner from "./LoadingSpinner";

export default function InfiniteList<T>({
  loadMore,
  direction = "col",
}: {
  loadMore: () => {
    data: T[];
    hasMore: boolean;
  };
  direction?: "row" | "col";
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const ref = useOnInView(
    (inView) => {
      if (inView && hasMore) {
        debounce(() => {
          setLoading(true);
          const list2 = loadMore();
          setData((prev) => [...prev, ...list2.data]);
          setHasMore(list2.hasMore);
          setLoading(false);
        }, 200);
      }
    },
    {
      threshold: 0.5,
    }
  );

  return (
    <ul
      className={cn(
        "h-500",
        direction == "col"
          ? "flex-col overflow-y-auto"
          : "flex-row overflow-x-auto",
        "flex gap-3 scroll-smooth md:[&::-webkit-scrollbar]:hidden"
      )}
    >
      {...data.map((item) => (
        <div
          className={cn(
            "bg-amber-300 flex items-center justify-center",
            direction == "col" ? "min-h-1/5" : "min-w-1/3 aspect-auto"
          )}
        >
          <p>{JSON.stringify(item)}</p>
        </div>
      ))}

      {loading && <LoadingSpinner />}
      {!loading && <p ref={ref}>{hasMore ? "滑动加载更多" : "到底了"}</p>}
    </ul>
  );
}

import type { Interest, InterestIndex } from "../../types/interests";
import { isRecent } from "../helper";

// 兴趣相关API
export const interestsAPI = {
  // 获取近期活动
  async getRecentInterests(): Promise<Interest[]> {
    const { recentID } = loadInterestPath();
    if (recentID) {
      const ids = [...recentID];
      return fetchByID(ids);
    }

    const sorted = await fetchAll();
    return updateIndex(sorted, { recent: true }).recentPosts;
  },

  // 按类型获取兴趣项目
  async getInterests(
    page = 1,
    limit = 10,
    type?: string
  ): Promise<{
    data: Interest[];
    hasMore: boolean;
  }> {
    const start = (page - 1) * limit;
    const end = start + limit;

    const { sortedID, idByType } = loadInterestPath();

    if (type) {
      if (idByType) {
        return {
          data: await fetchByID(idByType[type].slice(start, end)),
          hasMore: end > idByType[type].length,
        };
      }

      const sorted = await fetchAll();
      const result = updateIndex(sorted, { type }).typePosts;
      return {
        data: result!.slice(start, end) as Interest[],
        hasMore: end > result!.length,
      };
    }

    if (sortedID) {
      return {
        data: await fetchByID(sortedID.slice(start, end)),
        hasMore: end > sortedID.length,
      };
    }

    const sorted = await fetchAll();
    updateIndex(sorted);
    return {
      data: sorted.slice(start, end),
      hasMore: end > sorted.length,
    };
  },
};

const updateIndex = (
  sorted: Interest[],
  option?: {
    recent?: boolean;
    type?: string;
  }
) => {
  const [indexRecent, recentPosts] = updateRecent(
    new Date(sorted[0].date),
    option?.recent
  );
  const [indexTtype, typePosts] = updateByType(option?.type);
  sorted.forEach((interest) => {
    indexRecent(interest);
    indexTtype(interest);
  });
  return {
    recentPosts,
    typePosts,
  };
};

const updateByType = (type?: string): [indexFn, Interest[]] => {
  const byType: Interest[] = [];
  const index = loadInterestPath();
  index.idByType ??= {};
  return [
    (interest) => {
      type && interest.type === type && byType.push(interest);
      index.idByType![interest.type] ??= [];
      index.idByType![interest.type].push(interest.id);
    },
    byType,
  ];
};

const updateRecent = (
  recentDate: Date,
  getReccent = false
): [indexFn, Interest[]] => {
  const recent: Interest[] = [];
  const index = loadInterestPath();
  index.recentID ??= new Set();
  return [
    (interest) => {
      if (!isRecent(new Date(interest.date), recentDate)) return;
      getReccent && recent.push(interest);
      index.recentID!.add(interest.id);
    },
    recent,
  ];
};

type indexFn = (post: Interest) => void;

const fetchByID = async (ids: string[]): Promise<Interest[]> => {
  const { pathByID } = loadInterestPath();
  const paths = ids.map((id) => pathByID[id]);
  const result = (await Promise.all(paths.map(fetchJSON))).flat();
  const filter = new Set(ids);
  return sortByDateAndTitle(result.filter((i) => filter.has(i.id)));
};

const fetchAll = async (): Promise<Interest[]> => {
  const index = loadInterestPath();
  const path = Object.keys(index.paths);
  const all = (await Promise.all(path.map(fetchJSON))).flat();
  const sorted = sortByDateAndTitle(all);

  index.sortedID = sorted.map((i) => i.id);

  return sorted;
};

const sortByDateAndTitle = (arr: Interest[]): Interest[] =>
  arr.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      b.title.localeCompare(a.title)
  );

const fetchJSON = async (path: string): Promise<Interest | Interest[]> => {
  const { paths, pathByID } = loadInterestPath();
  const meta = paths[path];
  const response = await fetch(path);
  const items = await response.json();

  if (Array.isArray(items)) {
    return items.map((item, index) => {
      const id = `${meta.id}_${index}`;
      pathByID[id] ??= path;
      return {
        ...meta,
        id,
        ...item,
      };
    });
  }

  return {
    ...meta,
    ...items,
  };
};

const loadInterestPath = (() => {
  const index: InterestIndex = { paths: {}, pathByID: {} };
  let loaded = false;

  return () => {
    if (loaded) return index;

    for (const original_path in import.meta.glob("/public/interests/*/*.json", {
      query: "?url",
    })) {
      const path = original_path.replace(/^\/public/, "");
      const match = path.match(/\/interests\/([^\/]+)\/([^\/]+)\.json$/);
      if (match) {
        const [, type, id] = match;
        index.paths[path] = { id, type };
        index.pathByID[id] = path;
      }
    }

    loaded = true;
    return index;
  };
})();

import type { Interest, InterestIndex } from "../../types/interests";
import { isRecent } from "./posts";

// 兴趣相关API
export const interestsAPI = {
  // 获取近期活动
  async getRecentInterests(): Promise<Interest[]> {
    const { recentID } = loadInterestPath();
    if (recentID?.size) return fetchRecent();

    const sorted = await fetchAll();
    return updateRecent(sorted);
  },

  // 按类型获取兴趣项目
  async getList(page = 1, limit = 10, type?: string): Promise<Interest[]> {
    const start = (page - 1) * limit;
    const end = start + limit;

    const { sortedID, idByType } = loadInterestPath();

    if (type) {
      if (idByType) return fetchByID(idByType[type].slice(start, end));

      const sorted = await fetchAll();
      return updateByType(sorted, type)!.slice(start, end) as Interest[];
    }

    if (sortedID) return fetchByID(sortedID.slice(start, end));

    const sorted = await fetchAll();
    updateByType(sorted);
    return sorted.slice(start, end);
  },
};

const updateByType = (sorted: Interest[], type?: string) => {
  const byType: Interest[] = [];
  const index = loadInterestPath();
  index.idByType ??= {};
  sorted.forEach((i) => {
    type && i.type === type && byType.push(i);
    index.idByType![i.type] ??= [];
    index.idByType![i.type].push(i.id);
  });
  return type && byType;
};

const fetchRecent = async (): Promise<Interest[]> => {
  const { recentID, pathByID } = loadInterestPath();
  const recentPath = [...new Set([...recentID!].map((id) => pathByID[id]))];
  const result = (await Promise.all(recentPath.map(fetchJSON))).flat();
  return sortByDateAndTitle(result.filter((i) => recentID!.has(i.id)));
};

const updateRecent = (sorted: Interest[]): Interest[] => {
  const recentDate = new Date(sorted[0].date);
  const recent = sorted.filter((interest) =>
    isRecent(new Date(interest.date), recentDate)
  );

  const index = loadInterestPath();
  index.recentID ??= new Set();
  recent.forEach((i) => index.recentID!.add(i.id));

  return recent;
};

const fetchByID = async (ids: string[]): Promise<Interest[]> => {
  const { pathByID } = loadInterestPath();
  const paths = ids.map((id) => pathByID[id]);
  const result = (await Promise.all(paths.map(fetchJSON))).flat();
  const filter = new Set(ids);
  return sortByDateAndTitle(result.filter((i) => filter.has(i.id)));
};

const fetchAll = async (): Promise<Interest[]> => {
  const index = loadInterestPath();
  const sorted = sortByDateAndTitle(
    (await Promise.all(Object.keys(index.paths).map(fetchJSON))).flat()
  );

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

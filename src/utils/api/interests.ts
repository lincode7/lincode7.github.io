import type {
  Interest,
  InterestIndex,
  InterestRepo,
} from "../../types/interests";
import { isRecent } from "./posts";

// 兴趣相关API
export const interestsAPI = {
  // 获取兴趣类型统计
  async getTypeStats(): Promise<Record<string, number>> {
    const { index } = await generateInterestRepo();
    const typeStats: Record<string, number> = {};
    Object.entries(index.byType).map(
      ([name, orders]) => (typeStats[name] = orders.length)
    );
    return typeStats;
  },

  // 获取近期活动
  async getRecentActivities(): Promise<Interest[]> {
    const { data } = await generateInterestRepo();

    const recentDate = new Date(data[0].date);
    return data.filter((interest) =>
      isRecent(new Date(interest.date), recentDate)
    );
  },

  // 按类型获取兴趣项目
  async getByType(type: string, page = 1, limit = 10): Promise<Interest[]> {
    const { data, index } = await generateInterestRepo();
    const { byType } = index;

    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;

    return byType[type].slice(start, end).map((i) => data[i]);
  },
};

let interestRepo: Promise<InterestRepo>;

async function loadInterests(): Promise<Interest[]> {
  const interests = import.meta.glob("/content/interests/**/*.json", {
    query: "?raw", // 作为原始文本，而不是模块
    import: "default", // 明确指定导入默认导出
  });
  const filePaths = Object.keys(interests);

  const all = filePaths.map(async (path) => {
    const match = path.match(
      /^\/content\/interests\/([^\/]+?)\/([^\/]+?)\.json$/
    );
    if (!match || match.length < 3) return null;

    const [_, type, id] = match;
    const fileContent = await interests[path]();

    return {
      id,
      type,
      ...JSON.parse(fileContent as string),
    } as Interest;
  });

  const result = await Promise.all(all);

  return result
    .filter((i) => i != null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function generateInterestRepo() {
  if (interestRepo) return interestRepo;

  interestRepo = (async () => {
    const data = await loadInterests();

    // 生成索引并统计数据
    const index: InterestIndex = {
      byID: {},
      byType: {},
    };

    data.forEach((interest, order) => {
      index.byID[interest.id] = order;

      index.byType[interest.type] ??= [];
      index.byType[interest.type].push(order);
    });

    return {
      data,
      index,
    };
  })();

  return interestRepo;
}

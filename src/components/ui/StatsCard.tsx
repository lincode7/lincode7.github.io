// 统计卡片
interface StatCardProps {
  icon: any;
  title: string;
  value: number;
  description: string;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  title,
  value,
  description,
  className,
}: StatCardProps) {
  return (
    <div className={`card hover-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {description}
          </p>
        </div>
        <Icon size={24} />
      </div>
    </div>
  );
}

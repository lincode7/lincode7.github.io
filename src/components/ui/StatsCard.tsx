import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Card";

// 统计卡片
interface StatCardProps {
  icon: any;
  title: string;
  value: number;
  description?: string;
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
    <Card className={`${className}`}>
      <CardHeader className="flex-between space-x-1.5">
        <CardTitle className="m-0">{title}</CardTitle>
        <Icon size={24} />
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardContent>

      {description && <CardDescription>{description}</CardDescription>}
    </Card>
  );
}

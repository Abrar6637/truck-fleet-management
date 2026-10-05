import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = "neutral",
}: StatCardProps) {
  const trendClasses = {
    positive: "text-(--success)",
    negative: "text-(--danger)",
    neutral: "text-(--text-muted)",
  };

  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-(--text-muted)">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-(--text)">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={21} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold ${trendClasses[trendType]}`}>
              {trend}
            </span>
          )}

          {subtitle && (
            <span className="text-(--text-muted)">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
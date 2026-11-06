
import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  change?: number;
  comparisonText?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-green-light",
  iconColor = "text-primary",
  change,
  comparisonText = "from last month",
  changeType = "positive",
}: StatCardProps) {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <article className="min-w-0 rounded-xl border border-white/80 bg-white/80 p-4 shadow-(--shadow-card) backdrop-blur-sm transition-shadow hover:shadow-(--shadow-modal) sm:p-5">
      {/* Icon + Title + Value */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-secondary">
            {title}
          </p>

          <p className="mt-1 truncate text-2xl font-bold leading-none tracking-tight text-text-primary">
            {typeof value === "number"
              ? value.toLocaleString("en-US")
              : value}
          </p>
        </div>
      </div>

      {/* Growth indicator */}
      {change !== undefined && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 pl-1">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              isPositive
                ? "text-success"
                : isNegative
                  ? "text-error"
                  : "text-text-secondary"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={14} />
            ) : isNegative ? (
              <TrendingDown size={14} />
            ) : null}

            {change > 0 ? "+" : ""}
            {change}%
          </span>

          <span className="text-xs text-text-muted">
            {comparisonText}
          </span>
        </div>
      )}
    </article>
  );
}

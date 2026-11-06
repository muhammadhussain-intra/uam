"use client";

import Chart from "@/components/dashboard/Chart";
import type { LoginAttemptItem } from "../actions/dashboard";

const loginAttemptOptions = [
  { label: "Daily (Last 7 days)", value: "daily" },
  { label: "Monthly (Last 6 months)", value: "monthly" },
];

interface Props {
  data: LoginAttemptItem[];
  period: "daily" | "monthly";
  loading: boolean;
  onPeriodChange: (period: "daily" | "monthly") => void;
}

export default function LoginAttemptsChart({
  data,
  period,
  loading,
  onPeriodChange,
}: Props) {
  const chartData = data.map((item) => ({
    date: new Date(item.period).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(period === "monthly" ? { year: "2-digit" } : {}),
    }),
    successful: item.success,
    failed: item.failed,
  }));

  return (
    <div className="relative flex min-w-0 flex-col">
      <Chart
        type="bar"
        title="Login Attempts"
        description="Successful vs failed login attempts over time"
        data={chartData}
        xKey="date"
        series={[
          {
            dataKey: "successful",
            label: "Successful",
            color: "#16834A",
          },
          {
            dataKey: "failed",
            label: "Failed",
            color: "#BE2E2E",
          },
        ]}
        period={period}
        onPeriodChange={(value) =>
          onPeriodChange(value as "daily" | "monthly")
        }
        periodOptions={loginAttemptOptions}
        height={360}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
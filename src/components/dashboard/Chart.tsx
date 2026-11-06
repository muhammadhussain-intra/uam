"use client";

import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Area,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Select from "@/components/ui/Select";

export type ChartData = Record<string, string | number>;

export type ChartSeries = {
  dataKey: string;
  label: string;
  color?: string;
};

type PeriodOption = {
  label: string;
  value: string;
};

type ChartProps = {
  type: "line" | "area" | "bar" | "pie" | "donut";
  title: string;
  description?: string;
  data: ChartData[];

  // Line, Area and Bar
  xKey?: string;
  series?: ChartSeries[];

  // Pie and Donut
  nameKey?: string;
  valueKey?: string;
  centerValue?: string | number;
  centerLabel?: string;

  // Appearance
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];

  // Parent-controlled dropdown
  period?: string;
  periodOptions?: PeriodOption[];
  onPeriodChange?: (value: string) => void;
  className?: string;
};

const DEFAULT_COLORS = [
  "#16834A",
  "#20B65A",
  "#6BCFA5",
  "#F4C542",
  "#A8B8AE",
];

export default function Chart({
  type,
  title,
  description,
  data,
  xKey = "name",
  series = [],
  nameKey = "name",
  valueKey = "value",
  centerValue,
  centerLabel = "Total",
  height = 260,
  showLegend = true,
  showGrid = true,
  colors = DEFAULT_COLORS,
  period,
  periodOptions = [],
  onPeriodChange,
  className = "",
}: ChartProps) {
  const isPie = type === "pie" || type === "donut";

  const total = (data || []).reduce(
    (sum, item) => sum + Number(item[valueKey] ?? 0),
    0,
  );

  const formatNumber = (value: string | number) =>
    typeof value === "number" ? value.toLocaleString() : value;

  const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid #DCE5DE",
    fontSize: 12,
  };

  const hasData = Array.isArray(data) && data.length > 0;
  const hasHeader = Boolean(title || description || periodOptions.length > 0);

  return (
    <section
      className={`bg-white min-w-0 rounded-xl border border-border-default bg-surface-card p-4 shadow-card sm:p-5 flex flex-col ${className}`}
    >
      {hasHeader && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 shrink-0">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-text-primary">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-xs text-text-secondary">
                {description}
              </p>
            )}
          </div>

          {periodOptions.length > 0 && (
            <div className="w-full sm:w-auto">
              <Select
                aria-label={`${title} time period`}
                value={period ?? periodOptions[0].value}
                onChange={(event) => onPeriodChange?.(event.target.value)}
                selectSize="sm"
                options={periodOptions}
                className="min-w-[145px]"
              />
            </div>
          )}
        </div>
      )}

      <div
        className="relative w-full flex-1 min-h-0"
        style={{ minHeight: height, height: "100%" }}
      >
        {!hasData ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary">
            No chart data available.
          </div>
        ) : (
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              {isPie ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    innerRadius={type === "donut" ? "58%" : 0}
                    outerRadius="85%"
                    paddingAngle={type === "donut" ? 2 : 0}
                    stroke="none"
                  >
                    {data.map((item, index) => (
                      <Cell
                        key={String(item[nameKey]) + index}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      formatNumber(Number(value ?? 0)),
                      String(name),
                    ]}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              ) : type === "bar" ? (
                <BarChart
                  data={data}
                  margin={{ top: 4, right: 6, left: -20, bottom: 0 }}
                >
                  {showGrid && (
                    <CartesianGrid
                      vertical={false}
                      stroke="#DCE5DE"
                    />
                  )}

                  <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#89948D" }}
                    tickMargin={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#89948D" }}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  {showLegend && <Legend />}

                  {series.map((item, index) => (
                    <Bar
                      key={item.dataKey}
                      dataKey={item.dataKey}
                      name={item.label}
                      fill={item.color ?? colors[index % colors.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 4, right: 6, left: -20, bottom: 0 }}
                >
                  {showGrid && (
                    <CartesianGrid
                      vertical={false}
                      stroke="#DCE5DE"
                    />
                  )}

                  <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#89948D" }}
                    tickMargin={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#89948D" }}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  {showLegend && <Legend />}

                  {type === "line" &&
                    series.map((item, index) => (
                      <Line
                        key={item.dataKey}
                        type="monotone"
                        dataKey={item.dataKey}
                        name={item.label}
                        stroke={item.color ?? colors[index % colors.length]}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    ))}

                  {type === "area" &&
                    series.map((item, index) => (
                      <Area
                        key={item.dataKey}
                        type="monotone"
                        dataKey={item.dataKey}
                        name={item.label}
                        stroke={item.color ?? colors[index % colors.length]}
                        fill={item.color ?? colors[index % colors.length]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {hasData && type === "donut" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-text-primary">
              {formatNumber(centerValue ?? total)}
            </span>
            <span className="text-xs text-text-secondary">
              {centerLabel}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

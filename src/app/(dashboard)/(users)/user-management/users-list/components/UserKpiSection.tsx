
import KpiCard from "@/components/dashboard/KpiCard";

import { userKpiConfig } from "../users.constants";
import type { userStatistics } from "../data/mockUsers";

interface UserKpiSectionProps {
  statistics: typeof userStatistics;
}

export default function UserKpiSection({
  statistics,
}: UserKpiSectionProps) {
  const kpiItems = [
    {
      ...userKpiConfig[0],
      ...statistics.totalUsers,
    },
    {
      ...userKpiConfig[1],
      ...statistics.activeUsers,
    },
    {
      ...userKpiConfig[2],
      ...statistics.deviceBound,
    },
    {
      ...userKpiConfig[3],
      ...statistics.mfaEnabled,
    },
  ];

  return (
    <section
      aria-label="User statistics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpiItems.map((item) => {
        const Icon = item.icon;

        return (
          <KpiCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={<Icon size={20} />}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            change={item.change}
            comparisonText="from last month"
            changeType={item.changeType}
          />
        );
      })}
    </section>
  );
}

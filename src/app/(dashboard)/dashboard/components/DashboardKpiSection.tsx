import {
  Users,
  UserCheck,
  ShieldAlert,
  LogIn,
  Loader2,
} from "lucide-react";

import KpiCard from "@/components/dashboard/KpiCard";
import type { DashboardSummary } from "../actions/dashboard";

interface Props {
  stats: DashboardSummary | null;
  loading: boolean;
}

export default function DashboardKpiSection({
  stats,
  loading,
}: Props) {
  const cards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      icon: <Users size={19} />,
    },
    {
      title: "Active Users",
      value: stats?.active_users ?? 0,
      icon: <UserCheck size={19} />,
    },
    {
      title: "Locked Users",
      value: stats?.locked_users ?? 0,
      icon: <ShieldAlert size={19} />,
    },
    {
      title: "Today's Logins",
      value: stats?.today_logins ?? 0,
      icon: <LogIn size={19} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-28 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={25} />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </section>
  );
}
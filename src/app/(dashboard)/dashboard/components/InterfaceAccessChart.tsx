import Chart from "@/components/dashboard/Chart";
import type { InterfaceAccessItem } from "../actions/dashboard";

interface Props {
  data: InterfaceAccessItem[];
  loading: boolean;
}

export default function InterfaceAccessChart({
  data,
  loading,
}: Props) {
  const chartData = data.map((item) => ({
    interface: item.interface_name,
    accesses: item.user_count,
  }));

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <Chart
        type="bar"
        title="Interface-wise Access"
        description="Users with access across interfaces"
        data={chartData}
        xKey="interface"
        series={[
          {
            dataKey: "accesses",
            label: "Users",
            color: "#20B65A",
          },
        ]}
        height={150}
        className="h-full flex-1"
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
import Chart from "@/components/dashboard/Chart";
import type { UserRoleItem } from "../actions/dashboard";

interface Props {
  data: UserRoleItem[];
  loading: boolean;
}

const roleColors = [
  "#16834A",
  "#20B65A",
  "#6BCFA5",
  "#F4C542",
  "#A8B8AE",
];

export default function UsersByRoleChart({
  data,
  loading,
}: Props) {
  const chartData = data.map((item) => ({
    role: item.role_name,
    users: item.user_count,
  }));

  const totalUsers = chartData.reduce(
    (total, item) => total + item.users,
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-border-default bg-white">
        <span className="animate-spin">
          <span className="block h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-text-primary">
          Users by Role
        </h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Distribution of users across roles
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(120px,1fr)_minmax(110px,1fr)]">
        <Chart
          type="donut"
          title=""
          data={chartData}
          nameKey="role"
          valueKey="users"
          centerValue={totalUsers}
          centerLabel="Total Users"
          showLegend={false}
          colors={roleColors}
          height={150}
          className="border-0 bg-transparent p-0 shadow-none"
        />

        <div className="space-y-2">
          {chartData.map((role, index) => (
            <div
              key={role.role}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[10px]"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      roleColors[index % roleColors.length],
                  }}
                />
                <span className="truncate">{role.role}</span>
              </span>

              <span className="text-text-secondary">
                <strong className="mr-1 text-text-primary">
                  {role.users.toLocaleString()}
                </strong>
                {totalUsers
                  ? `${((role.users / totalUsers) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
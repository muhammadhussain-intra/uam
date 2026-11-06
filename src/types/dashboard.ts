export type LoginAttemptData = {
  date: string;
  successful: number;
  failed: number;
};

export type InterfaceAccessData = {
  interface: string;
  accesses: number;
};

export type LoginHistoryStatus = "Success" | "Failed";

export type LoginHistoryRecord = {
  id: string;
  userId: string;
  user: string;
  interface: "Web Portal" | "Mobile App" | "Admin Portal" | "API Client";
  ipAddress: string;
  loginTime: string;
  status: LoginHistoryStatus;
  failureReason: string | null;
};

export type KpiStatData = {
  title: string;
  value: number;
  change: number;
  comparisonText: string;
  iconType: "users" | "activeUsers" | "device" | "shield";
  iconBg: string;
  iconColor: string;
};

export type RoleDistributionData = {
  role: string;
  users: number;
};

export type UserGrowthData = {
  month: string;
  active: number;
  total: number;
};

export type DashboardMockData = {
  kpiStats: KpiStatData[];
  rolesData: RoleDistributionData[];
  growthData: UserGrowthData[];
  dailyLoginAttempts: LoginAttemptData[];
  monthlyLoginAttempts: LoginAttemptData[];
  interfaceAccess: InterfaceAccessData[];
  loginHistory: LoginHistoryRecord[];
};

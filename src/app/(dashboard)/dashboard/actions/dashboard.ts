import axiosInstance from "@/lib/axiosInstance";

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface DashboardSummary {
  total_users: number;
  active_users: number;
  locked_users: number;
  today_logins: number;
}

export interface UserRoleItem {
  role_code: string;
  role_name: string;
  user_count: number;
}

export interface UsersByRoleResponse {
  chart: string;
  series: UserRoleItem[];
}

export interface LoginAttemptItem {
  period: string;
  success: number;
  failed: number;
  total: number;
}

export interface LoginAttemptsResponse {
  period: "daily" | "monthly";
  series: LoginAttemptItem[];
}

export interface InterfaceAccessItem {
  interface_code: string;
  interface_name: string;
  role_count: number;
  user_count: number;
}

export interface InterfaceAccessResponse {
  series: InterfaceAccessItem[];
}

export interface LoginHistoryItem {
  id: number;
  timestamp: string;
  result: "success" | "failed";
  event_type: string;
  login: string;
  user_code: string;
  display_name: string;
  client_ip: string;
  device_type: string;
  failure_reason: string | null;
}

export interface LoginHistoryParams {
  page?: number;
  size?: number;
  user?: string;
  result?: "success" | "failed";
  from?: string;
  to?: string;
}

export interface LoginHistoryResponse {
  items: LoginHistoryItem[];
  page?: number;
  size?: number;
  total?: number;
  total_pages?: number;
  pagination?: {
    page?: number;
    size?: number;
    total?: number;
    total_pages?: number;
  };
}

// 1. Dashboard Summary
export async function getDashboardSummary() {
  const response = await axiosInstance.get<
    ApiResponse<DashboardSummary>
  >("/dashboard/summary");

  return response.data.data;
}

// 2. Users By Role
export async function getUsersByRole() {
  const response = await axiosInstance.get<
    ApiResponse<UsersByRoleResponse>
  >("/dashboard/users-by-role");

  return response.data.data;
}

// 3. Login Attempts
export async function getLoginAttempts(
  period: "daily" | "monthly" = "daily",
) {
  const response = await axiosInstance.get<
    ApiResponse<LoginAttemptsResponse>
  >("/dashboard/login-attempts", {
    params: { period },
  });

  return response.data.data;
}

// 4. Interface Access
export async function getInterfaceAccess() {
  const response = await axiosInstance.get<
    ApiResponse<InterfaceAccessResponse>
  >("/dashboard/interface-access");

  return response.data.data;
}

// 5. Login History
export async function getLoginHistory(
  params: LoginHistoryParams = {},
) {
  const response = await axiosInstance.get<
    ApiResponse<LoginHistoryResponse>
  >("/dashboard/login-history", {
    params: {
      page: params.page ?? 1,
      size: params.size ?? 20,
      ...(params.user?.trim() && {
        user: params.user.trim(),
      }),
      ...(params.result && {
        result: params.result,
      }),
      ...(params.from && {
        from: params.from,
      }),
      ...(params.to && {
        to: params.to,
      }),
    },
  });

  return response.data.data;
}
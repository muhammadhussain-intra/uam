"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  getDashboardSummary,
  getUsersByRole,
  getLoginAttempts,
  getInterfaceAccess,
  getLoginHistory,
  type DashboardSummary,
  type UserRoleItem,
  type LoginAttemptItem,
  type InterfaceAccessItem,
  type LoginHistoryItem,
} from "../actions/dashboard";

import {
  rolesData,
  dailyLoginAttempts,
  monthlyLoginAttempts,
  interfaceAccessData,
  loginHistoryData,
} from "../data/mockDashboard";

import DashboardKpiSection from "./DashboardKpiSection";
import LoginAttemptsChart from "./LoginAttemptsChart";
import UsersByRoleChart from "./UsersByRoleChart";
import InterfaceAccessChart from "./InterfaceAccessChart";
import LoginHistoryTable from "./LoginHistoryTable";

type LoginPeriod = "daily" | "monthly";
type LoginResult = "all" | "success" | "failed";

const PAGE_SIZE = 20;

/* --------------------------------------------------
   MOCK DATA MAPPING
-------------------------------------------------- */

// Sample fallback values for Dashboard Summary.
// Replace these with actual values if you have a summary mock.
const MOCK_SUMMARY: DashboardSummary = {
  total_users: 1245,
  active_users: 1082,
  locked_users: 163,
  today_logins: 142,
};

const MOCK_ROLES: UserRoleItem[] = rolesData.map((item) => ({
  role_code: item.role.toUpperCase(),
  role_name: item.role,
  user_count: item.users,
}));

const MOCK_INTERFACES: InterfaceAccessItem[] =
  interfaceAccessData.map((item) => ({
    interface_code: item.interface
      .toUpperCase()
      .replace(/\s+/g, "_"),
    interface_name: item.interface,
    role_count: 0,
    user_count: item.accesses,
  }));

const MOCK_HISTORY: LoginHistoryItem[] = loginHistoryData.map(
  (item) => ({
    id: Number(item.id.replace("LOG-", "")),
    timestamp: item.loginTime,
    result: item.status.toLowerCase() as "success" | "failed",
    event_type: "LOGIN",
    login: item.user,
    user_code: item.userId,
    display_name: item.user,
    client_ip: item.ipAddress,
    device_type: item.interface,
    failure_reason: item.failureReason,
  }),
);

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

// Convert mock login attempts into API response format.
function getMockLoginAttempts(
  period: LoginPeriod,
): LoginAttemptItem[] {
  const mockData =
    period === "daily"
      ? dailyLoginAttempts
      : monthlyLoginAttempts;

  return mockData.map((item) => ({
    period: item.date,
    success: item.successful,
    failed: item.failed,
    total: item.successful + item.failed,
  }));
}

// Convert mock timestamp into a Date.
// Mock format: 28-Oct-26, 03:42 PM
function parseMockDate(value: string): Date | null {
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const match = value.match(
    /^(\d{1,2})-([A-Za-z]{3})-(\d{2}),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );

  if (!match) return null;

  const [, day, month, year, hour, minute, meridiem] =
    match;

  const monthIndex = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ].indexOf(month.toLowerCase());

  if (monthIndex === -1) return null;

  let hours = Number(hour);

  if (meridiem.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(
    2000 + Number(year),
    monthIndex,
    Number(day),
    hours,
    Number(minute),
  );
}

function filterMockHistory({
  user,
  result,
  from,
  to,
}: {
  user: string;
  result: LoginResult;
  from: string;
  to: string;
}) {
  const search = user.trim().toLowerCase();

  return MOCK_HISTORY.filter((item) => {
    const matchesUser =
      !search ||
      item.login.toLowerCase().includes(search) ||
      item.user_code.toLowerCase().includes(search) ||
      item.display_name.toLowerCase().includes(search);

    const matchesResult =
      result === "all" || item.result === result;

    const itemDate = parseMockDate(item.timestamp);

    const matchesFrom =
      !from ||
      (itemDate !== null &&
        itemDate >= new Date(`${from}T00:00:00`));

    const matchesTo =
      !to ||
      (itemDate !== null &&
        itemDate <= new Date(`${to}T23:59:59.999`));

    return (
      matchesUser &&
      matchesResult &&
      matchesFrom &&
      matchesTo
    );
  });
}

/* --------------------------------------------------
   COMPONENT
-------------------------------------------------- */

export default function DashboardOverview() {
  // This ref ensures only one fallback toast per mount.
  const mockToastShown = useRef(false);

  function showMockDataToast() {
    if (mockToastShown.current) return;

    mockToastShown.current = true;

    toast.warning("Access denied. Using mock data.", {
      id: "dashboard-mock-data",
    });
  }

  // Dashboard data
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [roles, setRoles] = useState<UserRoleItem[]>([]);
  const [loginAttempts, setLoginAttempts] =
    useState<LoginAttemptItem[]>([]);
  const [interfaceAccess, setInterfaceAccess] =
    useState<InterfaceAccessItem[]>([]);
  const [history, setHistory] =
    useState<LoginHistoryItem[]>([]);

  // Login attempts chart period
  const [loginPeriod, setLoginPeriod] =
    useState<LoginPeriod>("daily");

  // Independent loading states
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [interfaceLoading, setInterfaceLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Login history pagination
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Login history filters
  const [user, setUser] = useState("");
  const [result, setResult] = useState<LoginResult>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* -----------------------------------------------
     1. DASHBOARD SUMMARY
  ----------------------------------------------- */

  useEffect(() => {
    let active = true;

    async function fetchSummary() {
      setSummaryLoading(true);

      try {
        const data = await getDashboardSummary();

        if (active) {
          setSummary(data);
        }
      } catch {
        if (active) {
          setSummary(MOCK_SUMMARY);
          showMockDataToast();
        }
      } finally {
        if (active) {
          setSummaryLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      active = false;
    };
  }, []);

  /* -----------------------------------------------
     2. USERS BY ROLE
  ----------------------------------------------- */

  useEffect(() => {
    let active = true;

    async function fetchRoles() {
      setRolesLoading(true);

      try {
        const data = await getUsersByRole();

        if (active) {
          setRoles(data.series ?? []);
        }
      } catch {
        if (active) {
          setRoles(MOCK_ROLES);
          showMockDataToast();
        }
      } finally {
        if (active) {
          setRolesLoading(false);
        }
      }
    }

    fetchRoles();

    return () => {
      active = false;
    };
  }, []);

  /* -----------------------------------------------
     3. LOGIN ATTEMPTS
  ----------------------------------------------- */

  useEffect(() => {
    let active = true;

    async function fetchAttempts() {
      setAttemptsLoading(true);

      try {
        const data = await getLoginAttempts(loginPeriod);

        if (active) {
          setLoginAttempts(data.series ?? []);
        }
      } catch {
        if (active) {
          setLoginAttempts(getMockLoginAttempts(loginPeriod));
          showMockDataToast();
        }
      } finally {
        if (active) {
          setAttemptsLoading(false);
        }
      }
    }

    fetchAttempts();

    return () => {
      active = false;
    };
  }, [loginPeriod]);

  /* -----------------------------------------------
     4. INTERFACE ACCESS
  ----------------------------------------------- */

  useEffect(() => {
    let active = true;

    async function fetchInterfaceAccess() {
      setInterfaceLoading(true);

      try {
        const data = await getInterfaceAccess();

        if (active) {
          setInterfaceAccess(data.series ?? []);
        }
      } catch {
        if (active) {
          setInterfaceAccess(MOCK_INTERFACES);
          showMockDataToast();
        }
      } finally {
        if (active) {
          setInterfaceLoading(false);
        }
      }
    }

    fetchInterfaceAccess();

    return () => {
      active = false;
    };
  }, []);

  /* -----------------------------------------------
     5. LOGIN HISTORY
  ----------------------------------------------- */

  useEffect(() => {
    let active = true;

    async function fetchHistory() {
      setHistoryLoading(true);

      try {
        const data = await getLoginHistory({
          page,
          size: PAGE_SIZE,
          user,
          result: result === "all" ? undefined : result,
          from: from || undefined,
          to: to || undefined,
        });

        if (!active) return;

        const items = data.items ?? [];
        const pagination = data.pagination;

        setHistory(items);

        const total =
          pagination?.total ?? data.total ?? items.length;

        const pages =
          pagination?.total_pages ??
          data.total_pages ??
          Math.max(1, Math.ceil(total / PAGE_SIZE));

        setTotalEntries(total);
        setTotalPages(pages);
      } catch {
        if (!active) return;

        // Apply the same filters to mock history.
        const filteredData = filterMockHistory({
          user,
          result,
          from,
          to,
        });

        const total = filteredData.length;
        const pages = Math.max(
          1,
          Math.ceil(total / PAGE_SIZE),
        );

        const startIndex = (page - 1) * PAGE_SIZE;

        setHistory(
          filteredData.slice(
            startIndex,
            startIndex + PAGE_SIZE,
          ),
        );

        setTotalEntries(total);
        setTotalPages(pages);

        showMockDataToast();
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      active = false;
    };
  }, [page, user, result, from, to]);

  /* -----------------------------------------------
     FILTER HANDLERS
  ----------------------------------------------- */

  function handleUserChange(value: string) {
    setPage(1);
    setUser(value);
  }

  function handleResultChange(value: LoginResult) {
    setPage(1);
    setResult(value);
  }

  function handleFromChange(value: string) {
    setPage(1);
    setFrom(value);
  }

  function handleToChange(value: string) {
    setPage(1);
    setTo(value);
  }

  /* -----------------------------------------------
     UI
  ----------------------------------------------- */

  return (
    <div className="space-y-4">
      <section>
        <p className="text-base text-text-primary">
          Welcome back,
        </p>

        <h1 className="text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-xs text-text-secondary">
          Here&apos;s an overview of your UAM system.
        </p>
      </section>

      {/* KPI */}
      <DashboardKpiSection
        stats={summary}
        loading={summaryLoading}
      />

      {/* Charts */}
      <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[2fr_1fr]">
        <LoginAttemptsChart
          data={loginAttempts}
          period={loginPeriod}
          loading={attemptsLoading}
          onPeriodChange={setLoginPeriod}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <UsersByRoleChart
            data={roles}
            loading={rolesLoading}
          />

          <InterfaceAccessChart
            data={interfaceAccess}
            loading={interfaceLoading}
          />
        </div>
      </section>

      {/* Login History */}
      <LoginHistoryTable
        data={history}
        loading={historyLoading}
        page={page}
        pageSize={PAGE_SIZE}
        totalEntries={totalEntries}
        totalPages={totalPages}
        onPageChange={setPage}
        user={user}
        onUserChange={handleUserChange}
        result={result}
        onResultChange={handleResultChange}
        from={from}
        onFromChange={handleFromChange}
        to={to}
        onToChange={handleToChange}
      />
    </div>
  );
}
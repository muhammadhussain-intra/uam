
import {
  LayoutDashboard,
  Users,
  ListTree,
  ShieldCheck,
  Settings,
  ScrollText,
} from "lucide-react";

export const dashboardNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/user-management/users-list",
    icon: Users,
    children: [
      { label: "All Users", href: "/user-management/users-list" },
      { label: "Add User", href: "/user-management/create" },
    ],
  },
  {
    label: "Role Configuration",
    href: "/role-configuration",
    icon: ListTree,
  },
  {
    label: "Roles & Permissions",
    href: "/permissions",
    icon: ShieldCheck,
  },
  {
    label: "Security Settings",
    href: "/security",
    icon: Settings,
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    icon: ScrollText,
  },
];

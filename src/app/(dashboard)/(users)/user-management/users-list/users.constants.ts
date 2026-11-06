
import {
  Users,
  UserCheck,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "./data/mockUsers";
import type { SelectOption } from "@/components/ui/Select";

export const userRoleOptions: SelectOption[] = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "Admin" },
  { label: "Teacher", value: "Teacher" },
  { label: "Staff", value: "Staff" },
  { label: "Student", value: "Student" },
];

export const userStatusOptions: SelectOption[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
];

export const userKpiConfig = [
  {
    id: "total-users",
    title: "Total Users",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    changeType: "positive" as const,
  },
  {
    id: "active-users",
    title: "Active Users",
    icon: UserCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    changeType: "positive" as const,
  },
  {
    id: "device-bound",
    title: "Device Bound",
    icon: Smartphone,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    changeType: "positive" as const,
  },
  {
    id: "mfa-enabled",
    title: "MFA Enabled",
    icon: ShieldCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeType: "positive" as const,
  },
];

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "userType",
    header: "User Type",
    enableSorting: true,
  },
  {
    accessorKey: "program",
    header: "Program",
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
  },
  {
    accessorKey: "facility",
    header: "Facility",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
  },
  {
    accessorKey: "security",
    header: "Security",
    enableSorting: true,
  },
  {
    accessorKey: "deviceBinding",
    header: "Device Binding",
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: () => null,
  },
];

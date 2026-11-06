
"use client";

import { useMemo } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Unplug,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/dashboard/DataTable";
import Button from "@/components/ui/Button";

import type { User } from "../data/mockUsers";

interface UsersTableProps {
  users: User[];
  totalEntries?: number;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

function StatusBadge({ status }: { status: User["status"] }) {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Pending: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SecurityBadge({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
      <ShieldCheck size={15} />
      Enabled
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
      <ShieldAlert size={15} />
      Disabled
    </span>
  );
}

function DeviceBadge({ bound }: { bound: boolean }) {
  return bound ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
      <Smartphone size={14} />
      Bound
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
      <Unplug size={14} />
      Not Bound
    </span>
  );
}

export default function UsersTable({
  users,
  totalEntries,
  onView,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-medium text-text-secondary">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-semibold text-text-primary">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-text-secondary">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "userType",
        header: "User Type",
      },
      {
        accessorKey: "program",
        header: "Program",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "facility",
        header: "Facility",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "security",
        header: "Security",
        cell: ({ row }) => (
          <SecurityBadge
            enabled={row.original.security === "MFA"}
          />
        ),
      },
      {
        accessorKey: "deviceBinding",
        header: "Device Binding",
        cell: ({ row }) => (
          <DeviceBadge
            bound={row.original.deviceBinding === "Bound"}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center ">
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-blue-600 hover:bg-blue-50"
                aria-label={`View ${user.name}`}
                title="View user"
                onClick={() => onView?.(user)}
              >
                <Eye size={16} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-primary"
                aria-label={`Edit ${user.name}`}
                title="Edit user"
                onClick={() => onEdit?.(user)}
              >
                <Pencil size={15} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-error hover:bg-red-50"
                aria-label={`Delete ${user.name}`}
                title="Delete user"
                onClick={() => onDelete?.(user)}
              >
                <Trash2 size={15} />
              </Button>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onDelete],
  );

  return (
    <section className="min-w-0 rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-primary">
          All Users
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Manage and monitor all registered users.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        pageSize={5}
        totalEntries={totalEntries}
        showSearch
        searchPlaceholder="Search users..."
        emptyMessage="No users found."
      />
    </section>
  );
}


import {
  UserRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { MockUserDetails } from "../data/mockUserDetails";

interface UserSummaryCardProps {
  user: MockUserDetails;
  assignedRolesCount: number;
}

export default function UserSummaryCard({
  user,
  assignedRolesCount,
}: UserSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
      <div className="h-2 bg-primary" />

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-green-light text-primary">
            <UserRound size={30} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-text-primary sm:text-xl">
              {user.full_name}
            </h2>

            <p className="mt-1 truncate text-sm text-text-secondary">
              {user.email}
            </p>

            <p className="mt-1 text-xs text-text-muted">
              User ID: #{user.id}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              user.is_active
                ? "bg-green-light text-primary"
                : "bg-subtle text-text-secondary",
            ].join(" ")}
          >
            {user.is_active ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}

            {user.is_active ? "Active" : "Inactive"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-white px-3 py-1.5 text-xs font-medium text-text-secondary">
            <ShieldCheck size={14} />
            {assignedRolesCount} Assigned Roles
          </span>
        </div>
      </div>
    </div>
  );
}

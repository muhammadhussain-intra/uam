
import {
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

import FormSection from "@/components/dashboard/FormSection";

import UserDetailItem from "./UserDetailItem";
import { ROLE_OPTIONS } from "../../../create/create-user.constants";

import type { MockUserDetails } from "../data/mockUserDetails";

interface ViewRoleAssignmentSectionProps {
  user: MockUserDetails;
}

export default function ViewRoleAssignmentSection({
  user,
}: ViewRoleAssignmentSectionProps) {
  const assignedRoles = ROLE_OPTIONS.filter((role) =>
    user.role_ids.includes(role.value),
  );

  return (
    <FormSection
      step="02"
      title="Access & Assignment"
      description="Roles and program associated with this user."
      icon={<ShieldCheck size={21} />}
    >
      <div className="sm:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Assigned Roles
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Roles currently assigned to this user.
            </p>
          </div>

          <span className="rounded-full border border-primary/15 bg-green-light/40 px-3 py-1.5 text-xs font-semibold text-primary">
            {assignedRoles.length} Assigned
          </span>
        </div>

        {assignedRoles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assignedRoles.map((role) => (
              <div
                key={role.value}
                className="flex items-start gap-3 rounded-xl border border-primary/20 bg-green-light/30 p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                  <ShieldCheck size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {role.label}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border-default p-6 text-center">
            <Users
              size={22}
              className="mx-auto text-text-muted"
            />

            <p className="mt-2 text-sm font-medium text-text-primary">
              No roles assigned
            </p>
          </div>
        )}
      </div>

      <UserDetailItem
        label="Program ID"
        value={user.program_id ?? "—"}
        icon={<Building2 size={16} />}
      />
    </FormSection>
  );
}


"use client";

import { ArrowLeft, Users } from "lucide-react";

import Button from "@/components/ui/Button";

interface EditUserHeaderProps {
  onBack: () => void;
}

export default function EditUserHeader({
  onBack,
}: EditUserHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span>User Management</span>
        <span>/</span>
        <span>Users List</span>
        <span>/</span>
        <span className="text-primary">Edit User</span>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            iconOnly
            aria-label="Go back"
            onClick={onBack}
            className="mt-1 shrink-0"
          >
            <ArrowLeft size={19} />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Edit User
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
              Update user information, assigned roles and account
              access settings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-border-default bg-white px-3 py-2 sm:self-auto">
          <Users size={16} className="text-primary" />
          <span className="text-xs font-medium text-text-secondary">
            User Management
          </span>
        </div>
      </div>
    </div>
  );
}

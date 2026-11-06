
"use client";

import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import Button from "@/components/ui/Button";

interface ViewUserHeaderProps {
  onBack: () => void;
  onEdit: () => void;
}

export default function ViewUserHeader({
  onBack,
  onEdit,
}: ViewUserHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span>User Management</span>
        <span>/</span>
        <span>Users List</span>
        <span>/</span>
        <span className="text-primary">View User</span>
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
              User Details
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
              View the user&apos;s profile information, assigned roles
              and account configuration.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            leftIcon={<ArrowLeft size={16} />}
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            leftIcon={<Pencil size={16} />}
            onClick={onEdit}
          >
            Edit User
          </Button>
        </div>
      </div>
    </div>
  );
}

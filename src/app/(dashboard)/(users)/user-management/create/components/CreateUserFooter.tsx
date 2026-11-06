
"use client";

import { Save } from "lucide-react";

import Button from "@/components/ui/Button";

interface CreateUserFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function CreateUserFooter({
  isSubmitting,
  onCancel,
}: CreateUserFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-3 rounded-xl border border-border-default bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-text-muted">
        <span className="text-error">*</span> Required fields
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          leftIcon={<Save size={17} />}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create User
        </Button>
      </div>
    </div>
  );
}

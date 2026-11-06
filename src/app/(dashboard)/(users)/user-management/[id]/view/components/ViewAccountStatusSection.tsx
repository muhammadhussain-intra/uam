
import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

import FormSection from "@/components/dashboard/FormSection";

interface ViewAccountStatusSectionProps {
  isActive: boolean;
}

export default function ViewAccountStatusSection({
  isActive,
}: ViewAccountStatusSectionProps) {
  return (
    <FormSection
      step="03"
      title="Account Status"
      description="Current status of the user's account."
      icon={<CheckCircle2 size={21} />}
    >
      <div className="sm:col-span-2">
        <div className="flex items-center gap-3 rounded-xl border border-border-default bg-subtle/30 p-4">
          <div
            className={[
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              isActive
                ? "bg-green-light text-primary"
                : "bg-subtle text-text-secondary",
            ].join(" ")}
          >
            {isActive ? (
              <CheckCircle2 size={21} />
            ) : (
              <XCircle size={21} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary">
              {isActive ? "Account is Active" : "Account is Inactive"}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              {isActive
                ? "This user is allowed to access the platform according to assigned permissions."
                : "This user currently cannot access the platform."}
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}

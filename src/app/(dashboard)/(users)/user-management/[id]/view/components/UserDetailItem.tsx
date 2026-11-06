
import type { ReactNode } from "react";

interface UserDetailItemProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export default function UserDetailItem({
  label,
  value,
  icon,
}: UserDetailItemProps) {
  return (
    <div className="min-w-0 rounded-xl border border-border-default bg-subtle/30 p-4">
      <p className="text-xs font-medium text-text-muted">
        {label}
      </p>

      <div className="mt-2 flex min-w-0 items-center gap-2">
        {icon && (
          <span className="shrink-0 text-text-secondary">
            {icon}
          </span>
        )}

        <p className="truncate text-sm font-semibold text-text-primary">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

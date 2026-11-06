
import { Info } from "lucide-react";

export default function CreateUserInfoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-green-light/40 p-4">
      <Info size={18} className="mt-0.5 shrink-0 text-primary" />

      <div>
        <p className="text-sm font-semibold text-text-primary">
          Before you create a user
        </p>

        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          Provide accurate user information and assign at least one
          role to define their access permissions.
        </p>
      </div>
    </div>
  );
}


"use client";

interface CheckboxFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function CheckboxField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <label
      className={[
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-primary bg-green-light/40"
          : "border-border-default bg-card hover:border-border-strong",
        disabled ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
      />

      <span className="min-w-0">
        <span className="block text-sm font-medium text-text-primary">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-xs text-text-secondary">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

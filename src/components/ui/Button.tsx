
import React from "react";
import { LoaderCircle } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed",
  secondary:
    "border border-border-default bg-subtle text-text-primary hover:bg-green-light",
  outline:
    "border border-border-strong bg-transparent text-primary hover:bg-green-light",
  ghost:
    "bg-transparent text-text-primary hover:bg-subtle",
  danger:
    "bg-error text-white hover:opacity-90 active:opacity-80",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const iconOnlySizes: Record<ButtonSize, string> = {
  sm: "size-8 p-0",
  md: "size-10 p-0",
  lg: "size-12 p-0",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        baseStyles,
        variants[variant],
        iconOnly ? iconOnlySizes[size] : sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}

      {!iconOnly && (loading ? "Please wait..." : children)}

      {!loading && !iconOnly && rightIcon}
    </button>
  );
}

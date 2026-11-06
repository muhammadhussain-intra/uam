"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  selectSize?: "sm" | "md" | "lg";
  options?: SelectOption[];
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

const selectSizes = {
  sm: "h-8 text-xs pl-2.5 pr-8",
  md: "h-9 text-xs pl-3 pr-8",
  lg: "h-11 text-sm pl-3.5 pr-9",
};

const iconSizes = {
  sm: 13,
  md: 14,
  lg: 16,
};

export default function Select({
  id,
  label,
  helperText,
  error,
  selectSize = "md",
  options,
  children,
  containerClassName = "",
  className = "",
  disabled,
  required,
  leftIcon,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const describedBy = [
    error ? errorId : undefined,
    helperText && !error ? helperId : undefined,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-xs font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className="pointer-events-none absolute left-2.5 z-10 shrink-0 text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <select
          {...props}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          className={[
            "w-full cursor-pointer appearance-none rounded-lg border bg-surface-card text-text-primary outline-none transition-colors",
            selectSizes[selectSize],
            leftIcon ? "pl-8" : "",
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
              : "border-border-default focus:border-primary focus:ring-2 focus:ring-primary/20",
            disabled
              ? "cursor-not-allowed bg-subtle opacity-60"
              : "hover:border-border-strong",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="bg-surface-card text-text-primary"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {/* Custom Chevron Indicator */}
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        >
          <ChevronDown size={iconSizes[selectSize]} />
        </span>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-xs text-text-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}



"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size"
  > {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

const inputSizes = {
  sm: "h-8 text-sm",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

export default function TextField({
  id,
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  inputSize = "md",
  containerClassName = "",
  className = "",
  type = "text",
  disabled,
  readOnly,
  required,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const isPassword = type === "password";
  const currentType =
    isPassword && showPassword ? "text" : type;

  const describedBy = [
    error ? errorId : undefined,
    helperText && !error ? helperId : undefined,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={[
          "flex w-full items-center gap-2 rounded-lg border bg-card px-3 transition-colors",
          inputSizes[inputSize],
          error
            ? "border-error focus-within:ring-2 focus-within:ring-error/20"
            : "border-border-default focus-within:border-primary focus-within:ring-2 focus-within:ring-action/20",
          disabled
            ? "cursor-not-allowed bg-subtle opacity-70"
            : "",
          readOnly ? "bg-subtle" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {leftIcon && (
          <span
            className="shrink-0 text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          type={currentType}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          className={[
            "h-full min-w-0 flex-1 bg-transparent text-text-primary outline-none",
            "placeholder:text-text-muted",
            "disabled:cursor-not-allowed",
            "read-only:cursor-default",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
            className="shrink-0 rounded p-1 text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        ) : (
          rightIcon && (
            <span className="shrink-0 text-text-muted">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-error"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="mt-1.5 text-sm text-text-secondary"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}


"use client";

import { useRef } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  idPrefix?: string;
  ariaLabel?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  idPrefix = "otp",
  ariaLabel = "Verification code",
  containerClassName = "mb-4 grid grid-cols-6 gap-2",
  inputClassName = "h-11 w-full min-w-0 rounded-md border border-border-default bg-white text-center text-base font-semibold text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-action/20 disabled:opacity-60",
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    const digits = inputValue.replace(/\D/g, "");

    // Clear current digit
    if (!digits) {
      const updated = [...value];
      updated[index] = "";
      onChange(updated);
      return;
    }

    // Support typing and pasting complete OTP
    const characters = digits.slice(0, length - index).split("");
    const updated = Array.from({ length }, (_, i) => value[i] ?? "");

    characters.forEach((digit, offset) => {
      updated[index + offset] = digit;
    });

    onChange(updated);

    // Focus next available input
    const nextIndex = Math.min(index + characters.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const updated = [...value];

      if (updated[index]) {
        updated[index] = "";
        onChange(updated);
      } else if (index > 0) {
        updated[index - 1] = "";
        onChange(updated);
        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      className={containerClassName}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={`${idPrefix}-${index}`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={length}
          value={value[index] ?? ""}
          disabled={disabled}
          aria-label={`${ariaLabel} digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => {
            event.preventDefault();
            handleChange(index, event.clipboardData.getData("text"));
          }}
          className={inputClassName}
        />
      ))}
    </div>
  );
}

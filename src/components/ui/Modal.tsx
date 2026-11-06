
"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import Button from "./Button";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (
          closeOnOverlayClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-border-default bg-white shadow-xl",
          sizeStyles[size],
          className,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-5 py-4">
          <h2
            id="modal-title"
            className="text-base font-semibold text-text-primary sm:text-lg"
          >
            {title}
          </h2>

          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Close modal"
              onClick={onClose}
              className="text-text-secondary hover:bg-subtle"
            >
              <X size={19} />
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border-default bg-subtle/50 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

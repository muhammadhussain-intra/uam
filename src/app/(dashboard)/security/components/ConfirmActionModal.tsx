
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  requirePassword?: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => Promise<void> | void;
}

type ConfirmActionFormValues = {
  password: string;
};

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  requirePassword = false,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  const schema = z
    .object({
      password: z.string(),
    })
    .superRefine((values, ctx) => {
      if (requirePassword && !values.password.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password is required.",
        });
      }
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmActionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  // ==========================================
  // Confirm Action
  // ==========================================

  const handleConfirm = async (values: ConfirmActionFormValues) => {
    try {
      await onConfirm(
        requirePassword ? values.password : undefined,
      );

      reset();
    } catch (error) {
      console.error("[MFA] Confirmation Action Error:", error);
      toast.error("Unable to complete this action. Please try again.");
    }
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const handleClose = () => {
    reset();
    onClose();
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={title}
      size="md"
      closeOnOverlayClick={false}
      showCloseButton
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={danger ? "danger" : "primary"}
            size="md"
            onClick={handleSubmit(handleConfirm)}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-text-secondary">
          {description}
        </p>

        {requirePassword && (
          <form
            id="confirm-action-form"
            onSubmit={handleSubmit(handleConfirm)}
          >
            <TextField
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register("password")}
            />
          </form>
        )}
      </div>
    </Modal>
  );
}

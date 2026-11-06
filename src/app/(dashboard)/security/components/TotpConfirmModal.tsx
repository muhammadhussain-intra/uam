
"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";

import { confirmTotp } from "../actions";

// ==========================================
// Validation Schema
// ==========================================

const totpConfirmSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must contain exactly 6 digits.")
    .regex(/^\d{6}$/, "Only numeric digits are allowed."),
});

type TotpConfirmFormValues = z.infer<typeof totpConfirmSchema>;

// ==========================================
// Props
// ==========================================


interface TotpConfirmModalProps {
  open: boolean;
  setupToken: string;
  onClose: () => void;
  onSuccess: (factorId?: number) => void;
}


// ==========================================
// Component
// ==========================================

export default function TotpConfirmModal({
  open,
  setupToken,
  onClose,
  onSuccess,
}: TotpConfirmModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TotpConfirmFormValues>({
    resolver: zodResolver(totpConfirmSchema),
    defaultValues: {
      code: "",
    },
  });

  const code = watch("code");

  // ==========================================
  // Reset Form When Modal Opens
  // ==========================================

  useEffect(() => {
    if (open) {
      reset({ code: "" });
    }
  }, [open, reset]);

  // ==========================================
  // Verify TOTP
  // ==========================================


const handleVerify = async (values: TotpConfirmFormValues) => {
  if (!setupToken) {
    console.error("[MFA] TOTP setup token is missing.");
    return;
  }

  const response = await confirmTotp({
    setup_token: setupToken,
    code: values.code,
  });

  if (!response) return;

  if (response.data?.enabled !== true) {
    console.error("[MFA] TOTP was not enabled:", response);
    return;
  }

  const factorId = response.data.factor_id;

  if (typeof factorId !== "number") {
    console.warn("[MFA] Backend did not return a valid factor_id.");
  }

  reset();
  onSuccess(factorId);
};


  // ==========================================
  // Close Modal
  // ==========================================

  const handleClose = () => {
    if (isSubmitting) return;

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
      title="Verify Authenticator"
      size="md"
      closeOnOverlayClick={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit(handleVerify)}
            loading={isSubmitting}
            disabled={code?.length !== 6 || !setupToken}
          >
            Verify & Enable
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-text-secondary">
          Enter the 6-digit verification code displayed in your
          authenticator app to complete MFA setup.
        </p>

        <form
          id="totp-confirm-form"
          onSubmit={handleSubmit(handleVerify)}
        >
          <TextField
            label="Verification Code"
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            inputSize="lg"
            className="text-center font-mono text-lg tracking-[0.5em]"
            error={errors.code?.message}
            {...register("code", {
              onChange: (event) => {
                const numericValue = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setValue("code", numericValue, {
                  shouldValidate: true,
                });
              },
            })}
          />
        </form>

        <p className="text-xs text-text-muted">
          Open your authenticator app and enter the current code.
        </p>
      </div>
    </Modal>
  );
}

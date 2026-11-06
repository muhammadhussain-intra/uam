
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QRCodeSVG } from "qrcode.react";
import { KeyRound, ShieldCheck, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

import { enrollTotp } from "../actions";
import type { TotpEnrollmentData } from "../actions/totp";

// ==========================================
// Validation
// ==========================================

const schema = z.object({
  password: z.string().min(1, "Current password is required."),
});

type FormValues = z.infer<typeof schema>;

// ==========================================
// Props
// ==========================================

interface TotpSetupModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (data: TotpEnrollmentData) => void;
}

// ==========================================
// Component
// ==========================================

export default function TotpSetupModal({
  open,
  onClose,
  onContinue,
}: TotpSetupModalProps) {
  const [enrollment, setEnrollment] =
    useState<TotpEnrollmentData | null>(null);

  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ password: "" });
      setEnrollment(null);
      setCopied(false);
    }
  }, [open, reset]);

  // ==========================================
  // Enroll Authenticator
  // ==========================================

  const handleSetup = async (values: FormValues) => {
    const response = await enrollTotp({
      password: values.password,
    });

    if (!response) return;

    const data = response.data;

    if (
      !data?.setup_token ||
      !data?.secret ||
      !data?.otpauth_uri
    ) {
      console.error(
        "[MFA] Invalid TOTP enrollment response:",
        response,
      );
      toast.error("Invalid authenticator setup response.");
      return;
    }

    setEnrollment(data);
    reset();
  };

  // ==========================================
  // Copy Secret
  // ==========================================

  const handleCopySecret = async () => {
    if (!enrollment?.secret) return;

    try {
      await navigator.clipboard.writeText(enrollment.secret);
      setCopied(true);
      toast.success("Secret key copied.");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[MFA] Copy Secret Error:", error);
      toast.error("Unable to copy secret key.");
    }
  };

  // ==========================================
  // Continue To Verification
  // ==========================================

  const handleContinue = () => {
    if (!enrollment) return;

    onContinue(enrollment);
  };

  // ==========================================
  // Close
  // ==========================================

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    setEnrollment(null);
    onClose();
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={
        enrollment
          ? "Connect Authenticator App"
          : "Set Up Authenticator App"
      }
      size="md"
      closeOnOverlayClick={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={
        enrollment ? (
          <>
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleContinue}
            >
              I've Scanned the QR Code
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit(handleSetup)}
              loading={isSubmitting}
            >
              Continue
            </Button>
          </>
        )
      }
    >
      {!enrollment ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-border-default bg-subtle/50 p-3">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-primary"
            />

            <p className="text-xs leading-5 text-text-secondary">
              Secure your account with an authenticator app.
              Enter your password to begin setup.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleSetup)}
            className="space-y-4"
          >
            <TextField
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              leftIcon={<KeyRound size={17} />}
              required
              error={errors.password?.message}
              {...register("password")}
            />
          </form>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">
            Open Google Authenticator, Microsoft Authenticator,
            or another compatible app. Scan the QR code below.
          </p>

          {/* QR Code */}
          <div className="flex justify-center rounded-xl border border-border-default bg-white p-5">
            <QRCodeSVG
              value={enrollment.otpauth_uri}
              size={200}
              level="M"
              includeMargin
            />
          </div>

          {/* Issuer */}
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">
              {enrollment.issuer}
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              {enrollment.digits}-digit verification code
              {" · "}
              Refreshes every {enrollment.period} seconds
            </p>
          </div>

          {/* Manual Setup */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">
              Can't scan the QR code?
            </p>

            <p className="text-xs text-text-secondary">
              Enter this secret key manually in your
              authenticator app.
            </p>

            <div className="flex items-center gap-2 rounded-lg border border-border-default bg-subtle p-3">
              <code className="min-w-0 flex-1 break-all text-sm text-text-primary">
                {enrollment.secret}
              </code>

              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={
                  copied ? (
                    <Check size={17} />
                  ) : (
                    <Copy size={17} />
                  )
                }
                onClick={handleCopySecret}
                // tooltip="Copy secret"
              />
            </div>
          </div>

          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
            <p className="text-xs leading-5 text-text-secondary">
              Keep your secret key private. Anyone with this
              key may be able to generate your authentication
              codes.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

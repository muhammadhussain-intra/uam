"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";

import OtpInput from "@/components/auth/OtpInput";
import OtpCountdown from "@/components/auth/OtpCountdown";
import OtpResendButton from "@/components/auth/OtpResendButton";

import useOtpTimers from "@/hooks/useOtpTimers";

import {
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  RECOVERY_OTP_EXPIRY_KEY,
  RECOVERY_OTP_RESEND_KEY,
  RESEND_SECONDS,
} from "../reset-password-otp.constants";

import verifyOtp from "../actions/verifyOtp";
import resendOtp from "../actions/resendOtp";

import { otpVerificationSchema } from "../reset-password-otp.schema";
import { maskEmail } from "@/utils";
import { clearRecoverySession } from "@/utils/authSession";

export default function OtpVerificationForm() {
  const router = useRouter();

  // Form state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Reusable OTP timers
  const { secondsLeft, resendSecondsLeft, resetTimers, clearTimers } =
    useOtpTimers({
      enabled: Boolean(email),
      expiryKey: RECOVERY_OTP_EXPIRY_KEY,
      resendKey: RECOVERY_OTP_RESEND_KEY,
      expirySeconds: OTP_EXPIRY_SECONDS,
      resendSeconds: RESEND_SECONDS,
    });

  // Retrieve recovery email
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("uam_recovery_email");

    if (!storedEmail) {
      toast.error("Recovery email not found", {
        description: "Please restart the password recovery process.",
      });

      router.replace("/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  // Verify OTP
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    const validation = otpVerificationSchema.safeParse({
      otp: code,
    });

    if (!validation.success) {
      toast.error("Invalid verification code", {
        description: "Please enter all 6 digits of your verification code.",
      });

      return;
    }

    if (!email) {
      toast.error("Recovery email not found", {
        description: "Please restart password recovery.",
      });

      clearRecoverySession();
router.replace("/forgot-password");
      return;
    }

    if (secondsLeft <= 0) {
      toast.error("Verification code expired", {
        description: "Please request a new verification code.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyOtp({
        email,
        otp: validation.data.otp,
      });

      if (!result.success || !result.resetToken) {
        toast.error("Verification failed", {
          description: result.message,
        });

        return;
      }

      // Clear OTP timers
      clearTimers();

      // Clear previous recovery data
      clearRecoverySession();

      // Store verified recovery credentials
      sessionStorage.setItem("uam_recovery_email", email);
      sessionStorage.setItem("uam_recovery_otp", validation.data.otp);
      sessionStorage.setItem("uam_reset_token", result.resetToken);

      toast.success("OTP verified successfully", {
        description: result.message,
      });

      router.push("/reset-password");
    } finally {
      setOtp(Array(OTP_LENGTH).fill(""));
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!email || resendSecondsLeft > 0 || isResending) {
      return;
    }

    setIsResending(true);

    try {
      const result = await resendOtp(email);

      if (!result.success) {
        toast.error("Failed to resend code", {
          description: result.message,
        });

        return;
      }

      // Clear previous OTP digits
      setOtp(Array(OTP_LENGTH).fill(""));

      // Reset OTP expiry and resend cooldown
      resetTimers();

      toast.success("Verification code requested", {
        description: result.message,
      });
    } finally {
      setOtp(Array(OTP_LENGTH).fill(""));
      setIsResending(false);
    }
  };

  const isCodeComplete = otp.every((digit) => digit !== "");

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-8">
      {/* Back to login */}
      <Link
        href="/login"
        onClick={clearRecoverySession}
        className="mb-5 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-[36px]">
          Verify your identity
        </h2>

        <p className="mt-2 text-sm leading-snug text-text-secondary">
          Enter the 6-digit OTP sent to your registered email.
        </p>
      </div>

      {/* Registered email */}
      <div className="mb-5 flex h-11 items-center gap-3 rounded-lg border border-border-default bg-white/80 px-3">
        <Mail size={17} className="shrink-0 text-text-muted" />

        <span className="truncate text-sm font-medium text-text-primary">
          {email ? maskEmail(email) : "Loading email..."}
        </span>
      </div>

      {/* Verification form */}
      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="otp-0"
          className="mb-3 block text-sm font-medium text-text-primary"
        >
          Email verification code (6 digits)
        </label>

        {/* OTP inputs */}
        <OtpInput
          value={otp}
          onChange={setOtp}
          length={OTP_LENGTH}
          disabled={isSubmitting}
          idPrefix="otp"
          ariaLabel="Email verification code"
          containerClassName="mb-4 grid grid-cols-6 gap-2"
          inputClassName="h-11 w-full min-w-0 rounded-md border border-border-default bg-white text-center text-base font-semibold text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-action/20 disabled:opacity-60"
        />

        {/* OTP expiry */}
        <OtpCountdown
          secondsLeft={secondsLeft}
          label="OTP expires in"
          expiredMessage="OTP has expired"
          className="mb-5"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          leftIcon={!isSubmitting ? <ShieldCheck size={17} /> : undefined}
          disabled={!isCodeComplete || secondsLeft <= 0}
          className="h-11"
        >
          Verify
        </Button>
      </form>

      {/* Resend OTP */}
      <OtpResendButton
        secondsLeft={resendSecondsLeft}
        isResending={isResending}
        onResend={handleResend}
        disabled={!email}
        className="mt-5"
      />
    </div>
  );
}

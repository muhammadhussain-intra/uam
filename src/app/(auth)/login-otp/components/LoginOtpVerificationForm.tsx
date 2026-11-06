"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Mail,
  MonitorCheck,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import Button from "@/components/ui/Button";
import OtpInput from "@/components/auth/OtpInput";
import OtpCountdown from "@/components/auth/OtpCountdown";
import OtpResendButton from "@/components/auth/OtpResendButton";
import { clearLoginSession } from "@/utils/authSession";
import useOtpTimers from "@/hooks/useOtpTimers";

import verifyOtp from "../actions/verifyOtp";
import resendOtp from "../actions/resendOtp";
import { setUser, updateMfaDetails } from "@/store/slices/authSlice";

import {
  OTP_EXPIRY_KEY,
  OTP_LENGTH,
  OTP_RESEND_EXPIRY_KEY,
  RESEND_OTP_COOLDOWN_SECONDS,
} from "../login-otp-verification.constants";

import type { LoginMethod } from "../actions/verifyOtp";

interface LoginContext {
  email: string;
  challenge_id: number;
  expires_in: number;
  mfa_required: boolean;
  methods: LoginMethod[];
  backup_codes_remaining: number;
  programs: unknown[];
  selected_method?: LoginMethod;
}

const LOGIN_CONTEXT_KEY = "uam_login_context";

export default function LoginOtpVerificationForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ==========================================
  // Form State
  // ==========================================

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState<number | null>(null);

  const [method, setMethod] = useState<LoginMethod>("otp");

  const [isSessionReady, setIsSessionReady] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [otpDuration, setOtpDuration] = useState(300);
  const [trustDevice, setTrustDevice] = useState(false);

  const [loginContext, setLoginContext] = useState<LoginContext | null>(null);

  // ==========================================
  // OTP Timers
  // Only enabled for email OTP
  // ==========================================

  const { secondsLeft, resendSecondsLeft, resetTimers, clearTimers } =
    useOtpTimers({
      enabled: isSessionReady && challengeId !== null && method === "otp",

      expiryKey: `${OTP_EXPIRY_KEY}_${challengeId}`,
      resendKey: `${OTP_RESEND_EXPIRY_KEY}_${challengeId}`,

      expirySeconds: otpDuration,
      resendSeconds: RESEND_OTP_COOLDOWN_SECONDS,
    });

  // ==========================================
  // Retrieve Login Session
  // ==========================================

  useEffect(() => {
    const storedContext = sessionStorage.getItem(LOGIN_CONTEXT_KEY);

    if (!storedContext) {
      toast.error("Login session expired. Please login again.");
      router.replace("/login");
      return;
    }

    try {
      const context: LoginContext = JSON.parse(storedContext);

      const method = context.selected_method;

      if (
        !Number.isInteger(context.challenge_id) ||
        context.challenge_id <= 0 ||
        context.mfa_required !== true ||
        !Array.isArray(context.methods) ||
        !method ||
        (method !== "otp" && method !== "totp") ||
        !context.methods.includes(method)
      ) {
        toast.error("Invalid verification session. Please login again.");
        router.replace("/login");
        return;
      }

      if (method === "otp" && !context.email) {
        toast.error("Email is missing from the authentication session.");
        router.replace("/login");
        return;
      }

      setEmail(context.email ?? "");
      setChallengeId(context.challenge_id);
      setMethod(method);
      setLoginContext(context);

      setOtpDuration(
        Number.isFinite(context.expires_in) && context.expires_in > 0
          ? context.expires_in
          : 300,
      );

      console.log("[MFA] OTP Verification Context:", context);

      setIsSessionReady(true);
    } catch (error) {
      console.error("[MFA] Invalid Login Context:", error);

      toast.error("Unable to read authentication session.");
      router.replace("/login");
    }
  }, [router]);

  // ==========================================
  // Verify OTP / TOTP
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("Incomplete verification code", {
        description: "Please enter all 6 digits to continue.",
      });
      return;
    }

    if (!email || challengeId === null) {
      toast.error("Login session is missing. Please login again.");
      router.replace("/login");
      return;
    }

    // Expiry applies only to email OTP.
    if (method === "otp" && secondsLeft <= 0) {
      toast.error("Verification code expired", {
        description: "Please request a new verification code.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyOtp({
        email,
        otp: code,
        challengeId,
        method,
        trustDevice,
      });

      console.log("[MFA] Verification Result:", result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (!result.user) {
        toast.error("User information is missing. Please login again.");
        router.replace("/login");
        return;
      }

      // Store authenticated user.
      dispatch(setUser(result.user));

      // Store MFA details.
      dispatch(
        updateMfaDetails({
          loginMethods: loginContext?.methods ?? [],
          backupCodesRemaining: loginContext?.backup_codes_remaining ?? 0,
        }),
      );

      // Clear timers
      clearTimers();

      // Clear login challenge session.
      sessionStorage.removeItem(LOGIN_CONTEXT_KEY);

      toast.success(result.message);

      const roles = result.user.roles ?? [];

      if (roles.length === 1) {
        router.replace("/dashboard");
      } else if (roles.length > 1) {
        router.replace("/workspace-selection");
      } else {
        toast.error("No role is assigned to your account.");
        router.replace("/login");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("[MFA] Verification Submission Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOtp(Array(OTP_LENGTH).fill(""));
      setIsVerifying(false);
    }
  };

  // ==========================================
  // Resend Email OTP
  // TOTP does not support resend.
  // ==========================================

  const handleResendOtp = async () => {
    if (method !== "otp") return;

    if (!email || challengeId === null) {
      toast.error("Login session is missing. Please login again.");
      router.replace("/login");
      return;
    }

    if (resendSecondsLeft > 0 || isResending) return;

    setIsResending(true);

    try {
      const result = await resendOtp(email, challengeId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(""));

      resetTimers();

      toast.success(result.message);
    } catch (error) {
      console.error("[MFA] Resend OTP Error:", error);
      toast.error("Unable to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  // ==========================================
  // Derived State
  // ==========================================

  const isCodeComplete = otp.every((digit) => digit !== "");

  const isTotp = method === "totp";

  const isOtpExpired = !isTotp && secondsLeft <= 0;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-8">
      {/* Back to Login */}

      <Link
        href="/login"
        onClick={clearLoginSession}
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      {/* Brand */}

      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <ShieldCheck size={22} />
        </div>

        <div>
          <p className="font-semibold leading-tight text-text-primary">UAM</p>

          <p className="text-sm leading-tight text-text-secondary">
            Authentication
          </p>
        </div>
      </div>

      {/* Dynamic Heading */}

      <div className="mb-5">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-[36px]">
          {isTotp ? "Authenticator verification" : "Verify it's you"}
        </h2>

        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          {isTotp
            ? "Open your authenticator app and enter the current 6-digit verification code."
            : "Enter the 6-digit security code sent to your registered email address."}
        </p>

        {/* Email Information - OTP Only */}

        {!isTotp && email && (
          <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
            <Mail size={14} className="shrink-0 text-primary" />

            <span className="text-xs text-text-secondary">Sent to</span>

            <span className="min-w-0 truncate text-xs font-semibold text-text-primary">
              {email}
            </span>
          </div>
        )}
      </div>

      {/* Verification Form */}

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="otp-0"
          className="mb-3 block text-sm font-medium text-text-primary"
        >
          {isTotp ? "Enter authenticator code" : "Enter verification code"}
        </label>

        {/* OTP Countdown - Email Only */}

        {!isTotp && (
          <OtpCountdown secondsLeft={secondsLeft} label="OTP expires in" />
        )}

        {/* TOTP Information */}

        {isTotp && (
          <p className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
            <KeyRound size={14} className="shrink-0 text-primary" />
            Authenticator codes refresh automatically every few seconds.
          </p>
        )}

        {/* Reusable Code Inputs */}

        <OtpInput
          value={otp}
          onChange={setOtp}
          length={OTP_LENGTH}
          disabled={isVerifying || !isSessionReady}
          idPrefix="otp"
          ariaLabel={isTotp ? "Authenticator code" : "Email verification code"}
          containerClassName="mb-5 grid grid-cols-6 gap-2"
          inputClassName="h-12 w-full min-w-0 rounded-lg border border-border-default bg-white text-center text-lg font-semibold text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-action/20 disabled:opacity-60"
        />

        {/* Trusted Device Option */}

        <label
          htmlFor="trust-device"
          className="mb-5 flex cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-white/70 p-3 transition-colors hover:border-primary/40"
        >
          <input
            id="trust-device"
            type="checkbox"
            checked={trustDevice}
            onChange={(event) => setTrustDevice(event.target.checked)}
            disabled={isVerifying || !isSessionReady}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />

          <div className="flex items-start gap-2">
            <MonitorCheck size={18} className="mt-0.5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-text-primary">
                Trust this device for 30 days
              </p>

              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Only select this option if you are using your personal device.
                This device will be registered as trusted.
              </p>
            </div>
          </div>
        </label>

        {/* Verify Button */}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isVerifying}
          disabled={
            !isSessionReady ||
            !isCodeComplete ||
            challengeId === null ||
            isOtpExpired
          }
          leftIcon={!isVerifying ? <ShieldCheck size={17} /> : undefined}
          className="h-11"
        >
          Verify and continue
        </Button>
      </form>

      {/* Resend - Email OTP Only */}

      {!isTotp && (
        <OtpResendButton
          secondsLeft={resendSecondsLeft}
          isResending={isResending}
          onResend={handleResendOtp}
          disabled={challengeId === null || !isSessionReady}
        />
      )}

      {/* TOTP Footer */}

      {/* {isTotp && (
        <p className="mt-5 text-center text-xs leading-relaxed text-text-secondary">
          Can't access your authenticator app?{" "}
          <Link
            href="/backup-codes"
            className="font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            Use a backup code
          </Link>
        </p>
      )} */}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  MonitorCheck,
} from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

import { verifyBackupCode } from "../actions/backup-code";
import { setUser, updateMfaDetails } from "@/store/slices/authSlice";

type LoginMethod = "otp" | "totp" | "backup";

interface LoginContext {
  email?: string;
  challenge_id: number;
  expires_in?: number;
  mfa_required: boolean;
  methods: LoginMethod[];
  selected_method?: LoginMethod;
  backup_codes_remaining?: number;
  programs?: unknown[];
}

const LOGIN_CONTEXT_KEY = "uam_login_context";

export default function BackupCodeForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [backupCode, setBackupCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);

  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const firstBlockRef = useRef<HTMLInputElement>(null);
  const secondBlockRef = useRef<HTMLInputElement>(null);

  const [loginContext, setLoginContext] = useState<LoginContext | null>(null);

  function handleCodeChange(value: string) {
    const cleaned = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 10);

    const formatted =
      cleaned.length > 5
        ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
        : cleaned;

    setBackupCode(formatted);
    setError("");

    if (cleaned.length >= 5) {
      secondBlockRef.current?.focus();
    }
  }

  // Retrieve Login Session

  useEffect(() => {
    try {
      const storedContext = sessionStorage.getItem(LOGIN_CONTEXT_KEY);

      if (!storedContext) {
        throw new Error("Login context not found");
      }

      const context: LoginContext = JSON.parse(storedContext);

      if (
        !Number.isInteger(context.challenge_id) ||
        context.challenge_id <= 0 ||
        context.mfa_required !== true ||
        !Array.isArray(context.methods) ||
        !context.methods.includes("backup") ||
        context.selected_method !== "backup"
      ) {
        throw new Error("Invalid login context");
      }

      setChallengeId(context.challenge_id);
      setLoginContext(context);
      setIsSessionReady(true);
    } catch {
      toast.error("Authentication session expired.");
      router.replace("/login");
    }
  }, [router]);

  // Clear Login Session

  function clearAuthenticatedLoginSession() {
    sessionStorage.removeItem(LOGIN_CONTEXT_KEY);
  }

  // Verify Backup Code

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!challengeId) {
      toast.error("Authentication session expired.");
      router.replace("/login");
      return;
    }

    if (!/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(backupCode)) {
      setError("Enter a valid backup code in XXXXX-XXXXX format.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await verifyBackupCode({
        challengeId,
        code: backupCode,
        trustDevice,
      });

      console.log("[MFA] Backup Code Verification Result:", result);

      if (!result.success) {
        toast.error(result.message);
        setError(result.message);
        return;
      }

      if (!result.user) {
        toast.error("User information is missing. Please login again.");
        router.replace("/login");
        return;
      }

      // Calculate remaining backup codes.
      const remainingBackupCodes = Math.max(
        0,
        (loginContext?.backup_codes_remaining ?? 0) - 1,
      );

      // Remove backup method if no codes remain.
      const updatedMethods =
        remainingBackupCodes > 0
          ? (loginContext?.methods ?? [])
          : (loginContext?.methods ?? []).filter(
              (method) => method !== "backup",
            );

      // Store authenticated user.
      dispatch(setUser(result.user));

      // Update MFA details in Redux.
      dispatch(
        updateMfaDetails({
          loginMethods: updatedMethods,
          backupCodesRemaining: remainingBackupCodes,
        }),
      );

      // Clear login challenge session.
      clearAuthenticatedLoginSession();

      toast.success(result.message);

      // Redirect based on assigned roles.
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
      console.error("[MFA] Backup Code Verification Error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setBackupCode("");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-110 rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-7">
      {/* Back to Login */}
      <Link
        href="/login"
        onClick={clearAuthenticatedLoginSession}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>

      {/* Brand */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <ShieldCheck size={22} />
        </div>

        <div>
          <p className="font-semibold leading-tight text-text-primary">UAM</p>

          <p className="mt-1 text-sm leading-tight text-text-secondary">
            Authentication
          </p>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        Enter a backup code
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Enter one of the one-time backup codes you saved when you set up your
        account.
      </p>

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={handleVerify} noValidate>
        {/* Backup Code Input */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* First 5 Characters */}
            <div className="space-y-2">
              <input
                ref={firstBlockRef}
                type="text"
                value={backupCode.replace(/-/g, "").slice(0, 5)}
                onChange={(event) => handleCodeChange(event.target.value)}
                onPaste={(event) => {
                  event.preventDefault();
                  handleCodeChange(event.clipboardData.getData("text"));
                }}
                placeholder="XXXXX"
                maxLength={10}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                disabled={isSubmitting || !isSessionReady}
                className="h-14 w-full rounded-xl border border-border-default bg-white px-3 text-center font-mono text-lg font-bold uppercase tracking-[0.2em] text-text-primary outline-none transition-all placeholder:text-text-muted placeholder:tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60 sm:h-16"
              />
            </div>

            {/* Second 5 Characters */}
            <div className="space-y-2">
              <input
                ref={secondBlockRef}
                type="text"
                value={backupCode.replace(/-/g, "").slice(5, 10)}
                onChange={(event) => {
                  const first = backupCode.replace(/-/g, "").slice(0, 5);

                  const second = event.target.value
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .slice(0, 5);

                  handleCodeChange(first + second);
                }}
                onPaste={(event) => {
                  event.preventDefault();

                  const first = backupCode.replace(/-/g, "").slice(0, 5);

                  handleCodeChange(first + event.clipboardData.getData("text"));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !event.currentTarget.value) {
                    firstBlockRef.current?.focus();
                  }
                }}
                placeholder="XXXXX"
                maxLength={5}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                disabled={isSubmitting || !isSessionReady}
                className="h-14 w-full rounded-xl border border-border-default bg-white px-3 text-center font-mono text-lg font-bold uppercase tracking-[0.2em] text-text-primary outline-none transition-all placeholder:text-text-muted placeholder:tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60 sm:h-16"
              />
            </div>
          </div>

          {/* Format Hint */}
          <p className="text-xs text-text-secondary">
            Enter your 10-character recovery code in two blocks.
          </p>

          {error && <p className="text-xs font-medium text-danger">{error}</p>}
        </div>

        {/* Trusted Device */}
        <label
          htmlFor="trust-backup-device"
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-white/70 p-3 transition-colors hover:border-primary/40"
        >
          <input
            id="trust-backup-device"
            type="checkbox"
            checked={trustDevice}
            onChange={(event) => setTrustDevice(event.target.checked)}
            disabled={isSubmitting || !isSessionReady}
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
          loading={isSubmitting}
          disabled={
            !isSessionReady ||
            !challengeId ||
            !/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(backupCode)
          }
          rightIcon={!isSubmitting && <ArrowRight size={18} />}
        >
          Verify and continue
        </Button>
      </form>

      {/* Alternative Method */}
      <p className="mt-5 text-center text-xs text-text-secondary">
        Don&apos;t have a backup code?{" "}
        <Link
          href="/factor-choice"
          className="font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          Use another method
        </Link>
      </p>
    </div>
  );
}

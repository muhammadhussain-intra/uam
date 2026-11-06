"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  KeyRound,
  Circle,
  CircleDot,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { clearLoginSession } from "@/utils/authSession";
import {
  selectFactor,
  type LoginMethod,
} from "../actions/factor-choice";

const LOGIN_CONTEXT_KEY = "uam_login_context";

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

interface FactorOption {
  id: LoginMethod;
  title: string;
  description: string;
  icon: LucideIcon;
}

const factorOptions: FactorOption[] = [
  {
    id: "totp",
    title: "Authenticator App",
    description: "Code from your authenticator app",
    icon: Smartphone,
  },
  {
    id: "otp",
    title: "Email Verification",
    description: "Receive a verification code by email",
    icon: MessageSquare,
  },
  {
    id: "backup",
    title: "Backup Code",
    description: "Use one of your saved recovery codes",
    icon: KeyRound,
  },
];

export default function FactorChoiceForm() {
  const router = useRouter();

  const [context, setContext] = useState<LoginContext | null>(null);
  const [selectedFactor, setSelectedFactor] =
    useState<LoginMethod | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load and validate the common login context
  useEffect(() => {
    const storedContext = sessionStorage.getItem(LOGIN_CONTEXT_KEY);

    if (!storedContext) {
      toast.error("Authentication session expired.");
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedContext) as LoginContext;

      const availableMethods = Array.isArray(parsed.methods)
        ? parsed.methods.filter(
            (method): method is LoginMethod =>
              method === "otp" ||
              method === "totp" ||
              method === "backup",
          )
        : [];

      if (
        !Number.isInteger(parsed.challenge_id) ||
        parsed.challenge_id <= 0 ||
        parsed.mfa_required !== true ||
        availableMethods.length === 0
      ) {
        toast.error("Invalid authentication session.");
        router.replace("/login");
        return;
      }

      const validContext: LoginContext = {
        email: parsed.email ?? "",
        challenge_id: parsed.challenge_id,
        expires_in: parsed.expires_in ?? 300,
        mfa_required: true,
        methods: availableMethods,
        backup_codes_remaining: parsed.backup_codes_remaining ?? 0,
        programs: parsed.programs ?? [],
      };

      setContext(validContext);
      setSelectedFactor(availableMethods[0]);

      console.log("[MFA] Factor Choice Context:", validContext);
    } catch (error) {
      console.error("[MFA] Invalid Login Context:", error);
      toast.error("Unable to read authentication session.");
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Continue with selected factor
  async function handleContinue() {
    if (!context || !selectedFactor || isSubmitting) {
      toast.error("Please select a verification method.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save selected method in the same context
      const updatedContext: LoginContext = {
        ...context,
        selected_method: selectedFactor,
      };

      sessionStorage.setItem(
        LOGIN_CONTEXT_KEY,
        JSON.stringify(updatedContext),
      );

      // Backup codes use the recovery API on the next page
      if (selectedFactor === "backup") {
        router.replace("/backup-codes");
        return;
      }

      const result = await selectFactor({
        challengeId: context.challenge_id,
        method: selectedFactor,
      });

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.replace(result.data.nextRoute);
    } catch (error) {
      console.error("[MFA] Continue Error:", error);
      toast.error("Unable to continue verification.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-110 rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-7">
      <Link
        href="/login"
        onClick={clearLoginSession}
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
          <p className="font-semibold leading-tight text-text-primary">
            UAM
          </p>
          <p className="mt-1 text-sm leading-tight text-text-secondary">
            Authentication
          </p>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
        Choose a verification method
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Select how you would like to verify your identity and finish signing in.
      </p>

      {/* Email */}
      {context?.email && (
        <div className="mt-4 rounded-lg border border-border-default bg-white/70 px-3 py-2">
          <p className="text-xs text-text-secondary">
            Signing in as{" "}
            <span className="font-semibold text-text-primary">
              {context.email}
            </span>
          </p>
        </div>
      )}

      {/* Factor options */}
      <div className="mt-5 space-y-3">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            Loading verification methods...
          </div>
        ) : (
          factorOptions
            .filter((factor) => context?.methods.includes(factor.id))
            .map((factor) => {
              const Icon = factor.icon;
              const isSelected = selectedFactor === factor.id;

              return (
                <button
                  key={factor.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedFactor(factor.id)}
                  aria-pressed={isSelected}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-white shadow-sm ring-1 ring-primary"
                      : "border-border-default bg-white/70 hover:border-primary/50 hover:bg-white",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-green-light text-primary"
                        : "bg-subtle text-primary",
                    ].join(" ")}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {factor.title}
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {factor.id === "backup"
                        ? `${context?.backup_codes_remaining ?? 0} recovery codes available`
                        : factor.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-primary">
                    {isSelected ? (
                      <CircleDot size={20} />
                    ) : (
                      <Circle size={20} className="text-border-strong" />
                    )}
                  </div>
                </button>
              );
            })
        )}
      </div>

      {/* Continue */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        className="mt-5"
        loading={isSubmitting}
        disabled={isLoading || !selectedFactor || !context}
        rightIcon={!isSubmitting && <ArrowRight size={18} />}
        onClick={handleContinue}
      >
        Continue
      </Button>

      <p className="mt-4 text-center text-xs text-text-secondary">
        Your account security is our priority.
      </p>
    </div>
  );
}
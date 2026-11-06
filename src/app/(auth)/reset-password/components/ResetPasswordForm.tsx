"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../reset-password.schema";

import resetPassword from "../actions/resetPassword";
import { clearRecoverySession } from "@/utils/authSession";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryOtp, setRecoveryOtp] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const email = sessionStorage.getItem("uam_recovery_email");
    const otp = sessionStorage.getItem("uam_recovery_otp");
    const token = sessionStorage.getItem("uam_reset_token");

    if (!email || !otp || !token) {
      clearRecoverySession();

      toast.error("Recovery session expired", {
        description: "Please verify your OTP again.",
      });

      router.replace("/forgot-password");
      return;
    }

    setRecoveryEmail(email);
    setRecoveryOtp(otp);
    setRecoveryToken(token);
    setIsRecoveryReady(true);
  }, [router]);

  // Password values
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Password policies
  // const policies = [
  //   {
  //     label: "At least 8 characters",
  //     valid: password.length >= 8,
  //   },
  //   {
  //     label: "At least one uppercase letter",
  //     valid: /[A-Z]/.test(password),
  //   },
  //   {
  //     label: "At least one lowercase letter",
  //     valid: /[a-z]/.test(password),
  //   },
  //   {
  //     label: "At least one number",
  //     valid: /[0-9]/.test(password),
  //   },
  //   {
  //     label: "At least one special character",
  //     valid: /[^A-Za-z0-9]/.test(password),
  //   },
  //   {
  //     label: "New and confirm passwords match",
  //     valid: password.length > 0 && password === confirmPassword,
  //   },
  // ];

  // Handle Reset Password Submission

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!isRecoveryReady || !recoveryEmail || !recoveryOtp || !recoveryToken) {
      toast.error("Recovery session expired", {
        description: "Please verify your OTP again.",
      });

      router.replace("/forgot-password");
      return;
    }

    try {
      const result = await resetPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
        reset_token: recoveryToken,
        email: recoveryEmail,
        otp: recoveryOtp,
      });

      if (!result.success) {
        toast.error("Failed to reset password", {
          description: result.message,
        });
        return;
      }

      clearRecoverySession();

      toast.success("Password reset successfully!", {
        description: "Your password has been updated. Please sign in.",
      });

      router.replace("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      reset();
    }
  }

  // Handle Form Validation
  function onInvalid() {
    toast.error("Password policy not met", {
      description:
        "Please ensure your new password satisfies all required rules.",
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-[36px]">
          Reset password
        </h2>

        <p className="mt-2 text-sm leading-snug text-text-secondary">
          Create a new password and confirm it to regain access.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-4"
      >
        {/* New password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              id="new-password"
              name={field.name}
              label="New password"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              leftIcon={<LockKeyhole size={17} />}
              inputSize="md"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Confirm password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              id="confirm-password"
              name={field.name}
              label="Confirm password"
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              leftIcon={<LockKeyhole size={17} />}
              inputSize="md"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Password policy */}
        {/* <div className="rounded-lg border border-border-default bg-white/80 p-3">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Password policy
          </h3>

          <ul className="space-y-2">
            {policies.map((policy) => (
              <li
                key={policy.label}
                className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary"
              >
                <Check
                  size={15}
                  className={`mt-0.5 shrink-0 ${
                    policy.valid ? "text-success" : "text-text-muted"
                  }`}
                />

                <span>{policy.label}</span>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isRecoveryReady}
          loading={isSubmitting}
          leftIcon={!isSubmitting ? <ShieldCheck size={17} /> : undefined}
          className="h-11"
        >
          Reset Password
        </Button>
      </form>

      {/* Return to login */}
      <p className="mt-5 text-center text-xs text-text-secondary">
        Ready to sign in?{" "}
        <Link
          href="/login"
          onClick={clearRecoverySession}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Return to login
        </Link>
      </p>
    </div>
  );
}

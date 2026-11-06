"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

import forgotPassword from "../actions/forgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../forgot-password.schema";
import {
  clearLoginSession,
  clearRecoverySession,
} from "@/utils/authSession";
import { useEffect } from "react";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
  // Password recovery start karte waqt incomplete login flow clear.
  clearLoginSession();
  clearRecoverySession();
}, []);

  // Handle Forgot Password Submission
  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      const result = await forgotPassword(values);

      clearRecoverySession();

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      sessionStorage.setItem("uam_recovery_email", values.email);

      toast.success("OTP request successful", {
        description: result.message,
      });

      router.push("/reset-otp");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      reset();
    }
  }

  // Handle Form Validation
  function onInvalid() {
    toast.error("Invalid email address", {
      description: "Please enter a valid registered email to continue.",
    });
  }

  return (
    <div className="w-full max-w-110 rounded-2xl border border-white/50 bg-white/65 p-6 shadow-(--shadow-modal) backdrop-blur-xl sm:p-8">
      {/* Brand */}
      <div className="mb-7 flex items-center gap-3">
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
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-[36px]">
        Forgot password?
      </h2>

      <p className="mt-2 text-base leading-snug text-text-secondary">
        Enter your registered email to receive a verification code.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="mt-7 space-y-6"
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              id="recovery-email"
              name={field.name}
              label="Registered email"
              type="email"
              placeholder="name@university.edu"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              inputSize="lg"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
        >
          Send OTP
        </Button>
      </form>

      {/* Back to Login */}
      <p className="mt-7 text-center text-sm text-text-secondary">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline"
        >
          Back to login
        </Link>
      </p>
      {/* Backup Code Recovery */}
      {/* <div className="mt-5 border-t border-border-default/70 pt-5 text-center">
        <p className="text-sm text-text-secondary">
          Can't access your authenticator or email?
        </p>

        <Link
          href="/backup-codes"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline"
        >
          <ShieldCheck size={16} />
          Recover using Backup Code
        </Link>
      </div> */}
    </div>
  );
}

import { ShieldCheck, KeyRound, LockKeyhole } from "lucide-react";
import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const OTP_LENGTH = 6;

export const RESEND_OTP_COOLDOWN_SECONDS = 60;

export const OTP_RESEND_EXPIRY_KEY =
  "uam_otp_resend_expires_at";

  export const OTP_EXPIRY_KEY = "uam_login_otp_expires_at";

export const otpFeatures: AuthFeature[] = [
  {
    id: "identity",
    icon: ShieldCheck,
    title: "Identity verification",
    description: "Verify your identity before accessing your workspace.",
  },
  {
    id: "authentication",
    icon: KeyRound,
    title: "Two-step authentication",
    description: "Use a secure verification code for an additional layer of protection.",
  },
  {
    id: "security",
    icon: LockKeyhole,
    title: "Secure workspace",
    description: "Help protect your account and sensitive information.",
  },
];
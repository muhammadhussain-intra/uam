import { UsersRound, ShieldCheck, FileText } from "lucide-react";
import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 60;
export const DEFAULT_OTP_EMAIL = "n•••@university.edu";
export const OTP_EXPIRY_SECONDS = 300;
export const RECOVERY_OTP_EXPIRY_KEY =
  "uam_recovery_otp_expires_at";
export const RECOVERY_OTP_RESEND_KEY =
  "uam_recovery_otp_resend_expires_at";
  
export const otpFeatures: AuthFeature[] = [
  {
    id: "identity",
    icon: UsersRound,
    title: "Identity verification",
    description: "Confirm your identity with a one-time code.",
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Secure access",
    description: "Add another layer of account security.",
  },
  {
    id: "accounts",
    icon: FileText,
    title: "Protected accounts",
    description: "Help keep accounts and data secure.",
  },
];


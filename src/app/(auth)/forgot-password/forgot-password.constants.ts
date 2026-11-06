import { UsersRound, ShieldCheck, FileText } from "lucide-react";
import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const forgotPasswordFeatures: AuthFeature[] = [
  {
    id: "verified-recovery",
    icon: UsersRound,
    title: "Verified recovery",
    description: "Confirm ownership of your account.",
  },
  {
    id: "secure-verification",
    icon: ShieldCheck,
    title: "Secure verification",
    description: "Use a one-time code.",
  },
  {
    id: "easy-recovery",
    icon: FileText,
    title: "Easy recovery",
    description: "Return to your workspace securely.",
  },
];


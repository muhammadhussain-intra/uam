import { UsersRound, ShieldCheck, FileText } from "lucide-react";
import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const resetPasswordFeatures: AuthFeature[] = [
  {
    id: "credentials",
    icon: UsersRound,
    title: "Strong credentials",
    description: "Follow your organization's password policy.",
  },
  {
    id: "protection",
    icon: ShieldCheck,
    title: "Password protection",
    description: "Choose a new password.",
  },
  {
    id: "access",
    icon: FileText,
    title: "Secure access",
    description: "Protect your account going forward.",
  },
];


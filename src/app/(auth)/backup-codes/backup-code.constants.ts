import {
  UsersRound,
  ShieldCheck,
  FileText,
} from "lucide-react";

import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const backupCodeFeatures: AuthFeature[] = [
  {
    id: "account-recovery",
    icon: UsersRound,
    title: "Account Recovery",
    description:
      "Regain access when you cannot use your authenticator.",
  },
  {
    id: "one-time-codes",
    icon: ShieldCheck,
    title: "One-time Codes",
    description:
      "Each recovery code can only be used once.",
  },
  {
    id: "secure-storage",
    icon: FileText,
    title: "Secure Storage",
    description:
      "Download and store your codes in a safe place.",
  },
];
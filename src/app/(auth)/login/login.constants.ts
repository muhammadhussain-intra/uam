import { UsersRound, ShieldCheck, FileText } from "lucide-react";
import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const loginFeatures: AuthFeature[] = [
  {
    id: "role-access",
    icon: UsersRound,
    title: "Role-based access",
    description: "Assign the right access to the right people.",
  },
  {
    id: "secure-signin",
    icon: ShieldCheck,
    title: "Secure sign-in",
    description: "Strong authentication and account security.",
  },
  {
    id: "audit-activity",
    icon: FileText,
    title: "Audit-ready activity",
    description: "Track and monitor all actions.",
  },
];


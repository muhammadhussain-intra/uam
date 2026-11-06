import {
  UsersRound,
  ShieldCheck,
  FileText,
} from "lucide-react";

import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const workspaceFeatures: AuthFeature[] = [
  {
    id: "assigned-workspaces",
    icon: UsersRound,
    title: "Assigned Workspaces",
    description:
      "Only programs available to your account.",
  },
  {
    id: "role-access",
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Tools and data match your permissions.",
  },
  {
    id: "seamless-switching",
    icon: FileText,
    title: "Seamless Switching",
    description:
      "Continue in the right workspace.",
  },
];
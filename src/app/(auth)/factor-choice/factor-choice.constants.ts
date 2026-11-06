import {
  ShieldCheck,
  Fingerprint,
  LockKeyhole,
} from "lucide-react";

import type { AuthFeature } from "@/components/auth/ReusableLayout";

export const factorChoiceFeatures: AuthFeature[] = [
  {
    id: "sso",
    icon: ShieldCheck,
    title: "Single Sign-On (SSO)",
    description:
      "Sign in securely using your organization's identity provider.",
  },
  {
    id: "mfa",
    icon: Fingerprint,
    title: "Multi-Factor Authentication",
    description:
      "Verify your identity with an additional authentication factor.",
  },
  {
    id: "protected",
    icon: LockKeyhole,
    title: "Protected Access",
    description:
      "Keep your account and education data protected at every sign-in.",
  },
];
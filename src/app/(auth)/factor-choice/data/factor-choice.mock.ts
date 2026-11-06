export type FactorId =
  | "authenticator_app"
  | "otp"
  | "backup_code";

export interface VerificationFactor {
  id: FactorId;
  title: string;
  description: string;
  enabled: boolean;
}

export const mockVerificationFactors: VerificationFactor[] = [
  {
    id: "authenticator_app",
    title: "Authenticator App",
    description: "Code from your authenticator app",
    enabled: true,
  },
  {
    id: "otp",
    title: "One-Time Code (OTP)",
    description: "Receive a code by email or SMS",
    enabled: true,
  },
  {
    id: "backup_code",
    title: "Backup Code",
    description: "Use a saved recovery code",
    enabled: true,
  },
];
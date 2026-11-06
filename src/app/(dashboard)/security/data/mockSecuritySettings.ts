export interface SsoProvider {
  id: string;
  name: string;
  description: string;
  status: "connected" | "not-connected" | "pending";
  details: string;
}

export const mockSsoProviders: SsoProvider[] = [
  {
    id: "google",
    name: "Google Workspace",
    description: "university.edu",
    status: "connected",
    details: "Last synced 2 hours ago",
  },
  {
    id: "microsoft",
    name: "Microsoft Entra ID",
    description: "No tenant linked yet",
    status: "not-connected",
    details: "",
  },
  {
    id: "saml",
    name: "SAML / OIDC Custom Provider",
    description: "Metadata upload pending",
    status: "pending",
    details: "",
  },
];

export const mockSecurityConfig = {
  requireMfa: true,
  trustedDevices: true,
  backupCodes: true,
  sessionTimeout: "30",
};

export const mockMfaConfig = {
  enabled: true,
  totpEnabled: true,
  backupCodesGenerated: 8,
  backupCodesRemaining: 6,
  connectedProviders: 1,
  totalProviders: 3,
};
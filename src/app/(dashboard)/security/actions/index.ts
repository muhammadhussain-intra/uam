
export {
  enrollTotp,
  confirmTotp,
  disableMfa,
  deleteMfaFactor,
} from "./totp";

export {
  generateBackupCodes,
  getBackupCodesStatus,
} from "./backup-codes";

export {
  getTrustedDevices,
  trustDevice,
  revokeTrustedDevice,
} from "./trusted-devices";

// ==========================================
// Types
// ==========================================

export type {
  TotpEnrollPayload,
  TotpConfirmPayload,
  DisableMfaPayload,
  TotpEnrollmentData,
  TotpEnrollmentResponse,
  TotpConfirmationData,
  TotpConfirmationResponse,
} from "./totp";

export type {
  GenerateBackupCodesPayload,
  // GenerateBackupCodesResponse,
  // BackupCodesStatusResponse,
} from "./backup-codes";

export type {
  TrustDevicePayload,
  TrustedDevice,
  TrustedDevicesResponse,
  TrustDeviceResponse,
} from "./trusted-devices";

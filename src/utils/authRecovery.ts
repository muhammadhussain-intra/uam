
export function clearRecoverySession() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("uam_recovery_email");
  sessionStorage.removeItem("uam_recovery_otp");
  sessionStorage.removeItem("uam_reset_token");
}

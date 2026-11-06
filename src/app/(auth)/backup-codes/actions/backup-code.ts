import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";
import { getDeviceInfo } from "@/utils/deviceInfo";

import type { AuthUser } from "@/types/auth.types";

export interface VerifyBackupCodePayload {
  challengeId: number;
  code: string;
  trustDevice: boolean;
}

export type VerifyBackupCodeResult = {
  success: boolean;
  message: string;
  code?: string;
  user?: AuthUser;
};

interface BackupCodeApiResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user?: AuthUser;
    backup_codes_remaining?: number;
    expires_in?: number;
    selection_required?: boolean;
    token_type?: string;
  };
}

export async function verifyBackupCode(
  values: VerifyBackupCodePayload,
): Promise<VerifyBackupCodeResult> {
  // Validate backup code.
  const normalizedCode = values.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(normalizedCode)) {
    return {
      success: false,
      message: "Please enter a valid backup code.",
      code: "VALIDATION_ERROR",
    };
  }

  try {
const deviceInfo = getDeviceInfo();

const payload = {
  challenge_id: values.challengeId,
  code: normalizedCode,
  trust_device: values.trustDevice,
  device_name: deviceInfo.deviceName,
  device_id: deviceInfo.deviceId,
};

    const response = await axiosInstance.post<BackupCodeApiResponse>(
      "/auth/mfa/recovery",
      payload,
    );

    console.log("[MFA] Backup Code Recovery Response:", response.data);

    if (response.data.status !== "success") {
      return {
        success: false,
        message: response.data.message || "Backup code verification failed.",
        code: "VERIFICATION_FAILED",
      };
    }

    const user = response.data.data?.user;

    if (!user) {
      return {
        success: false,
        message: "User information was not received from the server.",
        code: "MISSING_USER",
      };
    }

    return {
      success: true,
      message: response.data.message || "Backup code verification successful.",
      user,
    };
  } catch (error: unknown) {
    console.error("[MFA] Backup Code Recovery Error:", error);

    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Backup code verification failed. Please try again.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}

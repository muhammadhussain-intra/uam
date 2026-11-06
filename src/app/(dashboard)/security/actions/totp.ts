
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";
import { toast } from "sonner";

// ==========================================
// Request Types
// ==========================================

export interface TotpEnrollPayload {
  password: string;
}

export interface TotpConfirmPayload {
  setup_token: string;
  code: string;
}

export interface DisableMfaPayload {
  code?: string;
}

// ==========================================
// Response Types
// ==========================================


export interface TotpEnrollmentData {
  setup_token: string;
  secret: string;
  otpauth_uri: string;
  issuer: string;
  digits: number;
  period: number;
}

export interface TotpEnrollmentResponse {
  status: "success" | "error";
  message: string;
  data: TotpEnrollmentData;
}


export interface TotpConfirmationData {
  enabled: boolean;
  factor_id?: number;
  factor_type?: string;
}

export interface TotpConfirmationResponse {
  success?: boolean;
  message?: string;
  data?: TotpConfirmationData;
}

// ==========================================
// 1. Enroll TOTP
// ==========================================

export async function enrollTotp(
  payload: TotpEnrollPayload,
) {
  try {
    const response = await axiosInstance.post(
      "/auth/mfa/totp/enroll",
      payload,
    );

    console.log("[MFA] TOTP Enrollment Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "TOTP enrollment failed.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data as TotpEnrollmentResponse;
  } catch (error) {
    console.error("[MFA] TOTP Enrollment Error:", error);
    handleApiError(error);
    return null;
  }
}

// ==========================================
// 2. Confirm TOTP
// ==========================================

export async function confirmTotp(
  payload: TotpConfirmPayload,
) {
  try {
    const response = await axiosInstance.post(
      "/auth/mfa/totp/confirm",
      payload,
    );

    console.log("[MFA] TOTP Confirmation Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "TOTP verification failed.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data as TotpConfirmationResponse;
  } catch (error) {
    console.error("[MFA] TOTP Confirmation Error:", error);
    handleApiError(error);
    return null;
  }
}

// ==========================================
// 3. Disable MFA
// ==========================================

export async function disableMfa(
  payload?: DisableMfaPayload,
) {
  try {
    const response = await axiosInstance.post(
      "/auth/mfa/disable",
      payload ?? {},
    );

    console.log("[MFA] Disable MFA Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "Unable to disable MFA.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("[MFA] Disable MFA Error:", error);
    handleApiError(error);
    return null;
  }
}

// ==========================================
// 4. Delete MFA Factor
// ==========================================

export async function deleteMfaFactor(
  factorId: number,
  payload?: DisableMfaPayload,
) {
  try {
    const response = await axiosInstance.delete(
      `/auth/mfa/factors/${factorId}`,
      {
        data: payload ?? {},
      },
    );

    console.log("[MFA] Delete MFA Factor Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "Unable to delete MFA factor.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("[MFA] Delete MFA Factor Error:", error);
    handleApiError(error);
    return null;
  }
}

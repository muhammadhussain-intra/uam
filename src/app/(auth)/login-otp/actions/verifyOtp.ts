
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";
import { getDeviceInfo } from "@/utils/deviceInfo";

import {
  otpVerificationSchema,
  type OtpVerificationFormValues,
} from "../login-otp-verification.schema";

import type { AuthUser } from "@/types/auth.types";

export type LoginMethod = "otp" | "totp";

export type VerifyOtpResult = {
  success: boolean;
  message: string;
  code?: string;
  user?: AuthUser;
};

interface VerifyOtpApiResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user?: AuthUser;
  };
}

type VerifyOtpPayload = OtpVerificationFormValues & {
  email: string;
  challengeId: number;
  method: LoginMethod;
  trustDevice: boolean;
};

export default async function verifyOtp(
  values: VerifyOtpPayload,
): Promise<VerifyOtpResult> {
  const validation = otpVerificationSchema.safeParse({
    otp: values.otp,
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Please enter a valid 6-digit verification code.",
      code: "VALIDATION_ERROR",
    };
  }

  try {
    // Always send the same browser device identity.
    const deviceInfo = getDeviceInfo();

    const apiMethod =
      values.method === "totp" ? "totp" : "email";

    const payload = {
      code: validation.data.otp,
      challenge_id: values.challengeId,
      method: apiMethod,
      trust_device: values.trustDevice,
      device_name: deviceInfo.deviceName,
    };

    console.log("[MFA] Verification Request:", {
      ...payload,
      device_name: deviceInfo.deviceName.split(" • Device ID:")[0] +
        " • Device ID: [hidden]",
    });

    const response =
      await axiosInstance.post<VerifyOtpApiResponse>(
        "/auth/mfa/verify",
        payload,
      );

    console.log("[MFA] Verification Response:", response.data);

    if (response.data.status !== "success") {
      return {
        success: false,
        message:
          response.data.message || "Verification failed.",
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
      message: response.data.message || "Verification successful.",
      user,
    };
  } catch (error: unknown) {
    console.error("[MFA] Verification Error:", error);

    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Verification failed. Please try again.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}

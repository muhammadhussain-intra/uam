/*
  Resend OTP Action - API integration
*/

import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

// Types
export interface ResendOtpResult {
  success: boolean;
  message: string;
  code?: string;
}

interface ResendOtpApiResponse {
  message?: string;
}

// Resend OTP Action
export default async function resendOtp(
  email: string,
): Promise<ResendOtpResult> {
  if (!email?.trim()) {
    return {
      success: false,
      message: "Email address is missing. Please restart password recovery.",
      code: "EMAIL_REQUIRED",
    };
  }

  try {
    // API Request
    const response = await axiosInstance.post<ResendOtpApiResponse>(
      "/auth/password/forgot",
      {
        email,
      },
    );

    return {
      success: true,
      message:
        response.data?.message ||
        "A new verification code has been requested.",
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to resend verification code.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}
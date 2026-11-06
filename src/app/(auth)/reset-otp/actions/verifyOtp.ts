
/*
  Verify OTP Action - API integration
*/

import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

import {
  otpVerificationSchema,
  type OtpVerificationFormValues,
} from "../reset-password-otp.schema";

// Types
export interface VerifyOtpResult {
  success: boolean;
  message: string;
  resetToken?: string;
  code?: string;
}

interface VerifyOtpApiResponse {
  status?: string;
  message?: string;
  data?: {
    reset_token?: string;
  };
}

// Verify OTP Action
export default async function verifyOtp(
  values: OtpVerificationFormValues & { email: string },
): Promise<VerifyOtpResult> {
  // Validate OTP
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

  // Check recovery email
  if (!values.email?.trim()) {
    return {
      success: false,
      message: "Email address is missing. Please restart password recovery.",
      code: "EMAIL_REQUIRED",
    };
  }

  try {
    // API Request
    const response = await axiosInstance.post<VerifyOtpApiResponse>(
      "/auth/otp/verify",
      {
        email: values.email,
        otp: validation.data.otp,
        purpose: "FORGOT_PWD",
      },
    );

    const resetToken = response.data?.data?.reset_token;

    // Ensure reset token exists
    if (!resetToken) {
      return {
        success: false,
        message: "Reset token was not received from the server.",
        code: "RESET_TOKEN_MISSING",
      };
    }

    return {
      success: true,
      message: response.data?.message || "OTP verified successfully.",
      resetToken,
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Invalid or expired verification code.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}

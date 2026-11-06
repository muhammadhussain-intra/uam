
/*
  Reset Password Action - API integration
*/

import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../reset-password.schema";

// Types
export interface ResetPasswordResult {
  success: boolean;
  message: string;
  code?: string;
}

// API Payload
interface ResetPasswordPayload {
  reset_token: string;
  email: string;
  otp: string;
  new_password: string;
}

interface ResetPasswordApiResponse {
  message?: string;
}

// Reset Password Action
export default async function resetPassword(
  values: ResetPasswordFormValues & {
    reset_token: string;
    email: string;
    otp: string;
  },
): Promise<ResetPasswordResult> {

  // Validate form data
  const validation = resetPasswordSchema.safeParse({
    password: values.password,
    confirmPassword: values.confirmPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Please check your password and try again.",
      code: "VALIDATION_ERROR",
    };
  }

  // Validate recovery details
  if (
    !values.reset_token?.trim() ||
    !values.email?.trim() ||
    !values.otp?.trim()
  ) {
    return {
      success: false,
      message:
        "Your recovery session has expired. Please verify your OTP again.",
      code: "RECOVERY_SESSION_MISSING",
    };
  }

  try {
    // Prepare API payload
    const payload: ResetPasswordPayload = {
      reset_token: values.reset_token,
      email: values.email,
      otp: values.otp,
      new_password: validation.data.password,
    };

    // API Request
    const response =
      await axiosInstance.post<ResetPasswordApiResponse>(
        "/auth/password/reset",
        payload,
      );

    return {
      success: true,
      message:
        response.data?.message ||
        "Your password has been reset successfully.",
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage:
        "Unable to reset password. Your OTP may be invalid or expired.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}

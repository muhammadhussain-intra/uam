/*
  Forgot Password Action - API integration
*/

import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../forgot-password.schema";

// Types
export interface ForgotPasswordResult {
  status: "success" | "error";
  message: string;
  code?: string;
}

interface ForgotPasswordApiResponse {
  message?: string;
}

// Forgot Password Action
export default async function forgotPassword(
  values: ForgotPasswordFormValues,
): Promise<ForgotPasswordResult> {
  // Validate form data
  const validation = forgotPasswordSchema.safeParse(values);

  if (!validation.success) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      code: "VALIDATION_ERROR",
    };
  }

  try {
    // API Request
    const response = await axiosInstance.post<ForgotPasswordApiResponse>(
      "/auth/password/forgot",
      {
        email: validation.data.email,
      },
    );

    return {
      status: "success",
      message:
        response.data?.message ||
        "Verification code sent successfully.",
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to process your password recovery request.",
    });

    return {
      status: "error",
      message: apiError.message,
      code: apiError.code,
    };
  }
}
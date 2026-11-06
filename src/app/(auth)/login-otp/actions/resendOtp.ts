import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

export type ResendOtpResult = {
  success: boolean;
  message: string;
  code?: string;
};

interface ResendOtpApiResponse {
  status: "success" | "error";
  message: string;
}

export default async function resendOtp(
  email: string,
  challengeId: number,
): Promise<ResendOtpResult> {
  if (!email || !Number.isInteger(challengeId)) {
    return {
      success: false,
      message: "Login session is missing. Please login again.",
      code: "INVALID_CHALLENGE",
    };
  }

  try {
    const response = await axiosInstance.post<ResendOtpApiResponse>(
      "/auth/otp/send",
      {
        email,
        purpose: "LOGIN_OTP",
        challenge_id: challengeId,
      },
    );

    if (response.data.status !== "success") {
      return {
        success: false,
        message: response.data.message || "Unable to resend OTP.",
        code: "RESEND_FAILED",
      };
    }

    return {
      success: true,
      message: response.data.message || "A new OTP has been sent.",
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to resend OTP. Please try again.",
    });

    return {
      success: false,
      message: apiError.message,
      code: apiError.code,
    };
  }
}

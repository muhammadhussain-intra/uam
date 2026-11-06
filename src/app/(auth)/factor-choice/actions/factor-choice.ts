
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

export type LoginMethod = "otp" | "totp" | "backup";

type VerificationMethod = Exclude<LoginMethod, "backup">;

interface OtpChallengeResponse {
  status: "success" | "error";
  message: string;
  data?: {
    challenge_id?: number;
    expires_in?: number;
  };
}

interface ActionResult {
  success: boolean;
  message: string;
  data?: {
    nextRoute: string;
  };
}

export async function selectFactor(payload: {
  challengeId: number;
  method: VerificationMethod;
}): Promise<ActionResult> {
  try {
    const { challengeId, method } = payload;

    if (!challengeId) {
      return {
        success: false,
        message: "Authentication challenge is missing.",
      };
    }

    // TOTP verification happens on the OTP verification screen.
    if (method === "totp") {
      return {
        success: true,
        message: "Authenticator verification selected.",
        data: { nextRoute: "/login-otp" },
      };
    }

    // Request email verification code.
    const response = await axiosInstance.post<OtpChallengeResponse>(
      "/auth/mfa/challenge",
      {
        challenge_id: challengeId,
        method: "email",
      },
    );

    console.log("[MFA] OTP Challenge Response:", response.data);

    if (response.data.status !== "success") {
      return {
        success: false,
        message: response.data.message || "Unable to send OTP.",
      };
    }

    return {
      success: true,
      message: response.data.message || "Verification code sent.",
      data: { nextRoute: "/login-otp" },
    };
  } catch (error: unknown) {
    console.error("[MFA] Factor Selection Error:", error);

    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to continue verification.",
    });

    return {
      success: false,
      message: apiError.message,
    };
  }
}

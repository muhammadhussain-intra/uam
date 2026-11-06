
import axiosInstance from "@/lib/axiosInstance";
import type { AuthUser } from "@/types/auth.types";

import {
  loginSchema,
  type LoginFormValues,
} from "../login.schema";

import { handleApiError } from "@/utils";

// ==========================================
// Types
// ==========================================

export type LoginMethod = "otp" | "totp" | "backup";

export type LoginStatus = {
  message: string;
  type: "success" | "error";

  user?: AuthUser;

  requiresTwoFactor?: boolean;

  challengeId?: number;
  expiresIn?: number;

  methods: LoginMethod[];

  backupCodesRemaining?: number;

  programs?: unknown[];

  code?: string;
};

// ==========================================
// API Response
// ==========================================

interface LoginApiResponse {
  status: "success" | "error";
  message: string;
  request_id?: string;

  data?: {
    mfa_required?: boolean;

    methods?: LoginMethod[];

    challenge_id?: number;

    expires_in?: number;

    backup_codes_remaining?: number;

    programs?: unknown[];

    user?: AuthUser;
  };
}

// ==========================================
// Login Action
// ==========================================

export default async function login(
  formData: LoginFormValues,
): Promise<LoginStatus> {
  try {
    // --------------------------------------
    // 1. Validate Form Data
    // --------------------------------------

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        message: "Please enter a valid email and password.",
        code: "VALIDATION_ERROR",
        methods: [],
      };
    }

    // --------------------------------------
    // 2. Login API Request
    // --------------------------------------

    const response = await axiosInstance.post<LoginApiResponse>(
      "/auth/login",
      validation.data,
    );

    console.log("[AUTH] Login API Response:", response.data);

    const result = response.data;

    // --------------------------------------
    // 3. Check API Status
    // --------------------------------------

    if (result.status !== "success") {
      return {
        type: "error",
        message: result.message || "Login failed.",
        code: "LOGIN_FAILED",
        methods: [],
      };
    }

    // --------------------------------------
    // 4. MFA Required
    // --------------------------------------

    if (result.data?.mfa_required) {
      const challengeId = result.data.challenge_id;

      if (challengeId == null) {
        return {
          type: "error",
          message: "MFA challenge ID is missing.",
          code: "MISSING_CHALLENGE_ID",
          methods: [],
        };
      }

      const methods = result.data.methods ?? [];

      return {
        type: "success",
        message: result.message || "Additional verification required.",

        requiresTwoFactor: true,

        challengeId,
        expiresIn: result.data.expires_in,

        methods,

        backupCodesRemaining:
          result.data.backup_codes_remaining,

        programs: result.data.programs ?? [],
      };
    }

    // --------------------------------------
    // 5. Normal Login Without MFA
    // --------------------------------------

    const user = result.data?.user;

    if (!user) {
      return {
        type: "error",
        message: "User information is missing.",
        code: "MISSING_USER",
        methods: [],
      };
    }

    return {
      type: "success",
      message: result.message || "Login successful!",

      requiresTwoFactor: false,

      user,
      methods: [],
    };
  } catch (error: unknown) {
    console.error("[AUTH] Login API Error:", error);

    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Login failed. Please try again.",
    });

    return {
      type: "error",
      message: apiError.message,
      code: apiError.code,
      methods: [],
    };
  }
}

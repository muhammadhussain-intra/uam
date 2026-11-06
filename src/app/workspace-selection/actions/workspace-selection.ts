import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

interface SelectWorkspacePayload {
  program_id: number;
  role_id: number;
}

interface SelectWorkspaceResponse {
  status: "success" | "error";
  message: string;
  data?: unknown;
}

export interface SelectWorkspaceResult {
  success: boolean;
  message: string;
}

export async function selectWorkspace(
  payload: SelectWorkspacePayload,
): Promise<SelectWorkspaceResult> {
  try {
    return {
      success: true,
      message: "Workspace selection will be implemented by the RBAC team.",
    };

    const response = await axiosInstance.post<SelectWorkspaceResponse>(
      "/auth/workspace",
      {
        program_id: payload.program_id,
        role_id: payload.role_id,
      },
    );

    const result = response.data;

    if (result.status !== "success") {
      return {
        success: false,
        message: result.message || "Unable to select workspace.",
      };
    }

    return {
      success: true,
      message: result.message || "Workspace selected successfully.",
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to select workspace.",
    });

    return {
      success: false,
      message: apiError.message,
    };
  }
}

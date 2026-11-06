
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";
import { toast } from "sonner";

// ==========================================
// Request Types
// ==========================================

export interface GenerateBackupCodesPayload {
  password: string;
}

// ==========================================
// Response Types
// ==========================================


export interface BackupCodesData {
  codes: string[];
  count: number;
}

export interface BackupCodesResponse {
  status: "success" | "error";
  message: string;
  data: BackupCodesData;
}

export async function generateBackupCodes(
  payload: { password: string },
): Promise<BackupCodesResponse | null> {
  try {
    const response = await axiosInstance.post(
      "/auth/mfa/backup-codes",
      payload,
    );

    const result = response.data as BackupCodesResponse;

    // Backup codes sensitive hain: unhein console mein log nahi karna.
    console.log("[MFA] Backup Codes Generated:", {
      status: result.status,
      message: result.message,
      count: result.data?.count,
    });

    if (result.status !== "success") {
      toast.error(result.message || "Unable to generate backup codes.");
      return null;
    }

    if (result.message) {
      toast.success(result.message);
    }

    return result;
  } catch (error) {
    console.error("[MFA] Backup Codes Generation Error:", error);
    handleApiError(error);
    return null;
  }
}


// ==========================================
// 2. Get Backup Codes Status
// ==========================================

export async function getBackupCodesStatus() {
  try {
    const response = await axiosInstance.get(
      "/auth/mfa/backup-codes/status",
    );

    console.log("[MFA] Backup Codes Status Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "Unable to fetch backup codes status.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data as BackupCodesResponse;
  } catch (error) {
    console.error("[MFA] Backup Codes Status Error:", error);
    handleApiError(error);
    return null;
  }
}

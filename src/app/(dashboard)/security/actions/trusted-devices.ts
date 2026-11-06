
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";
import { toast } from "sonner";

// ==========================================
// Request Types
// ==========================================

export interface TrustDevicePayload {
  device_name?: string;
}

// ==========================================
// Response Types
// ==========================================

export interface TrustedDevice {
  id: number;
  name: string;
  current: boolean;
  trusted_at?: string;
  expires_at?: string;
  last_used_at?: string;
}
export interface TrustedDevicesResponse {
  status: "success" | "error";
  message?: string;
  data: TrustedDevice[];
}

export interface TrustDeviceResponse {
  success?: boolean;
  message?: string;
  data: TrustedDevice;
}

// ==========================================
// 1. Get Trusted Devices
// ==========================================

export async function getTrustedDevices(): Promise<TrustedDevicesResponse | null> {
  try {
    const response = await axiosInstance.get(
      "/auth/mfa/trusted-devices",
    );

    console.log("[MFA] Trusted Devices Response:", response.data);

    if (response.data?.status !== "success") {
      toast.error(
        response.data?.message || "Unable to fetch trusted devices.",
      );
      return null;
    }

    return response.data as TrustedDevicesResponse;
  } catch (error) {
    console.error("[MFA] Get Trusted Devices Error:", error);

    handleApiError(error, {
      fallbackMessage: "Unable to fetch trusted devices.",
    });

    return null;
  }
}

// ==========================================
// 2. Trust Current Device
// ==========================================

export async function trustDevice(
  payload?: TrustDevicePayload,
) {
  try {
    const response = await axiosInstance.post(
      "/auth/mfa/trusted-devices",
      payload ?? {},
    );

    console.log("[MFA] Trust Device Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "Unable to trust device.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data as TrustDeviceResponse;
  } catch (error) {
    console.error("[MFA] Trust Device Error:", error);
    handleApiError(error);
    return null;
  }
}

// ==========================================
// 3. Revoke Trusted Device
// ==========================================

export async function revokeTrustedDevice(
  deviceId: number,
) {
  try {
    const response = await axiosInstance.delete(
      `/auth/mfa/trusted-devices/${deviceId}`,
    );

    console.log("[MFA] Revoke Trusted Device Response:", response.data);

    if (response.data?.success === false) {
      toast.error(response.data.message || "Unable to revoke device.");
      return null;
    }

    if (response.data?.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("[MFA] Revoke Trusted Device Error:", error);
    handleApiError(error);
    return null;
  }
}

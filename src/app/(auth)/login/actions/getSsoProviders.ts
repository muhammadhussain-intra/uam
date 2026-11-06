
import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/utils";

export interface SsoProvider {
  code: string;
  name: string;
}

interface SsoProvidersResponse {
  status: "success" | "error";
  message: string;
  data: SsoProvider[];
}

export type SsoProvidersStatus = {
  type: "success" | "error";
  message: string;
  providers: SsoProvider[];
};

export default async function getSsoProviders(): Promise<SsoProvidersStatus> {
  try {
    const response = await axiosInstance.get<SsoProvidersResponse>(
      "/auth/sso/providers",
    );

    const result = response.data;

    if (result.status !== "success") {
      return {
        type: "error",
        message: result.message || "Unable to fetch SSO providers.",
        providers: [],
      };
    }

    return {
      type: "success",
      message: result.message,
      providers: result.data ?? [],
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, {
      showToast: false,
      fallbackMessage: "Unable to fetch SSO providers.",
    });

    return {
      type: "error",
      message: apiError.message,
      providers: [],
    };
  }
}

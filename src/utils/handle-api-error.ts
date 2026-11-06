
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorPayload {
  message?: string;
  detail?: string | { msg?: string; message?: string }[];
  errors?: { message?: string; msg?: string }[];
}

interface HandleApiErrorOptions {
  fallbackMessage?: string;
  showToast?: boolean;
}

export interface ApiErrorResult {
  message: string;
  code: string;
}

export default function handleApiError(
  error: unknown,
  options: HandleApiErrorOptions = {},
): ApiErrorResult {
  const {
    fallbackMessage = "Something went wrong. Please try again later.",
    showToast = true,
  } = options;

  let message = fallbackMessage;
  let code = "SERVICE_ERROR";

  if (typeof error === "string" && error.trim()) {
    message = error;
  } else if (isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    const validationError =
      data?.errors?.[0]?.message ||
      data?.errors?.[0]?.msg;

    const detailError = Array.isArray(data?.detail)
      ? data.detail
          .map((item) => item.msg || item.message)
          .filter(Boolean)
          .join(", ")
      : data?.detail;

    message =
      validationError ||
      (typeof detailError === "string" ? detailError : undefined) ||
      data?.message ||
      (error.response
        ? fallbackMessage
        : "Unable to connect to the server. Please check your connection.");

    code = error.response
      ? `HTTP_${status}`
      : "NETWORK_ERROR";

    // Token expiry is handled by the Axios interceptor.
    const normalizedMessage = message.toLowerCase();

    const isTokenError =
      normalizedMessage.includes("jwt expired") ||
      normalizedMessage.includes("session is expired") ||
      normalizedMessage.includes("token expired");

    if (status === 401 && isTokenError) {
      return { message, code };
    }
  } else if (error instanceof Error) {
    message = error.message || fallbackMessage;
  }

  if (showToast && message) {
    toast.error(message);
  }

  return { message, code };
}

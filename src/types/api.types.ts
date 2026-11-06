
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorDetail {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  status?: string;
  success?: boolean;
  message?: string;
  detail?: string | ApiErrorDetail[];
  errors?: Record<string, string[]>;
  data?: unknown;
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface NormalizedApiError {
  message: string;
  statusCode?: number;
  code?: string;
  validationErrors?: ApiValidationError[];
}

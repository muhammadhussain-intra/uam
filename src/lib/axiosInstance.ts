
import axios, { type AxiosError } from "axios";

const API_DEBUG = false; // to debug api request and response in console

const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request logging
axiosInstance.interceptors.request.use(
  (config) => {
    if (API_DEBUG) {
      console.groupCollapsed(
        `🚀 API REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );

      console.log("URL:", config.url);
      console.log("Method:", config.method?.toUpperCase());
      console.log("Headers:", config.headers);
      console.log("Params:", config.params);
      console.log("Request Data:", config.data);

      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (API_DEBUG) {
      console.error("❌ REQUEST ERROR:", error);
    }

    return Promise.reject(error);
  },
);

// Response logging
axiosInstance.interceptors.response.use(
  (response) => {
    if (API_DEBUG) {
      console.groupCollapsed(
        `✅ API RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      );

      console.log("Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", response.data);

      console.groupEnd();
    }

    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    if (API_DEBUG) {
      console.groupCollapsed(
        `❌ API ERROR: ${error.config?.method?.toUpperCase()} ${url}`,
      );

      console.log("Status:", status);
      console.log("Request Data:", error.config?.data);
      console.log("Response Data:", error.response?.data);
      console.log("Error Message:", error.message);

      console.groupEnd();
    }

    // Auth endpoints par 401 redirect nahi karna
    const isAuthEndpoint = (url = "") =>
      /\/(login|refresh|token\/refresh|logout|otp\/send|otp\/verify|mfa\/challenge|mfa\/verify|password\/forgot|password\/reset)\/?$/i.test(
        url,
      );

    if (
      status === 401 &&
      !isAuthEndpoint(url) &&
      typeof window !== "undefined"
    ) {
      window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.UAM_API_BASE_URL?.replace(/\/+$/, "");
const API_PREFIX = "/api/v1";

const ACCESS_COOKIE = "uam_access_token";
const REFRESH_COOKIE = "uam_refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

type AuthTokens = ReturnType<typeof getTokenData>;

// One refresh operation per refresh token.
const refreshPromises = new Map<string, Promise<AuthTokens>>();

// Cache recently rotated tokens to handle requests carrying stale cookies.
const refreshedTokensCache = new Map<
  string,
  {
    tokens: AuthTokens;
    expiresAt: number;
  }
>();

// Sequential retry queues, isolated per refresh token.
const retryQueues = new Map<string, Promise<void>>();

const REFRESH_CACHE_TTL = 30_000;

interface TokenResponse {
  status?: "success" | "error";
  success?: boolean;
  message?: string;

  access_token?: string;
  refresh_token?: string;
  expires_in?: number;

  data?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;

    user?: unknown;
    mfa_required?: boolean;
    challenge_id?: number;
  };
}

interface ProxyContext {
  params: Promise<{ path: string[] }>;
}

function getTokenData(response: TokenResponse) {
  return {
    accessToken: response.data?.access_token ?? response.access_token,

    refreshToken: response.data?.refresh_token ?? response.refresh_token,

    expiresIn: response.data?.expires_in ?? response.expires_in ?? 900,
  };
}

function isSuccessfulResponse(response: TokenResponse) {
  return response.status === "success" || response.success === true;
}

// Remove tokens before returning API response to frontend.
function sanitizeTokenResponse(response: TokenResponse) {
  const {
    access_token: _accessToken,
    refresh_token: _refreshToken,
    ...rootData
  } = response;

  if (!response.data) {
    return rootData;
  }

  const {
    access_token: _nestedAccessToken,
    refresh_token: _nestedRefreshToken,
    ...nestedData
  } = response.data;

  return {
    ...rootData,
    data: nestedData,
  };
}

// Save tokens in HttpOnly cookies.
function setAuthCookies(
  response: NextResponse,
  tokens: ReturnType<typeof getTokenData>,
) {
  if (tokens.accessToken) {
    response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
      ...cookieOptions,
      maxAge: tokens.expiresIn,
    });
  }

  if (tokens.refreshToken) {
    response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions);
  }
}

// Clear local authentication cookies.
function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

// Refresh expired access token.
async function refreshTokens(refreshToken: string) {
  console.log("[REFRESH] Request started");

  const response = await fetch(
    `${API_BASE_URL}${API_PREFIX}/auth/token/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    },
  );

  console.log("[REFRESH] HTTP status:", response.status);

  const rawBody = await response.text();

  let result: TokenResponse;

  try {
    result = JSON.parse(rawBody) as TokenResponse;
  } catch {
    console.error("[REFRESH] Invalid JSON response");
    throw new Error("Invalid refresh response");
  }

  console.log("[REFRESH] Backend status:", result.status);
  console.log("[REFRESH] Message:", result.message);

  if (!response.ok) {
    throw new Error(`Refresh HTTP error: ${response.status}`);
  }

  if (!isSuccessfulResponse(result)) {
    throw new Error("Refresh response unsuccessful");
  }

  const tokens = getTokenData(result);

  console.log("[REFRESH] Has access token:", Boolean(tokens.accessToken));
  console.log("[REFRESH] Has refresh token:", Boolean(tokens.refreshToken));

  if (!tokens.accessToken) {
    throw new Error("Refresh response missing access token");
  }

  return tokens;
}

async function getSharedRefreshTokens(
  refreshToken: string,
): Promise<AuthTokens> {
  // Remove expired cache entries.
  const now = Date.now();

  for (const [key, value] of refreshedTokensCache) {
    if (value.expiresAt <= now) {
      refreshedTokensCache.delete(key);
    }
  }

  // Reuse recently refreshed tokens for stale-cookie requests.
  const cached = refreshedTokensCache.get(refreshToken);

  if (cached) {
    console.log("[REFRESH] Using cached refreshed tokens");
    return cached.tokens;
  }

  // Reuse an already-running refresh request.
  const existingPromise = refreshPromises.get(refreshToken);

  if (existingPromise) {
    console.log("[REFRESH] Waiting for existing refresh request");
    return existingPromise;
  }

  console.log("[REFRESH] Creating new refresh request");

  const refreshPromise = refreshTokens(refreshToken)
    .then((tokens) => {
      refreshedTokensCache.set(refreshToken, {
        tokens,
        expiresAt: Date.now() + REFRESH_CACHE_TTL,
      });

      return tokens;
    })
    .finally(() => {
      refreshPromises.delete(refreshToken);
    });

  refreshPromises.set(refreshToken, refreshPromise);

  return refreshPromise;
}

async function runSequentially<T>(
  queueKey: string,
  task: () => Promise<T>,
): Promise<T> {
  const previousTask = retryQueues.get(queueKey) ?? Promise.resolve();

  let release!: () => void;

  const currentTask = new Promise<void>((resolve) => {
    release = resolve;
  });

  retryQueues.set(queueKey, currentTask);

  // Wait for previous request to finish.
  await previousTask.catch(() => undefined);

  try {
    return await task();
  } finally {
    release();

    if (retryQueues.get(queueKey) === currentTask) {
      retryQueues.delete(queueKey);
    }
  }
}

// Forward request to backend.
async function forwardRequest(
  request: NextRequest,
  endpoint: string,
  accessToken?: string,
  body?: string,
) {
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const authorization = accessToken
    ? `Bearer ${accessToken}`
    : request.headers.get("authorization");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  // return fetch(
  //   `${API_BASE_URL}${API_PREFIX}/${endpoint}${request.nextUrl.search}`,
  //   {
  //     method: request.method,
  //     headers,
  //     body,
  //     cache: "no-store",
  //   },
  // );
  return fetch(
    `${API_BASE_URL}${API_PREFIX}/${endpoint}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: endpoint === "auth/google/login" ? "manual" : "follow",
    },
  );
}

async function proxyHandler(request: NextRequest, context: ProxyContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "Backend URL is not configured",
      },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const endpoint = path.join("/");

  // // Identify OTP purpose without consuming original request body
  // let otpPurpose: string | undefined;

  // if (endpoint === "auth/otp/verify") {
  //   try {
  //     const body = await request.clone().json();
  //     otpPurpose = body.purpose;
  //   } catch {
  //     otpPurpose = undefined;
  //   }
  // }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  // const isLogin = endpoint === "auth/login";
  // const isOtpVerify = endpoint === "auth/otp/verify";
  // const isOtpSend = endpoint === "auth/otp/send";
  // const isLogout = endpoint === "auth/logout";

  // These endpoints must not trigger access-token refresh.
  // const isAuthFlowEndpoint = isLogin || isOtpVerify || isOtpSend || isLogout;
  // const isAuthFlowEndpoint = isLogin || isOtpVerify || isOtpSend;

  // const isGoogleLogin = endpoint === "auth/google/login";

  // const isSsoLogin = /^auth\/sso\/[^/]+\/login$/.test(endpoint);

  // const isAuthFlowEndpoint =
  //   isLogin || isOtpVerify || isOtpSend || isGoogleLogin || isSsoLogin;

  const isLogin = endpoint === "auth/login";
  const isMfaVerify = endpoint === "auth/mfa/verify";
  const isMfaRecovery = endpoint === "auth/mfa/recovery";

  const isOtpVerify = endpoint === "auth/otp/verify";
  const isOtpSend = endpoint === "auth/otp/send";
  const isLogout = endpoint === "auth/logout";

  const isGoogleLogin = endpoint === "auth/google/login";
  const isSsoLogin = /^auth\/sso\/[^/]+\/login$/.test(endpoint);

const isAuthFlowEndpoint =
  isLogin ||
  isMfaVerify ||
  isMfaRecovery ||
  isOtpVerify ||
  isOtpSend ||
  isGoogleLogin ||
  isSsoLogin;

  // Read request body once so it can be reused during retry.
  const requestBody =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.clone().text();

  try {
    const upstreamResponse = await forwardRequest(
      request,
      endpoint,
      isAuthFlowEndpoint ? undefined : accessToken,
      requestBody,
    );

    console.log("========== AUTH DEBUG ==========");
    console.log("Endpoint:", endpoint);
    console.log("Backend Status:", upstreamResponse.status);
    console.log("Is Auth Endpoint:", isAuthFlowEndpoint);
    console.log("Access Token Exists:", Boolean(accessToken));
    console.log("Refresh Token Exists:", Boolean(refreshToken));
    console.log("================================");

    // Preserve Google OAuth redirect for browser.
    if (
      (isGoogleLogin || isSsoLogin) &&
      [301, 302, 303, 307, 308].includes(upstreamResponse.status)
    ) {
      const location = upstreamResponse.headers.get("location");

      if (!location) {
        return NextResponse.json(
          {
            success: false,
            message: "OAuth redirect URL missing.",
          },
          { status: 502 },
        );
      }

      return NextResponse.redirect(
        new URL(location, API_BASE_URL),
        upstreamResponse.status as 301 | 302 | 303 | 307 | 308,
      );
    }

    // if (isOtpVerify || isOtpSend) {
    //   console.log("Auth endpoint:", endpoint);
    //   console.log("Backend status:", upstreamResponse.status);
    // }

    // Refresh expired access token for protected endpoints.

    // Handle unauthorized protected API requests.
    if (upstreamResponse.status === 401 && !isAuthFlowEndpoint) {
      console.log("[PROXY] Protected API returned 401:", endpoint);

      // Refresh token missing.
      if (!refreshToken) {
        console.log("[PROXY] Refresh token missing. Clearing session.");

        const rawBody = await upstreamResponse.text();

        const response = new NextResponse(rawBody, {
          status: 401,
          headers: {
            "Content-Type":
              upstreamResponse.headers.get("Content-Type") ??
              "application/json",
          },
        });

        clearAuthCookies(response);

        return response;
      }

      try {
        // Step 1: Get shared refreshed tokens.
        // All simultaneous requests share ONE refresh call.
        const tokens = await getSharedRefreshTokens(refreshToken);

        console.log("[PROXY] Refresh completed for:", endpoint);

        // Step 2: Retry original API sequentially.
        const retryResponse = await runSequentially(refreshToken, async () => {
          console.log("[QUEUE] Retrying:", endpoint);

          return forwardRequest(
            request,
            endpoint,
            tokens.accessToken,
            requestBody,
          );
        });

        console.log(
          "[QUEUE] Completed:",
          endpoint,
          "Status:",
          retryResponse.status,
        );

        // Step 3: Read retry response.
        const responseBody = await retryResponse.text();

        const response = new NextResponse(responseBody, {
          status: retryResponse.status,
          headers: {
            "Content-Type":
              retryResponse.headers.get("Content-Type") ?? "application/json",
          },
        });

        // Step 4: Handle retry result.
        if (retryResponse.status === 401) {
          console.error("[AUTH] New access token rejected");

          refreshedTokensCache.delete(refreshToken);

          clearAuthCookies(response);
        } else {
          // Save rotated tokens.
          setAuthCookies(response, {
            ...tokens,
            refreshToken: tokens.refreshToken ?? refreshToken,
          });
        }

        return response;
      } catch (error) {
        console.error("[AUTH] Refresh flow failed:", error);

        refreshedTokensCache.delete(refreshToken);

        const response = NextResponse.json(
          {
            success: false,
            message: "Session expired. Please login again.",
          },
          { status: 401 },
        );

        clearAuthCookies(response);

        return response;
      }
    }

    const rawBody = await upstreamResponse.text();

    let parsedBody: TokenResponse | null = null;

    try {
      parsedBody = JSON.parse(rawBody) as TokenResponse;
    } catch {
      // Non-JSON responses are forwarded unchanged.
    }

    // Login and OTP verification can issue authentication tokens.
    // const canIssueTokens =
    //   isLogin || (isOtpVerify && otpPurpose === "LOGIN_OTP");

    const canIssueTokens =
  isLogin || isMfaVerify || isMfaRecovery;

    if (
      canIssueTokens &&
      upstreamResponse.ok &&
      parsedBody &&
      isSuccessfulResponse(parsedBody)
    ) {
      const tokens = getTokenData(parsedBody);

      const isMfaPending = isLogin && parsedBody.data?.mfa_required === true;

      // MFA login must not require tokens yet.
      if (isMfaPending) {
        const response = NextResponse.json(parsedBody, {
          status: upstreamResponse.status,
        });

        return response;
      }

      // Successful normal login or OTP verification.
      if (tokens.accessToken && tokens.refreshToken) {
        const sanitizedBody = sanitizeTokenResponse(parsedBody);

        const response = NextResponse.json(sanitizedBody, {
          status: upstreamResponse.status,
        });

        setAuthCookies(response, tokens);

        return response;
      }

      // A successful authentication response without tokens
      // is unexpected when MFA is not pending.
      return NextResponse.json(
        {
          success: false,
          message: "Authentication response missing tokens.",
        },
        { status: 502 },
      );
    }

    // Logout: clear local session cookies.

    // Logout: clear cookies only after backend confirms success.
    if (isLogout) {
      const response = new NextResponse(rawBody, {
        status: upstreamResponse.status,
        headers: {
          "Content-Type":
            upstreamResponse.headers.get("Content-Type") ?? "application/json",
        },
      });

      if (
        upstreamResponse.ok &&
        parsedBody &&
        isSuccessfulResponse(parsedBody)
      ) {
        clearAuthCookies(response);
      }

      return response;
    }

    // Forward all other responses.
    return new NextResponse(rawBody, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    const response = NextResponse.json(
      {
        success: false,
        message: "Unable to connect to authentication server.",
      },
      { status: 502 },
    );

    // // End local session even if backend is unavailable during logout.
    // if (isLogout) {
    //   clearAuthCookies(response);
    // }

    return response;
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;

// src/utils/authSession.ts

const LOGIN_SESSION_PREFIXES = [
  "uam_login_",
  "uam_otp_",
];

const RECOVERY_SESSION_PREFIXES = [
  "uam_recovery_",
  "uam_reset_",
];

function clearSessionStorageByPrefixes(prefixes: string[]) {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];

  for (let index = 0; index < sessionStorage.length; index++) {
    const key = sessionStorage.key(index);

    if (key && prefixes.some((prefix) => key.startsWith(prefix))) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

/**
 * Clears incomplete login / MFA flow data.
 * Does not clear recovery data or authenticated cookies.
 */
export function clearLoginSession() {
  if (typeof window === "undefined") return;

  clearSessionStorageByPrefixes(LOGIN_SESSION_PREFIXES);
}

/**
 * Clears password recovery flow data.
 */
export function clearRecoverySession() {
  if (typeof window === "undefined") return;

  clearSessionStorageByPrefixes(RECOVERY_SESSION_PREFIXES);
}

/**
 * Clears both login/MFA and password recovery flow data.
 */
export function clearAuthFlowSession() {
  clearLoginSession();
  clearRecoverySession();
}

/**
 * Clears cookies accessible to JavaScript on the current host.
 * HttpOnly cookies cannot be cleared from browser JavaScript.
 */
export function clearBrowserCookies() {
  if (typeof document === "undefined") return;

  const cookies = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean);

  const hostname = window.location.hostname;
  const domains = [undefined, hostname, `.${hostname}`];

  const paths = new Set<string>(["/"]);
  const currentPath = window.location.pathname;

  let current = "";

  for (const segment of currentPath.split("/").filter(Boolean)) {
    current += `/${segment}`;
    paths.add(current);
    paths.add(`${current}/`);
  }

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0]?.trim();

    if (!cookieName) return;

    paths.forEach((path) => {
      domains.forEach((domain) => {
        let expiredCookie =
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;

        if (domain) {
          expiredCookie += ` domain=${domain};`;
        }

        document.cookie = expiredCookie;
      });
    });
  });
}
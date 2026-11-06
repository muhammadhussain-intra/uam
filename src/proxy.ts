
import { NextRequest, NextResponse } from "next/server";

import {
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTES,
} from "@/lib/auth/routes";

const ACCESS_COOKIE = "uam_access_token";
const REFRESH_COOKIE = "uam_refresh_token";

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  // Check session cookies
  const hasSession = Boolean(accessToken || refreshToken);

  const isProtectedRoute = matchesRoute(
    pathname,
    PROTECTED_ROUTES,
  );

  const isGuestOnlyRoute = matchesRoute(
    pathname,
    GUEST_ONLY_ROUTES,
  );

  // 1. Protect authenticated routes
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  // 2. Prevent authenticated users from accessing guest routes
  if (isGuestOnlyRoute && hasSession) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

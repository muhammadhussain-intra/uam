import { NextResponse } from "next/server";

export async function GET() {
  const API_BASE_URL = process.env.UAM_API_BASE_URL;

  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "UAM API URL is not configured." },
      { status: 500 },
    );
  }

  const googleLoginUrl =
    `${API_BASE_URL.replace(/\/+$/, "")}/api/v1/auth/google/login`;

  return NextResponse.redirect(googleLoginUrl);
}
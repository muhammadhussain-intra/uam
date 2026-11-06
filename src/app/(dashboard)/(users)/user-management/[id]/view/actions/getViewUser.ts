
"use server";

import "server-only";

import { getMockUserDetails } from "../data/mockUserDetails";

export default async function getViewUser(id: string) {
  try {
    const user = getMockUserDetails(id);

    if (!user) {
      return {
        success: false as const,
        message: "User not found.",
        user: null,
      };
    }

    return {
      success: true as const,
      message: "User details retrieved successfully.",
      user,
    };
  } catch {
    return {
      success: false as const,
      message: "Unable to retrieve user details.",
      user: null,
    };
  }
}

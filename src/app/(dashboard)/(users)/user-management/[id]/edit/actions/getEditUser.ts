
"use server";

import "server-only";

import { getMockEditUser } from "../data/mockEditUsers";

export default async function getEditUser(id: string) {
  try {
    const user = getMockEditUser(id);

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

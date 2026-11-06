
"use server";

import "server-only";

import { createUserSchema } from "../create-user.schema";
import { createMockUser } from "../data/mockCreateUsers";

export default async function createUser(values: unknown) {
  try {
    const validation = createUserSchema.safeParse(values);

    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ??
          "Invalid user information.",
      };
    }

    const user = createMockUser(validation.data);

    return {
      success: true,
      message: "User created successfully.",
      user,
    };
  } catch {
    return {
      success: false,
      message: "Unable to create user. Please try again.",
    };
  }
}

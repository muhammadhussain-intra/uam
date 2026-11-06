
import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(254, "Email cannot exceed 254 characters"),

  username: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || /^[a-zA-Z0-9._-]{3,50}$/.test(value),
      "Username must be 3-50 characters and contain only letters, numbers, dots, underscores or hyphens",
    ),

  program_id: z
    .string()
    .refine(
      (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 1),
      "Program ID must be a positive number",
    ),

  role_ids: z
    .array(z.number())
    .min(1, "Please assign at least one role"),

  is_active: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

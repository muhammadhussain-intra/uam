
import { z } from "zod";

// Email schema (reusable)
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email or username is required")
  .max(254, "Email address must not exceed 254 characters")
  .refine(
    (value) => {
      if (value.includes("@")) {
        return z.string().email().safeParse(value).success;
      }

      return /^[a-zA-Z0-9._-]{3,50}$/.test(value);
    },
    {
      message: "Enter a valid email address or username",
    },
  )
  .transform((value) =>
    value.includes("@") ? value.toLowerCase() : value,
  );

// Factory-independent login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

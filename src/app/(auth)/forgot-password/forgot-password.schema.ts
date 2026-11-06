
import { z } from "zod";

// Email schema (reusable)
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email address is required")
  .max(254, "Email address must not exceed 254 characters")
  .email("Enter a valid email address")
  .toLowerCase();

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Form Type
export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;

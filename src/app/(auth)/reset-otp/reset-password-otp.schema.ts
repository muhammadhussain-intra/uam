import { z } from "zod";

export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

export type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;


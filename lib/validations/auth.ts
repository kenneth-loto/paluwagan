import { z } from "zod";

export const emailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).trim(),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "Invalid OTP."),
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;

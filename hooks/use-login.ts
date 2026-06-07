import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { emailOtp, signIn } from "@/lib/auth-client";
import {
  type EmailSchema,
  emailSchema,
  type OtpSchema,
  otpSchema,
} from "@/lib/validations/auth";
import { useAuthError } from "./use-auth-error";
import { useSocialAuth } from "./use-social-auth";

type Step = "email" | "otp";

export function useLogin() {
  useAuthError();
  const router = useRouter();
  const { loadingProvider, onSocialLogin } = useSocialAuth();
  const [step, setStep] = useState<Step>("email");
  const [pendingEmail, setPendingEmail] = useState("");

  const emailForm = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const isLoading =
    emailForm.formState.isSubmitting ||
    otpForm.formState.isSubmitting ||
    loadingProvider !== null;

  async function onSendOtp(values: unknown) {
    const parsed = emailSchema.safeParse(values);

    if (!parsed.success) return;

    const { error } = await emailOtp.sendVerificationOtp(
      {
        email: parsed.data.email,
        type: "sign-in",
      },
      {
        headers: { "x-auth-intent": "login" },
      },
    );

    if (error) {
      toast.error("Failed to send code. Please try again.");
      return;
    }

    setPendingEmail(parsed.data.email);
    setStep("otp");
  }

  async function onVerifyOtp(values: unknown) {
    const parsed = otpSchema.safeParse(values);

    if (!parsed.success) return;

    const { error } = await signIn.emailOtp({
      email: pendingEmail,
      otp: parsed.data.otp,
    });

    if (error) {
      otpForm.setError("otp", {
        message:
          "This code has been used or expired. Please go back to get a new code.",
      });
      return;
    }

    toast.success("Logged in successfully!");
    router.push("/dashboard");
  }

  function onBack() {
    setStep("email");
    otpForm.reset();
  }

  return {
    step,
    pendingEmail,
    emailForm,
    otpForm,
    isLoading,
    loadingProvider,
    onSendOtp,
    onVerifyOtp,
    onBack,
    onSocialLogin,
  };
}

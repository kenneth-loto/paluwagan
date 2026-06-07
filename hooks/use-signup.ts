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

type Step = "method" | "email" | "otp";

export function useSignup() {
  useAuthError();
  const router = useRouter();
  const { loadingProvider, onSocialLogin } = useSocialAuth({
    callbackURL: "/dashboard",
    errorCallbackURL: "/signup",
    newUserCallbackURL: "/onboarding",
  });
  const [step, setStep] = useState<Step>("method");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpFailCount, setOtpFailCount] = useState(0);
  const isOtpDisabled = otpFailCount >= 5;

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
    mode: "onSubmit",
    reValidateMode: "onSubmit",
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
        headers: { "x-auth-intent": "signup" },
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
      const nextCount = otpFailCount + 1;
      setOtpFailCount(nextCount);

      otpForm.setError("otp", {
        message:
          "This code has been used or expired. Please go back to get a new code.",
      });
      return;
    }

    toast.success("Signed up successfully!");
    router.push("/dashboard");
  }

  function onBack() {
    if (step === "otp") {
      setStep("email");
      otpForm.reset();
      setOtpFailCount(0);
    } else if (step === "email") {
      setStep("method");
      emailForm.reset();
    }
  }

  function onContinueWithEmail() {
    setStep("email");
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
    isOtpDisabled,
    onSocialLogin,
    onContinueWithEmail,
  };
}

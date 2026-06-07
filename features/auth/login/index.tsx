"use client";

import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { GoogleIcon } from "@/components/svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/use-login";
import { getLastUsedLoginMethod } from "@/lib/auth-client";

export function LoginForm() {
  const {
    step,
    pendingEmail,
    emailForm,
    otpForm,
    isLoading,
    onBack,
    loadingProvider,
    onSendOtp,
    onVerifyOtp,
    onSocialLogin,
  } = useLogin();
  const [lastLoginMethod, setLastLoginMethod] = useState<string | null>(null);

  useEffect(() => {
    setLastLoginMethod(getLastUsedLoginMethod());
  }, []);

  if (step === "otp") {
    return (
      <form
        onSubmit={otpForm.handleSubmit(onVerifyOtp)}
        className="flex flex-col gap-8"
      >
        <h2 className="text-center font-semibold text-3xl tracking-tight">
          Check your email
        </h2>

        <p className="text-center text-muted-foreground text-sm">
          If you have a Paluwagan account, we sent a code to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>.
        </p>

        <Controller
          name="otp"
          control={otpForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp" className="sr-only">
                One-time password
              </FieldLabel>
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  onComplete={() => otpForm.handleSubmit(onVerifyOtp)()}
                  disabled={isLoading || !!otpForm.formState.errors.otp}
                  autoFocus
                >
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-lg">
                    <InputOTPSlot
                      index={0}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                    <InputOTPSlot
                      index={1}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-lg">
                    <InputOTPSlot
                      index={2}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                    <InputOTPSlot
                      index={3}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-lg">
                    <InputOTPSlot
                      index={4}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                    <InputOTPSlot
                      index={5}
                      aria-invalid={!!otpForm.formState.errors.otp}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {fieldState.invalid && (
                <FieldError
                  icon={OctagonAlertIcon}
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="xl"
          className="w-full cursor-pointer"
          onClick={onBack}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner />
              Verifying...
            </>
          ) : (
            "Use a different email"
          )}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={emailForm.handleSubmit(onSendOtp)}
      className="flex flex-col gap-6"
    >
      <h2 className="text-center font-semibold text-3xl tracking-tight">
        Log in to Paluwagan
      </h2>

      <div className="flex flex-col gap-3">
        <Controller
          name="email"
          control={emailForm.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="email" className="sr-only">
                Email Address
              </FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                required
                placeholder="Email Address"
                autoComplete="email"
                className="h-12 placeholder:text-base md:text-base"
                disabled={isLoading}
              />
            </Field>
          )}
        />

        <div className="relative">
          <Button
            type="submit"
            size="xl"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {emailForm.formState.isSubmitting && <Spinner />}
            Continue with Email
          </Button>
          {lastLoginMethod === "email-otp" && (
            <Badge
              variant="last-login-method"
              className="-top-1.5 -right-1.5 absolute"
            >
              Last Used
            </Badge>
          )}
        </div>

        <FieldSeparator className="my-0.5" />

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full cursor-pointer"
            onClick={() => onSocialLogin("google")}
            disabled={isLoading}
          >
            {loadingProvider === "google" ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </Button>
          {lastLoginMethod === "google" && (
            <Badge
              variant="last-login-method"
              className="-top-1.5 -right-1.5 absolute"
            >
              Last Used
            </Badge>
          )}
        </div>
      </div>

      <p className="text-center text-base text-muted-foreground">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>

      {/*<p className="flex justify-center gap-3 text-muted-foreground text-xs">
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </p>*/}
    </form>
  );
}

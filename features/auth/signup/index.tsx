"use client";

import {
  MailIcon,
  MoveLeftIcon,
  MoveRightIcon,
  OctagonAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { GoogleIcon } from "@/components/svg-icons";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useSignup } from "@/hooks/use-signup";

export function SignupForm() {
  const {
    step,
    pendingEmail,
    emailForm,
    otpForm,
    isLoading,
    isOtpDisabled,
    onBack,
    loadingProvider,
    onSendOtp,
    onVerifyOtp,
    onSocialLogin,
    onContinueWithEmail,
  } = useSignup();

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col gap-8 pt-12">
        <h2 className="text-center font-semibold text-3xl tracking-tight">
          Your first paluwagan <br /> is just a sign-up away.
        </h2>

        {/* Step 3: OTP verification */}
        {step === "otp" && (
          <form
            onSubmit={otpForm.handleSubmit(onVerifyOtp)}
            className="flex flex-col gap-8"
          >
            <p className="text-center text-muted-foreground text-sm">
              If you're new to Paluwagan, we sent a code to{" "}
              <span className="font-medium text-foreground">
                {pendingEmail}
              </span>
              .
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
                      onChange={(value) => {
                        field.onChange(value);
                        if (otpForm.formState.errors.otp) {
                          otpForm.clearErrors("otp");
                        }
                      }}
                      onComplete={() => otpForm.handleSubmit(onVerifyOtp)()}
                      disabled={isLoading || isOtpDisabled}
                      autoFocus
                    >
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-16 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot
                          index={0}
                          aria-invalid={!!otpForm.formState.errors.otp}
                        />
                        <InputOTPSlot
                          index={1}
                          aria-invalid={!!otpForm.formState.errors.otp}
                        />
                        <InputOTPSlot
                          index={2}
                          aria-invalid={!!otpForm.formState.errors.otp}
                        />
                        <InputOTPSlot
                          index={3}
                          aria-invalid={!!otpForm.formState.errors.otp}
                        />
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
        )}

        {/* Step 2: Email input */}
        {step === "email" && (
          <form
            onSubmit={emailForm.handleSubmit(onSendOtp)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
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
                type="submit"
                size="xl"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {emailForm.formState.isSubmitting ? <Spinner /> : <MailIcon />}
                Continue with Email
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost-text"
              size="xl"
              className="w-full cursor-pointer"
              onClick={onBack}
              disabled={isLoading}
            >
              <MoveLeftIcon /> Other Sign Up options
            </Button>
          </form>
        )}

        {/* Step 1: Method selection */}
        {step === "method" && (
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
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

              <Button
                type="button"
                variant="ghost-text"
                size="xl"
                className="w-full cursor-pointer"
                onClick={onContinueWithEmail}
                disabled={isLoading}
              >
                Continue with Email <MoveRightIcon />
              </Button>
            </div>

            <p className="text-center text-base text-muted-foreground">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

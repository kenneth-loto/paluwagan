import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export type useSocialAuthProvider = "google";

interface UseSocialAuthOptions {
  callbackURL?: string;
  errorCallbackURL?: string;
  newUserCallbackURL?: string;
}

export function useSocialAuth(options: UseSocialAuthOptions = {}) {
  const {
    callbackURL = "/dashboard",
    errorCallbackURL = "/login",
    newUserCallbackURL,
  } = options;

  const [loadingProvider, setLoadingProvider] =
    useState<useSocialAuthProvider | null>(null);

  async function onSocialLogin(provider: useSocialAuthProvider) {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    await signIn.social(
      {
        provider,
        callbackURL,
        errorCallbackURL,
        ...(newUserCallbackURL && { newUserCallbackURL }),
        requestSignUp: true,
      },
      {
        onError(ctx) {
          toast.error(ctx.error.message ?? "Something went wrong.");
          setLoadingProvider(null);
        },
      },
    );
  }

  return {
    loadingProvider,
    onSocialLogin,
  };
}

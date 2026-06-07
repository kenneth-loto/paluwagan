import {
  emailOTPClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        toast.error("Too many attempts. Please try again later.");
      }
    },
  },
  plugins: [emailOTPClient(), lastLoginMethodClient()],
});

export const { emailOtp, getLastUsedLoginMethod, signIn, signOut, useSession } =
  authClient;

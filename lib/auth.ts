import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, lastLoginMethod } from "better-auth/plugins";
import { after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import LoginEmail from "@/components/emails/login-email";
import SignupEmail from "@/components/emails/signup-email";
import SignupExistingEmail from "@/components/emails/signup-existing-email";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { serverEnv } from "@/env";
import { REDIS_KEY_PREFIX } from "./constants";
import { redis } from "./redis";
import { emailSchema, otpSchema } from "./validations/auth";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export const auth = betterAuth({
  account: {
    encryptOAuthTokens: true,
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/email-otp/send-verification-otp") {
        const parseResult = emailSchema.safeParse(ctx.body);

        if (!parseResult.success) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "Validation failed",
            cause: z.flattenError(parseResult.error).fieldErrors,
          });
        }
      }

      if (ctx.path === "/sign-in/email-otp") {
        const parseResult = otpSchema
          .extend({ email: emailSchema.shape.email })
          .safeParse(ctx.body);

        if (!parseResult.success) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "Validation failed",
            cause: z.flattenError(parseResult.error).fieldErrors,
          });
        }
      }
    }),
  },

  plugins: [
    emailOTP({
      expiresIn: 1800,
      allowedAttempts: 5,
      resendStrategy: "reuse",

      async sendVerificationOTP({ email, otp, type }, ctx) {
        if (!ctx || type !== "sign-in") return;

        const user = await ctx.context.internalAdapter.findUserByEmail(email);
        const request = ctx.request;

        const intent = request?.headers.get("x-auth-intent");
        const currentYear = new Date().getFullYear();
        const address = "Paluwagan Inc., Leyte, Philippines";

        after(
          resend.emails.send({
            from: "Paluwagan <paluwagan@kennethloto.dev>",
            to: email,
            subject: `${otp} is your Paluwagan code`,
            react:
              intent === "signup" && user
                ? SignupExistingEmail({
                    verificationCode: otp,
                    currentYear,
                    address,
                  })
                : user
                  ? LoginEmail({
                      verificationCode: otp,
                      currentYear,
                      address,
                    })
                  : SignupEmail({
                      verificationCode: otp,
                      currentYear,
                      address,
                    }),
          }),
        );
      },
    }),
    lastLoginMethod({
      customResolveMethod: (ctx) => {
        if (ctx.path === "/sign-in/email-otp") {
          return "email-otp";
        }
        return null;
      },
    }),
    nextCookies(),
  ],

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "secondary-storage",
    customRules: {
      "/email-otp/send-verification-otp": {
        window: 60,
        max: 5,
      },

      "/sign-in/email-otp": {
        window: 60,
        max: 5,
      },
    },
  },

  secondaryStorage: {
    get: (key) => redis.get(`${REDIS_KEY_PREFIX}${key}`),

    set: (key, value, ttl) =>
      ttl
        ? redis.set(`${REDIS_KEY_PREFIX}${key}`, value, { ex: ttl })
        : redis.set(`${REDIS_KEY_PREFIX}${key}`, value),

    delete: async (key) => {
      await redis.del(`${REDIS_KEY_PREFIX}${key}`);
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});

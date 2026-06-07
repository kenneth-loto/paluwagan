export const REDIS_KEY_PREFIX = "paluwagan:";

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Sign-in was cancelled. Please try again.",
  invalid_code: "Something went wrong. Please try again.",
  state_mismatch: "Your session expired. Please try again.",
};

export const THEME_TOGGLE_KEY = "m";

export const PUBLIC_PATHS = ["/login", "/signup", "/"];

export const NON_ORG_PREFIXES = ["/onboarding", "/accept-invitation"];

import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/env";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  breakpoints: false,
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { serverEnv } from "@/env";

export const db = drizzle(serverEnv.DATABASE_URL, {
  schema,
  casing: "snake_case",
});

import { getEnv } from "@daisy/env";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: getEnv("DB_URL")!,
    authToken: getEnv("DB_AUTH_TOKEN"),
  },
});

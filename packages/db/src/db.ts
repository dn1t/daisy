import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

// @ts-expect-error
if (!globalThis.Deno) {
  config({ path: "../../.env" });
}

export const db = drizzle({
  connection: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_AUTH_TOKEN,
  },
});

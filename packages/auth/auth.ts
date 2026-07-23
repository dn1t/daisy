import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { passkey } from "@better-auth/passkey";
import { db } from "@daisy/db";
import { betterAuth } from "better-auth/minimal";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [passkey()],
});

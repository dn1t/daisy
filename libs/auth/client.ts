import { createAuthClient } from "better-auth/react";
import { use } from "react";
import { getSession, type Session } from "./session";

export const auth = createAuthClient();

export function useSession(): Session | null {
  return use(getSession());
}

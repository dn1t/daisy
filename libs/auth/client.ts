import { createAuthClient } from "better-auth/react";
import { use } from "react";
import { getSession } from "./session";

export const auth = createAuthClient();

export function useSession() {
  return use(getSession());
}

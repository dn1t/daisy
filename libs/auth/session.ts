import type { Session } from "better-auth";
import { unstable_getRequest } from "waku/router/server";
import { auth } from "./auth";
import { getContextData } from "./cookies";

export function getSession(req: Request = unstable_getRequest()): Promise<Session | null> {
  const contextData = getContextData();
  const existingSessionPromise = contextData.sessionPromise;
  if (existingSessionPromise) return existingSessionPromise;

  const sessionPromise = auth.api.getSession({ headers: new Headers(req.headers) }).then((r) => r?.session ?? null);
  contextData.sessionPromise = sessionPromise;
  return sessionPromise;
}

export type { Session } from "better-auth";

import type { BetterAuthPlugin, Session, User } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { AsyncLocalStorage } from "node:async_hooks";

export interface WakuCookiesContext {
  betterAuthSetCookie?: string;
  sessionPromise?: Promise<{ session: Session | null; user: User | null }> | undefined;
}

const wakuCookiesStorage = new AsyncLocalStorage<WakuCookiesContext>();

export function runWithWakuCookiesContext<T>(fn: () => T): T {
  return wakuCookiesStorage.run({}, fn);
}

export function getContextData(): WakuCookiesContext {
  const store = wakuCookiesStorage.getStore();
  if (!store) throw new Error("Waku cookies context is not available.");
  return store;
}

export function wakuCookies() {
  return {
    id: "waku-cookies",
    hooks: {
      after: [
        {
          matcher(_) {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookieHeader = returned?.get("set-cookie");
              if (!setCookieHeader) return;
              const contextData = getContextData();
              contextData.betterAuthSetCookie = setCookieHeader;
            }
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
}

import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";
import KVCookieStore from "./kv-cookie-store";
import { getTokens } from "./tokens";

export const fetch = fetchCookie(
  async (input: URL | RequestInfo, init?: RequestInit & { bypassTokenInjection?: boolean }) => {
    if (!init?.bypassTokenInjection) {
      const [csrfToken, xToken] = await getTokens();
      const headers = new Headers(init?.headers);
      if (csrfToken) headers.set("csrf-token", csrfToken);
      if (xToken) headers.set("x-token", xToken);
      init = { ...init, headers };
    }
    return globalThis.fetch(input, init);
  },
  new CookieJar(new KVCookieStore()),
);

import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";
import KVCookieStore from "./kv-cookie-store";
import { getTokens } from "./tokens";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

export const fetch = fetchCookie(
  async (input: URL | RequestInfo, init?: RequestInit & { bypassTokenInjection?: boolean }) => {
    if (!init?.bypassTokenInjection) {
      const [csrfToken, xToken] = await getTokens();
      init = {
        ...init,
        headers: {
          ...init?.headers,
          "user-agent": USER_AGENT,
          ...(csrfToken && { "csrf-token": csrfToken }),
          ...(xToken && { "x-token": xToken }),
        },
      };
    }
    return globalThis.fetch(input, init);
  },
  new CookieJar(new KVCookieStore()),
);

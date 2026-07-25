import { env } from "cloudflare:workers";
import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";
import KVCookieStore from "./kv-cookie-store";
import { updateTokens } from "./tokens";

export const fetch = fetchCookie(globalThis.fetch, new CookieJar(new KVCookieStore()));

export function test() {
  if (!env.daisy) return;
  updateTokens();
}

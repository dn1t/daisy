import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";
import KVCookieStore from "./kv-cookie-store";

export const fetch = fetchCookie(globalThis.fetch, new CookieJar(new KVCookieStore()));

import { env } from "cloudflare:workers";
import { fetch } from "./fetch";

interface Token {
  value: string;
  updatedAt: number;
}

function isTokenValid(token: Token) {
  return Date.now() - token.updatedAt < 30 * 60 * 1000;
}

export async function getTokens(isRetry = false): Promise<[string | null, string | null]> {
  const csrfToken = await env.daisy.get<Token>("csrfToken", "json");
  const xToken = await env.daisy.get<Token>("xToken", "json");

  if (csrfToken && isTokenValid(csrfToken) && xToken && isTokenValid(xToken)) return [csrfToken.value, xToken.value];

  const updatedAt = Date.now();
  const html = await fetch("https://playentry.org/personal/default", { bypassTokenInjection: true }).then((res) =>
    res.text(),
  );
  const dataStr = /<script +id="__NEXT_DATA__" +[A-z="/]+>(.+)<\/script>/gm.exec(html)?.[1];
  if (!dataStr) return [null, null];
  const data = JSON.parse(dataStr);

  const c: string = data?.props?.initialProps?.csrfToken;
  if (!c) return [null, null];
  await env.daisy.put("csrfToken", JSON.stringify({ value: c, updatedAt }));

  const user = data?.props?.pageProps?.initialState?.common?.user;
  if (user && typeof user === "object") {
    const x: string = user?.xToken;
    if (!x) return [c, null];

    await env.daisy.put("xToken", JSON.stringify({ value: x, updatedAt }));
    return [c, x];
  } else if (!isRetry) {
    const res = await fetch("https://playentry.org/graphql/SIGNIN_BY_USERNAME", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "csrf-token": c,
      },
      referrer: "https://playentry.org/signin",
      body: JSON.stringify({
        query:
          "mutation($username:String!$password:String!$rememberme:Boolean){signinByUsername(username:$username password:$password rememberme:$rememberme){id}}",
        variables: {
          username: process.env.ENTRY_USERNAME,
          password: process.env.ENTRY_PASSWORD,
          rememberme: true,
        },
      }),
      bypassTokenInjection: true,
    });
    if (!res.ok) return [c, null];

    const data = await res.json();
    if (!data?.data?.signinByUsername?.id) return [c, null];

    return getTokens(true);
  } else return [c, null];
}

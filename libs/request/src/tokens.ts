import { env } from "cloudflare:workers";

interface Token {
  value: string;
  updatedAt: number;
}

function isTokenValid(token: Token) {
  return Date.now() - token.updatedAt < 30 * 60 * 1000;
}

export async function updateTokens(isRetry = false) {
  let csrfToken = await env.daisy.get<Token>("csrfToken", "json");
  let xToken = await env.daisy.get<Token>("xToken", "json");

  if (csrfToken && isTokenValid(csrfToken) && xToken && isTokenValid(xToken))
    return console.log("Tokens are still valid");

  const updatedAt = Date.now();
  const html = await fetch("https://playentry.org/personal/default").then((res) => res.text());
  const dataStr = /<script +id="__NEXT_DATA__" +[A-z="/]+>(.+)<\/script>/gm.exec(html)?.[1];
  if (!dataStr) return;
  const data = JSON.parse(dataStr);

  csrfToken = data?.props?.initialProps?.csrfToken;
  if (csrfToken && typeof csrfToken === "string")
    await env.daisy.put("csrfToken", JSON.stringify({ value: csrfToken, updatedAt }));

  const user = data?.props?.pageProps?.initialState?.common?.user;
  if (user && typeof user === "object") {
    xToken = user?.xToken;
    if (xToken && typeof xToken === "string")
      await env.daisy.put("xToken", JSON.stringify({ value: xToken, updatedAt }));

    console.log("Updated tokens");
  } else if (!isRetry) {
    const res = await fetch("https://playentry.org/graphql/SIGNIN_BY_USERNAME", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(csrfToken?.value && { "csrf-token": csrfToken.value }),
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
    });
    if (!res.ok) return console.error("Failed to sign in:", res.status, await res.text());

    const data = await res.json();
    if (!data?.data?.signinByUsername?.id) return console.error("Failed to sign in");

    return updateTokens(true);
  } else console.error("Failed to update tokens");
}

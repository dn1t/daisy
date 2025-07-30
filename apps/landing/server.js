import { serveDir, serveFile } from "jsr:@std/http/file-server";

const ROOT_DOMAIN = Deno.env.get("ROOT_DOMAIN") || "daisy.tica.fun";

Deno.serve(async (req) => {
  let res = await serveDir(req, {
    fsRoot: new URL("./dist", import.meta.url),
  });
  if (res.status === 404) {
    console.log("404 Not Found, serving index.html");
    res = await serveFile(req, new URL("./dist/index.html", import.meta.url));
  }

  res.headers.append("Access-Control-Allow-Origin", `https://account.${ROOT_DOMAIN}`);
  res.headers.append("Access-Control-Allow-Origin", `https://direct.${ROOT_DOMAIN}`);
  res.headers.append("Access-Control-Allow-Origin", `https://store.${ROOT_DOMAIN}`);

  return res;
});

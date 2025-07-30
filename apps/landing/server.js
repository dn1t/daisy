import { serveDir, serveFile } from "jsr:@std/http/file-server";

const IS_PROD = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
const ROOT_DOMAIN = Deno.env.get("ROOT_DOMAIN") || "daisy.tica.fun";
const ALLOW_LIST = (Deno.env.get("ALLOW_LIST") || "account,direct,store").split(",").map((i) => i.trim());

Deno.serve(async (req) => {
  let res = await serveDir(req, {
    fsRoot: new URL("./dist", import.meta.url),
  });
  if (res.status === 404) {
    console.log("404 Not Found, serving index.html");
    res = await serveFile(req, new URL("./dist/index.html", import.meta.url));
  }

  const origin = req.headers.get("Origin");
  if (origin) {
    const url = new URL(origin);
    const protocol = IS_PROD ? "https:" : url.protocol;
    const hostname = url.hostname;
    const port = url.port;
    const subdomain = hostname.slice(0, -ROOT_DOMAIN.length - 1);

    if (hostname.endsWith(ROOT_DOMAIN) && ALLOW_LIST.includes(subdomain)) {
      res.headers.append("Access-Control-Allow-Origin", `${protocol}//${hostname}${port ? `:${port}` : ""}`);
    } else if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
      res.headers.append("Access-Control-Allow-Origin", `${protocol}//${hostname}${port ? `:${port}` : ""}`);
    }
  }

  return res;
});

import { getContextData, getSessionCookie, runWithWakuCookiesContext } from "@daisy/auth";
import { getSession } from "@daisy/auth/session";
import type { MiddlewareHandler } from "hono";

const authMiddleware: () => MiddlewareHandler = () => {
  return async (c, next) => {
    return runWithWakuCookiesContext(async () => {
      const reqUrl = new URL(c.req.url);
      const sessionCookie = getSessionCookie(c.req.raw);

      if (
        !sessionCookie &&
        reqUrl.pathname !== "/" &&
        !reqUrl.pathname.startsWith("/api") &&
        !reqUrl.pathname.endsWith(".txt")
      )
        return c.redirect("/", 302);

      getSession(c.req.raw);
      await next();
      const contextData = getContextData();
      const betterAuthSetCookie = contextData.betterAuthSetCookie as string | undefined;
      if (betterAuthSetCookie) {
        c.header("set-cookie", betterAuthSetCookie, { append: true });
      }
    });
  };
};

export default authMiddleware;

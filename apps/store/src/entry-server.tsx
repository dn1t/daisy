// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// @ts-expect-error
const isProd = "Deno" in globalThis && Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

export default createHandler((ctx) => {
  const { protocol, host } = new URL(ctx.request.url);
  const fontsCSS = `${isProd ? "https:" : protocol}//${host.slice(6)}/fonts.css`;

  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="preload" href={fontsCSS} as="style" />
            <link rel="stylesheet" href={fontsCSS} />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});

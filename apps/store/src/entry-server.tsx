// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// @ts-expect-error
const ROOT_DOMAIN = globalThis.Deno?.env.get("ROOT_DOMAIN") || "daisy.tica.fun";

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="preload" href={`https://${ROOT_DOMAIN}/fonts.css`} as="style" />
            <link rel="stylesheet" href={`https://${ROOT_DOMAIN}/fonts.css`} />
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

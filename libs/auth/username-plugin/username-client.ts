import type { BetterAuthClientPlugin } from "better-auth";
import { PACKAGE_VERSION, USERNAME_ERROR_CODES, type username } from ".";

export const usernameClient = () => {
  return {
    id: "username",
    version: PACKAGE_VERSION,
    $InferServerPlugin: {} as ReturnType<typeof username>,
    atomListeners: [
      {
        matcher: (path) => path === "/sign-in/username",
        signal: "$sessionSignal",
      },
    ],
    $ERROR_CODES: USERNAME_ERROR_CODES,
  } satisfies BetterAuthClientPlugin;
};

export { USERNAME_ERROR_CODES };

import { config } from "dotenv";
import { defineConfig } from "vite";

import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

config({ path: "../../.env", quiet: true });

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidStart(),
    nitro({
      preset: "cloudflare-module",
      storage: {
        kv: {
          driver: "cloudflare-kv-binding",
          binding: "daisy",
        },
      },
    }),
  ],
});

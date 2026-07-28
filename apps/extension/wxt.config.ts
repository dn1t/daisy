/// <reference types="@wxt-dev/auto-icons" />
import tailwindcss from "@tailwindcss/vite";
import { config } from "dotenv";
import { defineConfig } from "wxt";

config({ path: "../../.env", quiet: true });

export default defineConfig({
  manifest: {
    name: "Daisy",
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/logo.svg",
    developmentIndicator: "overlay",
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  ...(process.env.CHROME_BINARY_PATH
    ? {
        webExt: {
          binaries: {
            chrome: process.env.CHROME_BINARY_PATH,
          },
          chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
        },
      }
    : {}),
});

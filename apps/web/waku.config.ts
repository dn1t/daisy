import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { type DotenvParseOutput, parse } from "dotenv";
import { readFileSync } from "node:fs";
import { defineConfig } from "waku/config";

let parsedEnv: DotenvParseOutput | null = null;
if (process.env.NODE_ENV === "development") {
  const env = readFileSync("../../.env", "utf-8");
  parsedEnv = parse(env);
}

export default defineConfig({
  vite: {
    environments: {
      rsc: {
        optimizeDeps: { include: ["hono/tiny"] },
        build: { rolldownOptions: { platform: "neutral" } },
      },
      ssr: {
        optimizeDeps: { include: ["waku > rsc-html-stream/server"] },
        build: { rolldownOptions: { platform: "neutral" } },
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        ...(parsedEnv !== null && { config: { vars: parsedEnv } }),
      }),
    ],
  },
});

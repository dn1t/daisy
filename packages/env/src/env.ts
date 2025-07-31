import path from "node:path";
import { config } from "dotenv";

if (!globalThis.Deno && !globalThis.window) {
  config({
    path: globalThis.process ? path.join(import.meta.dirname, "../../../.env") : "../../../.env",
  });
}

export function getEnv(key: string): string | undefined {
  if (globalThis.Deno) {
    return globalThis.Deno.env.get(key);
  } else if (globalThis.window) {
    // @ts-expect-error
    return import.meta.env[key];
  }
  return process.env[key];
}

import { config } from "dotenv";

if (!globalThis.Deno) {
  config({ path: "../../.env" });
}

export function getEnv(key: string): string | undefined {
  if (globalThis.Deno) {
    return globalThis.Deno.env.get(key);
  }
  return process.env[key];
}

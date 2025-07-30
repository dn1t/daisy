#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const apps = await readdir(join(import.meta.dirname, "../apps"));
const appName = process.argv[3];
const command = process.argv[2];

if (!apps.includes(appName)) {
  console.error(`App "${appName}" not found. Available apps: ${apps.join(", ")}`);
  process.exit(1);
}

console.log(`> pnpm --filter ${appName} run dev`);

spawn("pnpm", ["--filter", appName, "run", command], { stdio: "inherit" });

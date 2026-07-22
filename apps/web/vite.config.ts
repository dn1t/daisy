import { defineConfig } from "vite";

import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [tailwindcss(), solidStart(), nitro()],
});

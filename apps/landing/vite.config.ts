import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";
import solid from "vite-plugin-solid";

export default {
  plugins: [tailwindcss(), solid()],
} satisfies UserConfig;

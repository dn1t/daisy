import type * as colors from "@radix-ui/colors";
import type { Config } from "tailwindcss";

type RemoveSuffix<T, U extends string> = T extends `${infer V}${U}` ? V : T;
type RadixColor = Exclude<
  RemoveSuffix<RemoveSuffix<RemoveSuffix<keyof typeof colors, "A">, "P3">, "Dark">,
  "black" | "white" | "default"
>;

const COLORS = ["slate", "iris"] as const satisfies RadixColor[];

type Palette<T = string> = {
  [step in `step${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`]: T;
};

function renameStep(color: string) {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => {
      const step = (i + 1).toString();
      return [step, `rgb(from var(--${color}-${step}) r g b / <alpha-value>)`] as const;
    }),
  );
}

const getColors = (c: RadixColor[]) =>
  Object.fromEntries(c.map((c) => [c, renameStep(c)])) as {
    [color in (typeof COLORS)[number]]: Palette;
  };

function generateColors<T extends RadixColor>(...colors: T[]) {
  return {
    foreground: "var(--foreground)",
    background: "var(--background)",
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    ...getColors(colors),
  };
}

export default {
  theme: {
    colors: generateColors(...COLORS),
  },
} satisfies Config;

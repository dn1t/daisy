import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { BeatLoader } from "react-spinners";

const button = tv({
  base: "disabled:cursor-not-allowed disabled:bg-zinc-500 cursor-pointer rounded-[10px] supports-corner-shape:rounded-full px-4.5 py-2.75 font-semibold text-[15px] leading-none corner-squircle",
  variants: {
    color: {
      primary: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black",
      secondary: "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button> & {
    loading?: boolean;
  };

export function Button({ color, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={button({ color, class: props.className })}
      disabled={loading || disabled}
    >
      {loading ? <BeatLoader color="currentColor" size={6} /> : children}
    </button>
  );
}

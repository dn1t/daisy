import type { ComponentProps } from "solid-js";
import { tv } from "tailwind-variants";

const button = tv({
  base: "cursor-pointer rounded-[10px] supports-[corner-shape:squircle]:rounded-full bg-zinc-900 px-4.5 py-2.75 font-semibold text-[15px] text-white leading-none [corner-shape:squircle]",
  variants: {},
});

interface ButtonProps extends ComponentProps<"button"> {}

export function Button(props: ButtonProps) {
  return <button {...props} class={button({ class: props.class })} />;
}

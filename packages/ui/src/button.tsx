import type { ComponentProps } from "solid-js";
import { tv } from "tailwind-variants";

const button = tv({
  base: "cursor-pointer rounded-xl bg-zinc-900 px-4 py-2.5 font-medium text-sm text-white leading-none",
  variants: {},
});

interface ButtonProps extends ComponentProps<"button"> {}

export function Button(props: ButtonProps) {
  return <button {...props} class={button({ class: props.class })} />;
}

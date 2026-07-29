import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  labelProps?: ComponentProps<"label">;
}

export function Input({ label, labelProps, ...props }: InputProps) {
  return (
    <label
      {...labelProps}
      className={cn(
        "corner-squircle group/input flex w-full cursor-text flex-col rounded-xl border border-zinc-200 bg-zinc-100 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 has-disabled:cursor-not-allowed supports-corner-shape:rounded-3xl dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-brand-800",
        labelProps?.className,
      )}
    >
      {label && (
        <span className="select-none px-3.25 pt-2.75 font-medium text-xs text-zinc-500 leading-none group-focus-within/input:text-zinc-800 dark:group-focus-within/input:text-zinc-200">
          {label}
        </span>
      )}
      <input
        {...props}
        className={cn(
          "px-3.5 pt-0.75 pb-2.5 leading-none focus:outline-none disabled:cursor-not-allowed",
          props.className,
        )}
      />
    </label>
  );
}

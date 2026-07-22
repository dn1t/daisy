import { A, useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { Logo } from "../common/logo";

const links: { href: string; label: string }[] = [
  { href: "/", label: "홈" },
  { href: "/store", label: "스토어" },
  { href: "/direct", label: "Direct" },
  { href: "/download", label: "다운로드" },
];

export function Nav() {
  const pathname = () => useLocation().pathname;

  return (
    <nav class="">
      <div class="mx-auto flex h-16 w-full max-w-4xl items-center">
        <A href="/" class="flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo class="h-7.5 w-7.5" />
          Daisy
        </A>
        <ul class="mt-0.5 ml-20 flex gap-x-12 font-[550] text-zinc-500">
          <For each={links}>
            {(link) => {
              const selected = () => (link.href === "/" ? pathname() === link.href : pathname().startsWith(link.href));

              return (
                <li>
                  <A href={link.href} class={selected() ? "text-black" : ""}>
                    {link.label}
                  </A>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </nav>
  );
}

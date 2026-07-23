import { Button, Logo } from "@daisy/ui";
import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, For } from "solid-js";
import { cn } from "tailwind-variants";

const links: { href: string; label: string }[] = [
  { href: "/", label: "홈" },
  { href: "/store", label: "스토어" },
  { href: "/direct", label: "Direct" },
  { href: "/download", label: "다운로드" },
];

export function Nav() {
  const location = useLocation();
  const pathname = () => location.pathname;
  const selected = () => {
    const p = pathname();
    const i = pathname().indexOf("/", 1);
    return p === "/" ? p : p.slice(0, i > 0 ? i : undefined);
  };

  const [offset, setOffset] = createSignal(0);
  const [width, setWidth] = createSignal(0);
  const [ready, setReady] = createSignal(false);
  let ref: HTMLUListElement | undefined;
  let initialized = false;

  createEffect(() => {
    if (!ref) return;
    const items = ref.querySelectorAll<HTMLLIElement>(":scope > li");

    let offset = 0;
    for (const [i, { href }] of links.entries()) {
      const item = items[i];
      if (!item) continue;
      if (href === selected()) {
        setWidth(item.offsetWidth);
        setOffset(offset);
        break;
      }
      offset += item.offsetWidth;
    }

    if (!initialized) {
      initialized = true;
      requestAnimationFrame(() => setReady(true));
    }
  });

  return (
    <nav class="px-6">
      <div class="mx-auto grid h-18 w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center">
        <A
          href="/"
          class="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px] text-black dark:text-white"
        >
          <Logo class="h-7.25 w-7.25" />
          Daisy
        </A>
        <ul
          ref={ref}
          class="relative flex rounded-full bg-zinc-100 p-0.75 font-[550] text-sm text-zinc-500 dark:bg-zinc-900"
        >
          <For each={links}>
            {(link) => {
              return (
                <li class="z-10">
                  <A
                    href={link.href}
                    class={cn(
                      "block min-w-12 px-4 py-1 text-center",
                      selected() === link.href && "text-black dark:text-white",
                    )}
                  >
                    {link.label}
                  </A>
                </li>
              );
            }}
          </For>
          <div
            class={cn(
              "pointer-events-none absolute h-[calc(100%-6px)] min-w-12 rounded-full border border-zinc-200 bg-white opacity-0 dark:border-zinc-800 dark:bg-zinc-800",
              ready() && "opacity-100 transition-transform",
            )}
            style={{ width: `${width()}px`, transform: `translateX(${offset()}px)` }}
          />
        </ul>
        <Button class="ml-auto">시작하기</Button>
      </div>
    </nav>
  );
}

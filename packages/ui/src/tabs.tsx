import { A } from "@solidjs/router";
import { type Accessor, createEffect, createSignal, For } from "solid-js";
import { cn } from "tailwind-variants";

export interface LinkTab {
  href: string;
  label: string;
}

export interface ButtonTab {
  id: string;
  label: string;
  onClick: () => void;
}

export type Tab = LinkTab | ButtonTab;

export function Tabs(props: { tabs: Tab[]; selected: Accessor<string> }) {
  const [offset, setOffset] = createSignal(0);
  const [width, setWidth] = createSignal(0);
  const [ready, setReady] = createSignal(false);
  let ref: HTMLUListElement | undefined;
  let initialized = false;

  createEffect(() => {
    if (!ref) return;
    const items = ref.querySelectorAll<HTMLLIElement>(":scope > li");

    let offset = 0;
    for (const [i, tab] of props.tabs.entries()) {
      const item = items[i];
      if (!item) continue;
      if (("href" in tab && tab.href === props.selected()) || ("id" in tab && tab.id === props.selected())) {
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
    <ul
      ref={ref}
      class="relative flex rounded-full bg-zinc-100 p-0.75 font-[550] text-sm text-zinc-500 dark:bg-zinc-900"
    >
      <For each={props.tabs}>
        {(tab) => {
          const className = () =>
            cn(
              "block min-w-12 px-4 py-1 text-center",
              props.selected() === ("href" in tab ? tab.href : tab.id) && "text-black dark:text-white",
            );

          return (
            <li class="z-10">
              {"href" in tab && (
                <A href={tab.href} class={className()}>
                  {tab.label}
                </A>
              )}
              {"id" in tab && (
                <button type="button" class={className()} onClick={tab.onClick}>
                  {tab.label}
                </button>
              )}
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
  );
}

import { useCallback, useState } from "react";
import { cn } from "tailwind-variants";
import type { Link } from "waku";

export interface LinkTab {
  href: string;
  label: string;
}

export interface ButtonTab<T extends string> {
  id: T;
  label: string;
  onClick: () => void;
}

interface LinkTabsProps {
  className?: string;
  tabs: LinkTab[];
  selected: string;
  Link: typeof Link;
}

interface ButtonTabsProps<T extends string> {
  className?: string;
  tabs: ButtonTab<T>[];
  selected: T;
}

type TabsProps<T extends string> = LinkTabsProps | ButtonTabsProps<T>;

export function Tabs<T extends string>(props: TabsProps<T>) {
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);
  let initialized = false;

  const ref = useCallback(
    (node: HTMLUListElement | null) => {
      if (!node) return;
      const items = node.querySelectorAll<HTMLLIElement>(":scope > li");

      let offset = 0;
      for (const [i, tab] of props.tabs.entries()) {
        const item = items[i];
        if (!item) continue;
        if (("href" in tab && tab.href === props.selected) || ("id" in tab && tab.id === props.selected)) {
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
    },
    [props.tabs, props.selected],
  );

  return (
    <ul
      ref={ref}
      className={cn(
        "relative flex w-max rounded-full bg-zinc-100 p-0.75 font-[550] text-sm text-zinc-500 dark:bg-zinc-900",
        props.className,
      )}
    >
      {props.tabs.map((tab) => {
        const className = () =>
          cn(
            "block min-w-12 px-4 py-1 text-center cursor-pointer",
            props.selected === ("href" in tab ? tab.href : tab.id) && "text-black dark:text-white",
          );

        return (
          <li className="z-10" key={"href" in tab ? tab.href : tab.id}>
            {"href" in tab && "Link" in props && (
              <props.Link to={tab.href} className={className()}>
                {tab.label}
              </props.Link>
            )}
            {"id" in tab && (
              <button type="button" className={className()} onClick={tab.onClick}>
                {tab.label}
              </button>
            )}
          </li>
        );
      })}
      <div
        className={cn(
          "pointer-events-none absolute h-[calc(100%-6px)] min-w-12 rounded-full border border-zinc-200 bg-white opacity-0 dark:border-zinc-800 dark:bg-zinc-800",
          ready && "opacity-100 transition-transform",
        )}
        style={{ width: `${width}px`, transform: `translateX(${offset}px)` }}
      />
    </ul>
  );
}

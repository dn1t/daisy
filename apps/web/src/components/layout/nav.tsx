import { Button, Logo, Tabs, type LinkTab } from "@daisy/ui";
import { A, useLocation } from "@solidjs/router";

const tabs: LinkTab[] = [
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
        <Tabs tabs={tabs} selected={selected} />
        <Button class="ml-auto">시작하기</Button>
      </div>
    </nav>
  );
}

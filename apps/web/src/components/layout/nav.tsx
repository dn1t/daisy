import { Button, createModal, Input, Logo, Tabs, type LinkTab } from "@daisy/ui";
import { A, useLocation } from "@solidjs/router";
import { createEffect } from "solid-js";

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

  const { setOpen, Modal } = createModal();

  createEffect(() => {
    setOpen(true);
  });

  return (
    <nav class="px-6">
      <div class="mx-auto grid h-18 w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center">
        <A href="/" class="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo class="h-7.25 w-7.25" />
          Daisy
        </A>
        <Tabs tabs={tabs} selected={selected} />
        <Button class="ml-auto" onClick={() => setOpen(true)}>
          시작하기
        </Button>
        <Modal class="">
          <LoginModalContent />
        </Modal>
      </div>
    </nav>
  );
}

function LoginModalContent() {
  return (
    <div class="p-10">
      <h2 class="font-semibold text-xl">로그인</h2>
      <Input label="이메일" placeholder="me@tica.fun" />
      <Input label="비밀번호" placeholder="••••••••" />
    </div>
  );
}

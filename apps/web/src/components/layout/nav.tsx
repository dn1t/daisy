import { Button, createModal, Input, Logo, Tabs, type LinkTab } from "@daisy/ui";
import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

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
  type Tab = "login" | "join";
  const [tab, setTab] = createSignal<Tab>("join");
  const [step, setStep] = createSignal(0);

  return (
    <div class="px-10 pt-4 pb-10">
      <Tabs
        class="mx-auto"
        tabs={[
          { id: "login", label: "로그인", onClick: () => tab() !== "login" && setTab("login") },
          { id: "join", label: "회원가입", onClick: () => tab() !== "join" && setTab("join") },
        ]}
        selected={tab}
      />
      <h2 class="mt-6 px-1.5 font-semibold text-xl">{tab() === "login" ? "로그인" : "회원가입"}</h2>
      <form class="mt-2 flex w-70 flex-col gap-y-2.25">
        {(tab() === "login" || step() === 1) && (
          <>
            <Input label="이메일" placeholder="me@tica.fun" autofocus />
            <Input label="비밀번호" placeholder="••••••••" />
            {tab() === "join" && <Input label="이름" placeholder="띠까" />}
            <Button type="submit" class="mt-2">
              {tab() === "login" ? "로그인" : "회원가입"}
            </Button>
          </>
        )}
        {tab() === "join" && step() === 0 && (
          <>
            <Input label="엔트리 아이디" placeholder="dukhwa" autofocus />
            <Button type="submit" class="mt-2" disabled>
              다음
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

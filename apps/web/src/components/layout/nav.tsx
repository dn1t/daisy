"use client";

import { Button, createModal, Input, Logo, Tabs, type LinkTab } from "@daisy/ui";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "waku";

const tabs: LinkTab[] = [
  { href: "/", label: "홈" },
  { href: "/store", label: "스토어" },
  { href: "/direct", label: "Direct" },
  { href: "/download", label: "다운로드" },
];

export function Nav() {
  const { path } = useRouter();
  const selected = useMemo(() => {
    const i = path.indexOf("/", 1);
    return path === "/" ? path : path.slice(0, i > 0 ? i : undefined);
  }, [path]);

  useEffect(() => {
    setOpen(true);
  }, []);

  const { setOpen, Modal } = createModal();

  return (
    <nav className="px-6">
      <div className="mx-auto grid h-18 w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center">
        <Link to="/" className="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo className="h-7.25 w-7.25" />
          Daisy
        </Link>
        <Tabs tabs={tabs} selected={selected} Link={Link} />
        <Button className="ml-auto" onClick={() => setOpen(true)}>
          시작하기
        </Button>
        <Modal className="">
          <LoginModalContent />
        </Modal>
      </div>
    </nav>
  );
}

function LoginModalContent() {
  type Tab = "login" | "join";
  const [tab, setTab] = useState<Tab>("join");
  const [step, setStep] = useState(0);

  return (
    <div className="px-10 pt-4 pb-10">
      <Tabs
        className="mx-auto"
        tabs={[
          { id: "login", label: "로그인", onClick: () => tab !== "login" && setTab("login") },
          { id: "join", label: "회원가입", onClick: () => tab !== "join" && setTab("join") },
        ]}
        selected={tab}
      />
      <h2 className="mt-6 px-1.5 font-semibold text-xl">{tab === "login" ? "로그인" : "회원가입"}</h2>
      <form className="mt-2 flex w-70 flex-col gap-y-2.25">
        {(tab === "login" || step === 1) && (
          <>
            <Input label="이메일" placeholder="me@tica.fun" autoFocus />
            <Input label="비밀번호" placeholder="••••••••" />
            {tab === "join" && <Input label="이름" placeholder="띠까" />}
            <Button type="submit" className="mt-2">
              {tab === "login" ? "로그인" : "회원가입"}
            </Button>
          </>
        )}
        {tab === "join" && step === 0 && (
          <>
            <Input label="엔트리 아이디" placeholder="dukhwa" autoFocus />
            <Button type="submit" className="mt-2" disabled>
              다음
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

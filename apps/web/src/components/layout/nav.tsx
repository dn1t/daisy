"use client";

import { Button, createModal, Input, Logo, Tabs, type LinkTab } from "@daisy/ui";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "waku";
import z from "zod";

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

const EntryId = z.string().regex(/^[0-9a-f]{24}$/, "엔트리 아이디 형식이 올바르지 않아요.");

function objectIdToDate(objectId: string): Date {
  return new Date(parseInt(objectId.slice(0, 8), 16) * 1000);
}

function LoginModalContent() {
  type Tab = "login" | "join";
  const [tab, setTab] = useState<Tab>("join");
  const [step, setStep] = useState(0);

  const [entryId, setEntryId] = useState<string>("");

  const isEntryIdValid = useMemo(() => {
    const res = EntryId.safeParse(entryId);
    if (!res.success) return false;

    const date = objectIdToDate(res.data);
    if (date.getFullYear() < 2013 || date.getFullYear() > new Date().getFullYear()) return false;

    return true;
  }, [entryId]);

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
            <Input
              label="엔트리 아이디"
              placeholder="60bc5559659bf40bd15d022c"
              autoFocus
              minLength={24}
              maxLength={24}
              value={entryId}
              onInput={(e) => setEntryId(e.currentTarget.value.replaceAll(/[^0-9a-f]/g, ""))}
              onPaste={(e) => {
                let url = e.clipboardData.getData("text").trim();
                if (url.startsWith("playentry.org/profile/")) url = `https://${url}`;
                if (url.startsWith("https://playentry.org/profile/")) {
                  const id = new URL(url).pathname.split("/")[2];
                  const res = EntryId.safeParse(id);
                  if (!res.success) return;
                  e.preventDefault();
                  setEntryId(res.data);
                }
              }}
            />
            <p className="px-0.5 text-xs text-zinc-700 dark:text-zinc-300">
              엔트리 프로필 URL을 그대로 붙여넣어도 돼요.
            </p>
            <Button type="submit" className="mt-2" disabled={!isEntryIdValid}>
              다음
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

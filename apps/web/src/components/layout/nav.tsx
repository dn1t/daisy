"use client";

import type { User } from "@daisy/auth/session";
import { Button, Logo, Tabs, useModal, type LinkTab } from "@daisy/ui";
import { useEffect, useMemo } from "react";
import { Link, useRouter } from "waku";
import { UserIcon } from "@phosphor-icons/react";
import { LoginModal } from "./login-modal";

const tabs: LinkTab[] = [
  { href: "/", label: "홈" },
  { href: "/store", label: "스토어" },
  { href: "/direct", label: "Direct" },
  { href: "/download", label: "다운로드" },
];

export function Nav({ user, verifyPostId }: { user: User | null; verifyPostId: string }) {
  const { path } = useRouter();
  const selected = useMemo(() => {
    const i = path.indexOf("/", 1);
    return path === "/" ? path : path.slice(0, i > 0 ? i : undefined);
  }, [path]);

  useEffect(() => {
    setOpen(true);
  }, []);

  const { setOpen, modalProps } = useModal();

  return (
    <nav className="px-6">
      <div className="mx-auto grid h-18 w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center pt-0.5">
        <Link to="/" className="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo className="h-7.25 w-7.25" />
          Daisy
        </Link>
        <Tabs tabs={tabs} selected={selected} Link={Link} />
        {user && (
          <button
            type="button"
            className="ml-auto h-10 w-10 cursor-pointer rounded-full border border-zinc-200 dark:border-zinc-800"
          >
            {user.image && <img src={user.image} alt="프로필 사진" />}
            {!user.image && (
              <div className="flex h-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                <UserIcon weight="fill" className="text-zinc-700 dark:text-zinc-300" />
              </div>
            )}
          </button>
        )}
        {!user && (
          <>
            <Button className="ml-auto" onClick={() => setOpen(true)}>
              시작하기
            </Button>
            <LoginModal {...modalProps} verifyPostId={verifyPostId} />
          </>
        )}
      </div>
    </nav>
  );
}

"use client";

import type { UserProfile } from "@daisy/entry-api";
import { Button, cn, Input, Logo, Modal, Tabs, useModal, type LinkTab } from "@daisy/ui";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "waku";
import z from "zod";
import { checkVerificationSession, createVerificationSession } from "../../actions/auth";

const tabs: LinkTab[] = [
  { href: "/", label: "홈" },
  { href: "/store", label: "스토어" },
  { href: "/direct", label: "Direct" },
  { href: "/download", label: "다운로드" },
];

export function Nav({ verifyPostId }: { verifyPostId: string }) {
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
      <div className="mx-auto grid h-18 w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center">
        <Link to="/" className="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo className="h-7.25 w-7.25" />
          Daisy
        </Link>
        <Tabs tabs={tabs} selected={selected} Link={Link} />
        <Button className="ml-auto" onClick={() => setOpen(true)}>
          시작하기
        </Button>
        <Modal {...modalProps} className="">
          <LoginModalContent verifyPostId={verifyPostId} />
        </Modal>
      </div>
    </nav>
  );
}

const EntryId = z.string().regex(/^[0-9a-f]{24}$/, "엔트리 아이디 형식이 올바르지 않아요.");

function objectIdToDate(objectId: string): Date {
  return new Date(parseInt(objectId.slice(0, 8), 16) * 1000);
}

type Tab = "login" | "join";

function LoginModalContent({ verifyPostId }: { verifyPostId: string }) {
  const [tab, setTab] = useState<Tab>("join");
  const [loginStep, setLoginStep] = useState(0);
  const [joinStep, setJoinStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const [entryId, setEntryId] = useState<string>("");

  const [entryProfile, setEntryProfile] = useState<UserProfile | null>(null);
  const [verificationSession, setVerificationSession] = useState<{ code: string; expiry: Date } | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string>("");

  const isEntryIdValid = useMemo(() => {
    const res = EntryId.safeParse(entryId);
    if (!res.success) return false;

    const date = objectIdToDate(res.data);
    if (date.getFullYear() < 2013 || date.getFullYear() > new Date().getFullYear()) return false;

    return true;
  }, [entryId]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div className="px-8 pt-4 pb-7.5">
      <Tabs
        className="mx-auto"
        tabs={[
          { id: "login", label: "로그인", onClick: () => tab !== "login" && setTab("login") },
          { id: "join", label: "회원가입", onClick: () => tab !== "join" && setTab("join") },
        ]}
        selected={tab}
      />
      <h2 className="mt-6 px-1.5 font-semibold text-xl">
        {tab === "login" ? "로그인" : joinStep === 2 ? "엔트리 계정 인증" : joinStep === 3 ? "" : "회원가입"}
      </h2>
      <form
        className="mt-2 flex w-70 flex-col gap-y-2.25"
        onSubmit={async (e) => {
          e.preventDefault();
          if (tab === "join") {
            if (joinStep === 0) setJoinStep(1);
            else if (joinStep === 1) {
              if (!isEntryIdValid) return;
              setError("");
              setLoading(true);
              const res = await createVerificationSession(entryId);
              if (!res.success) {
                setError(res.error);
                setLoading(false);
                return;
              }
              const { code, expiry, ...profile } = res.data;
              setEntryProfile(profile);
              setVerificationSession({ code, expiry: new Date(expiry) });
              setLoading(false);
              setJoinStep(2);
            } else if (joinStep === 2) {
              setError("");
              setLoading(true);
              const res = await checkVerificationSession(entryId);
              if (!res.success) {
                setError(res.error);
                setLoading(false);
                return;
              }
              setVerifiedCode(res.data);
              setLoading(false);
              setJoinStep(3);
            } else if (joinStep === 3) {
              setError("");
              setLoading(true);
            }
          }
        }}
      >
        {((tab === "login" && loginStep === 0) || (tab === "join" && joinStep === 3)) && (
          <>
            {tab === "join" && <input type="hidden" value={verifiedCode} />}
            <Input label="이메일" placeholder="me@tica.fun" autoFocus />
            <Input label="비밀번호" placeholder="••••••••" />
            {tab === "join" && <Input label="이름" placeholder="띠까" />}
            <Button type="submit" className="mt-2">
              {tab === "login" ? "로그인" : "회원가입"}
            </Button>
          </>
        )}
        {tab === "join" && joinStep === 0 && (
          <>
            <div>placeholder</div>
            <Button type="submit" className="mt-2">
              다음
            </Button>
          </>
        )}
        {tab === "join" && joinStep === 1 && (
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
            <div className="flex gap-x-3">
              <Button
                type="button"
                color="secondary"
                className="mt-2 shrink-0"
                onClick={() => {
                  setCopied(false);
                  setVerificationSession(null);
                  setJoinStep(1);
                }}
              >
                이전
              </Button>
              <Button type="submit" className="mt-2 w-full" disabled={!isEntryIdValid} loading={loading}>
                다음
              </Button>
            </div>
          </>
        )}
        {tab === "join" && joinStep === 2 && entryProfile && verificationSession && (
          <>
            <div className="corner-squircle flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-100 pr-2.75 pl-3.25 supports-corner-shape:rounded-3xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mt-px flex flex-col pt-2.75 pb-2">
                <span className="select-none font-medium text-xs text-zinc-500 leading-none group-focus-within/input:text-zinc-800 dark:group-focus-within/input:text-zinc-200">
                  선택된 계정
                </span>
                <div className="mt-1.25 flex flex-col gap-y-px">
                  <span className="pl-px font-medium leading-none">
                    {entryProfile.nickname}{" "}
                    <span className="font-normal text-sm text-zinc-400">({entryProfile.username})</span>
                  </span>
                  <span className="font-mono text-xs text-zinc-500 leading-none">{entryProfile.id}</span>
                </div>
              </div>
              <img
                src={`https://playentry.org/uploads/${entryProfile.profileImage?.filename.slice(0, 2)}/${entryProfile.profileImage?.filename.slice(2, 4)}/${entryProfile.profileImage?.filename}.${entryProfile.profileImage?.imageType}`}
                className="mt-px h-12 w-12 rounded-full border border-zinc-700 object-cover"
                alt={`${entryProfile.nickname} 프로필 이미지`}
              />
            </div>
            <div className="corner-squircle relative overflow-clip rounded-xl supports-corner-shape:rounded-3xl">
              <Input
                label="인증 코드"
                className="pointer-events-none disabled:cursor-pointer"
                labelProps={{
                  className: "has-disabled:cursor-pointer",
                  onClick: () => navigator.clipboard.writeText(verificationSession.code).then(() => setCopied(true)),
                }}
                value={verificationSession.code}
                disabled
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex cursor-pointer select-none items-center justify-center bg-brand-100/50 text-brand-700 opacity-0 backdrop-blur-sm transition-opacity dark:bg-brand-900/50 dark:text-brand-300",
                  copied && "opacity-100",
                )}
              >
                클립보드에 복사했어요.
              </div>
            </div>
            <p className="mt-0.5 px-0.5 font-medium text-[13px] text-zinc-700 leading-4.5 dark:text-zinc-300">
              위 인증 코드를 클릭해 복사한 뒤,{" "}
              <a
                href={`https://playentry.org/community/entrystory/${verifyPostId}`}
                target="_blank"
                rel="noopener"
                className="font-semibold text-brand-500"
              >
                이 글
              </a>
              의 댓글에 붙여넣어 주세요. 인증 코드는 {verificationSession.expiry.getHours() % 12 || 12}시{" "}
              {verificationSession.expiry.getMinutes()}
              분까지 유효해요.
            </p>
            <div className="flex gap-x-3">
              <Button
                type="button"
                color="secondary"
                className="mt-2 shrink-0"
                onClick={() => {
                  setCopied(false);
                  setVerificationSession(null);
                  setJoinStep(1);
                }}
              >
                이전
              </Button>
              <Button type="submit" className="mt-2 w-full" loading={loading}>
                다음
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

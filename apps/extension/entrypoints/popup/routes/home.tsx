import { Button, Logo } from "@daisy/ui";

export function Home() {
  return (
    <>
      <div className="flex justify-between px-4 pt-5">
        <div className="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo className="h-7.25 w-7.25" />
          Daisy
        </div>
        <Button>로그인</Button>
      </div>
      <div />
    </>
  );
}

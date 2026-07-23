import { Button, Logo } from "@daisy/ui";

export function Home() {
  return (
    <>
      <div class="flex justify-between px-4 pt-5">
        <div class="-mt-0.5 flex items-center gap-x-1.5 font-bold font-display text-[22px]">
          <Logo class="h-7.25 w-7.25" />
          Daisy
        </div>
        <Button>로그인</Button>
      </div>
      <div />
    </>
  );
}

export default function Index() {
  return (
    <div class="px-6">
      <div class="corner-squircle relative mx-auto h-100 max-w-[calc(var(--container-4xl)+48px)] overflow-clip rounded-2xl border border-zinc-100 bg-[url('/banner.svg')] bg-brand bg-cover supports-corner-shape:rounded-4xl dark:border-zinc-900">
        <div class="flex h-full w-full flex-col justify-end bg-linear-[8deg] from-20% from-[color-mix(in_hsl,var(--color-brand),black_20%)] to-brand/0 px-8 py-6.5 dark:from-[color-mix(in_hsl,var(--color-brand),black_30%)] dark:backdrop-brightness-70">
          <h1 class="font-bold text-[32px] text-white drop-shadow-2xl">엔트리를 더 편리하게 만들어요</h1>
          <p class="mt-1 text-balance break-keep font-medium text-lg text-zinc-100 drop-shadow-2xl">
            엔트리의 기본 기능에 갈증을 느끼셨나요? Daisy만 있으면 엔트리에서 더 다양한 스티커를 사용하고, 엔트리
            이야기에 사진을 올리고, 작품에 GIF 오브젝트를 추가하고, 작품을 실행하는 데 필요한 외부 스크립트를 자동으로
            로드할 수도 있어요. 보고 싶지 않은 유저를 차단하는 기능과 Daisy 유저 간의 Direct Message 기능도 있답니다.
          </p>
        </div>
      </div>
    </div>
  );
}

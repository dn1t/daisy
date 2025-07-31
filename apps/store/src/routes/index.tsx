import { useSession } from "@daisy/auth/client";

export default function Index() {
  const session = useSession();

  return (
    <div>
      <h1 class="font-semibold text-5xl">@daisy/store</h1>
      <p>Hello, world!</p>
      <div>{session().data?.user.name ?? "바보"}</div>
    </div>
  );
}

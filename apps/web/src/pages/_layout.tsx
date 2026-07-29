import "../styles.css";

import type { ReactNode } from "react";
import { Nav } from "../components/layout/nav";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <link href="/fonts.css" rel="stylesheet" />
      <Nav verifyPostId={process.env.ENTRY_VERIFY_POST_ID ?? "60c6c9e116c381168ecdb779"} />
      {children}
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};

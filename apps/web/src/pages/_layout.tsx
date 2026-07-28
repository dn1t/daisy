import "../styles.css";

import type { ReactNode } from "react";
import { Nav } from "../components/layout/nav";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <link href="/fonts.css" rel="stylesheet" />
      <Nav />
      {children}
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};

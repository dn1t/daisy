import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Nav } from "./nav";

export function Root(props: RouteSectionProps) {
  return (
    <>
      <Nav />
      <Suspense>{props.children}</Suspense>
    </>
  );
}

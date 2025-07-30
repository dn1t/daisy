import type { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

export function Root(props: RouteSectionProps) {
  return <Suspense>{props.children}</Suspense>;
}

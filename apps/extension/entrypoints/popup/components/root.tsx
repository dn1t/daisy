import type { RouteSectionProps } from "@solidjs/router";

export function Root(props: RouteSectionProps) {
  return <Suspense>{props.children}</Suspense>;
}

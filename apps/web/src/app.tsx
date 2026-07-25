import "@daisy/tailwind-config";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Root } from "./components/layout/root";

import { test } from "@daisy/entry-api";

test();

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
}

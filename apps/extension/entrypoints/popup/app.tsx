import "@daisy/tailwind-config";

import { MemoryRouter, Route } from "@solidjs/router";
import { Root } from "./components/root";
import { Home } from "./routes/home";

export function App() {
  return (
    <MemoryRouter root={Root}>
      <Route path="/" component={Home} />
    </MemoryRouter>
  );
}

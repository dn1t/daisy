import "@daisy/tailwind-config";

import { MemoryRouter, Route, Routes } from "react-router";
import { Root } from "./components/root";
import { Home } from "./routes/home";

export function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

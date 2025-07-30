import "./styles.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Root } from "./components/layout/root";

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
}

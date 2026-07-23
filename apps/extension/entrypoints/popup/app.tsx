import "@daisy/tailwind-config";

import logo from "@/assets/logo.svg";

export function App() {
  return (
    <div class="font-bold font-display text-5xl">
      <img src={logo} alt="Daisy Logo" />
      Hello, Daisy!
    </div>
  );
}

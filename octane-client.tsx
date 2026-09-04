/** @jsxImportSource octane */
import { createRoot } from "octane";
import { App } from "./octane/App.tsrx";
import "./pinku-octane.css";

const elem = document.getElementById("root")!;

// Single root render is enough (no double-invoke).
if (import.meta.hot) {
  const root = ((import.meta.hot.data as any).root ??= createRoot(elem));
  root.render(<App />);
} else {
  createRoot(elem).render(<App />);
}

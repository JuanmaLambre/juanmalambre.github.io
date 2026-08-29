import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";

export function mount(node) {
  createRoot(document.getElementById("root")).render(<StrictMode>{node}</StrictMode>);
}

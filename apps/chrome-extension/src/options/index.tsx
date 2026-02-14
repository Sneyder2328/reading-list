import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Options } from "./Options";
import "@/lib/env";
import "@/styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found for options");
}

createRoot(container).render(
  <StrictMode>
    <Options />
  </StrictMode>,
);

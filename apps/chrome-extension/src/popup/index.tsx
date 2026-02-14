import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Popup } from "./Popup";
import "@/styles.css";
import "@/lib/env";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found for popup");
}

createRoot(container).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);

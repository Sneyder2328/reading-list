import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/web",
  "apps/chrome-extension",
  "packages/firebase",
  "packages/ui",
]);

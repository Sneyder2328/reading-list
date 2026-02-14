import { describe, expect, it } from "vitest";

import { normalizeBookmarkUrl } from "./url";

describe("normalizeBookmarkUrl", () => {
  it("removes hash fragments", () => {
    expect(normalizeBookmarkUrl("https://example.com/article#section")).toBe(
      "https://example.com/article",
    );
  });

  it("removes trailing slash on non-root paths", () => {
    expect(normalizeBookmarkUrl("https://example.com/docs/")).toBe(
      "https://example.com/docs",
    );
  });
});

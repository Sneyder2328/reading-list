export function normalizeBookmarkUrl(url: string): string {
  try {
    const normalized = new URL(url);
    normalized.hash = "";
    if (normalized.pathname.endsWith("/") && normalized.pathname.length > 1) {
      normalized.pathname = normalized.pathname.slice(0, -1);
    }
    return normalized.toString();
  } catch {
    return url.trim();
  }
}

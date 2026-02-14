import {
  getStoredUser,
  signInWithEmailPassword,
  signOut as signOutFromExtension,
} from "@/lib/auth";
import {
  deleteBookmark,
  getBookmarks,
  getRecentBookmarks,
  isUrlSaved,
  toggleBookmark,
} from "@/lib/firebase";
import "@/lib/env";

const CONTEXT_MENU_ID = "reading-list-save-link";
const WEB_APP_URL = "https://reading.sneyderangulo.com";
const SAVED_URL_CACHE_KEY = "savedUrlCache";
const SAVED_URL_CACHE_USER_ID_KEY = "savedUrlCacheUserId";

const savedUrlCache = new Set<string>();
let cachedUserId: string | null = null;

function normalizeUrl(url: string): string {
  try {
    const normalized = new URL(url);
    normalized.hash = "";
    return normalized.toString();
  } catch {
    return url;
  }
}

function getIconPath(isSaved: boolean): chrome.action.TabIconDetails["path"] {
  if (isSaved) {
    return {
      16: "icons/icon-saved-16.png",
      48: "icons/icon-saved-48.png",
      128: "icons/icon-saved-128.png",
    };
  }

  return {
    16: "icons/icon-unsaved-16.png",
    48: "icons/icon-unsaved-48.png",
    128: "icons/icon-unsaved-128.png",
  };
}

async function updateIcon(tabId: number, isSaved: boolean): Promise<void> {
  await chrome.action.setIcon({
    tabId,
    path: getIconPath(isSaved),
  });
}

async function persistCache(userId: string): Promise<void> {
  await chrome.storage.local.set({
    [SAVED_URL_CACHE_KEY]: Array.from(savedUrlCache),
    [SAVED_URL_CACHE_USER_ID_KEY]: userId,
  });
}

async function restoreCache(userId: string): Promise<boolean> {
  const stored = await chrome.storage.local.get([
    SAVED_URL_CACHE_KEY,
    SAVED_URL_CACHE_USER_ID_KEY,
  ]);
  const storedUserId = stored[SAVED_URL_CACHE_USER_ID_KEY] as
    | string
    | undefined;
  const cachedUrls = stored[SAVED_URL_CACHE_KEY] as string[] | undefined;

  if (storedUserId !== userId || !cachedUrls) {
    return false;
  }

  savedUrlCache.clear();
  for (const url of cachedUrls) {
    savedUrlCache.add(url);
  }
  cachedUserId = userId;
  return true;
}

async function refreshCacheFromFirestore(userId: string): Promise<void> {
  const bookmarks = await getBookmarks(userId);
  savedUrlCache.clear();
  for (const bookmark of bookmarks) {
    savedUrlCache.add(normalizeUrl(bookmark.url));
  }
  cachedUserId = userId;
  await persistCache(userId);
}

async function ensureCacheReady(userId: string): Promise<void> {
  if (cachedUserId === userId && savedUrlCache.size > 0) {
    return;
  }

  const restored = await restoreCache(userId);
  if (restored) {
    return;
  }

  await refreshCacheFromFirestore(userId);
}

async function checkIfUrlSaved(url?: string): Promise<boolean> {
  if (!url || !url.startsWith("http")) {
    return false;
  }

  const user = await getStoredUser();
  if (!user) {
    savedUrlCache.clear();
    cachedUserId = null;
    return false;
  }

  await ensureCacheReady(user.uid);

  const normalizedUrl = normalizeUrl(url);
  if (savedUrlCache.has(normalizedUrl)) {
    return true;
  }

  const remoteValue = await isUrlSaved(user.uid, normalizedUrl);
  if (remoteValue) {
    savedUrlCache.add(normalizedUrl);
    await persistCache(user.uid);
  }
  return remoteValue;
}

async function updateIconForTab(tabId: number, url?: string): Promise<void> {
  const isSaved = await checkIfUrlSaved(url);
  await updateIcon(tabId, isSaved);
}

async function toggleCurrentTabBookmark(tab: chrome.tabs.Tab) {
  if (!tab.id || !tab.url) {
    return { ok: false, error: "No active tab URL available" } as const;
  }

  const user = await getStoredUser();
  if (!user) {
    return { ok: false, error: "Please sign in first" } as const;
  }

  const result = await toggleBookmark(user.uid, tab.url, {
    title: tab.title ?? tab.url,
    favicon: tab.favIconUrl,
  });
  const normalizedUrl = normalizeUrl(tab.url);

  await ensureCacheReady(user.uid);
  if (result.action === "saved") {
    savedUrlCache.add(normalizedUrl);
  } else {
    savedUrlCache.delete(normalizedUrl);
  }
  await persistCache(user.uid);

  await updateIcon(tab.id, result.action === "saved");
  return { ok: true, result } as const;
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save to Reading List",
    contexts: ["page"],
  });
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  await updateIconForTab(tabId, tab.url);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    await updateIconForTab(tabId, changeInfo.url ?? tab.url);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !tab) {
    return;
  }

  await toggleCurrentTabBookmark(tab);
});

chrome.action.onClicked.addListener(async (tab) => {
  await toggleCurrentTabBookmark(tab);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const run = async () => {
    if (message.type === "GET_POPUP_STATE") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const user = await getStoredUser();
      const saved = await checkIfUrlSaved(tab?.url);
      const recent = user ? await getRecentBookmarks(user.uid, 10) : [];
      return {
        ok: true,
        payload: {
          user,
          currentUrl: tab?.url ?? null,
          currentTabId: tab?.id ?? null,
          isSaved: saved,
          recent,
        },
      };
    }

    if (message.type === "TOGGLE_CURRENT_TAB") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) {
        return { ok: false, error: "No active tab found" };
      }
      return toggleCurrentTabBookmark(tab);
    }

    if (message.type === "DELETE_BOOKMARK") {
      await deleteBookmark(message.bookmarkId as string);
      const user = await getStoredUser();
      if (user) {
        await refreshCacheFromFirestore(user.uid);
      }
      return { ok: true };
    }

    if (message.type === "SIGN_IN_EMAIL_PASSWORD") {
      const { email, password } = message as {
        email?: unknown;
        password?: unknown;
      };

      if (typeof email !== "string" || typeof password !== "string") {
        return { ok: false, error: "Email and password are required" };
      }

      const user = await signInWithEmailPassword(email, password);
      await refreshCacheFromFirestore(user.uid);
      return { ok: true, payload: user };
    }

    if (message.type === "SIGN_OUT") {
      await signOutFromExtension();
      savedUrlCache.clear();
      cachedUserId = null;
      await chrome.storage.local.remove([
        SAVED_URL_CACHE_KEY,
        SAVED_URL_CACHE_USER_ID_KEY,
      ]);
      return { ok: true };
    }

    if (message.type === "OPEN_WEB_APP") {
      const path =
        typeof (message as { path?: unknown }).path === "string"
          ? (message as { path: string }).path
          : "";
      const url = new URL(path, WEB_APP_URL).toString();
      await chrome.tabs.create({ url });
      return { ok: true };
    }

    return { ok: false, error: "Unknown message type" };
  };

  run()
    .then((result) => sendResponse(result))
    .catch((error: unknown) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      });
    });

  return true;
});

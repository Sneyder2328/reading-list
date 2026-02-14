import type { Bookmark } from "@reading-list/firebase";
import {
  type BookmarkItemData,
  BookmarkList,
  EmptyState,
  LoadingSpinner,
} from "@reading-list/ui";
import { useEffect, useMemo, useState } from "react";

interface PopupState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
  } | null;
  currentUrl: string | null;
  isSaved: boolean;
  recent: Bookmark[];
}

async function sendMessage<T>(message: unknown): Promise<T> {
  const response = await chrome.runtime.sendMessage(message);
  if (!response?.ok) {
    throw new Error(response?.error ?? "Request failed");
  }
  return response.payload as T;
}

function toDateLabel(bookmark: Bookmark): string {
  const timestamp = bookmark.createdAt as
    | { toMillis?: () => number; seconds?: number }
    | undefined;

  if (!timestamp) {
    return "Unknown date";
  }

  if (typeof timestamp.toMillis === "function") {
    return new Date(timestamp.toMillis()).toLocaleDateString();
  }

  if (typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  return "Unknown date";
}

export function Popup() {
  const [state, setState] = useState<PopupState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const items = useMemo<BookmarkItemData[]>(
    () =>
      (state?.recent ?? []).map((bookmark) => ({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        createdAt: toDateLabel(bookmark),
      })),
    [state],
  );

  const loadState = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await sendMessage<PopupState>({
        type: "GET_POPUP_STATE",
      });
      setState(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load popup state",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadState();
  }, []);

  return (
    <main className="space-y-4 p-4">
      <header>
        <h1 className="text-lg font-semibold">Reading List</h1>
        <p className="text-xs text-zinc-400">
          {state?.user
            ? `Signed in as ${state.user.email ?? "user"}`
            : "Not signed in"}
        </p>
      </header>

      {loading ? <LoadingSpinner label="Loading popup..." /> : null}
      {error ? (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}

      {!loading ? (
        <section className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm">
          <p className="font-medium text-zinc-200">Current page</p>
          <p className="mt-1 line-clamp-2 break-all text-xs text-zinc-400">
            {state?.currentUrl ?? "No active tab URL"}
          </p>
          <p className="mt-2 text-xs">
            Status:{" "}
            <span
              className={state?.isSaved ? "text-emerald-400" : "text-zinc-400"}
            >
              {state?.isSaved ? "Saved" : "Not saved"}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-400"
              onClick={async () => {
                await sendMessage({ type: "TOGGLE_CURRENT_TAB" });
                await loadState();
              }}
              type="button"
            >
              Toggle Save
            </button>
            <button
              className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700"
              onClick={async () => {
                await sendMessage({ type: "OPEN_WEB_APP" });
              }}
              type="button"
            >
              Open Reading List
            </button>
            {state?.user ? (
              <button
                className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700"
                onClick={async () => {
                  await sendMessage({ type: "OPEN_WEB_APP", path: "/logout" });
                }}
                type="button"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="grid grid-cols-1 gap-2">
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder:text-zinc-500"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    type="email"
                    value={email}
                  />
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 placeholder:text-zinc-500"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                    value={password}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={authLoading || email.length === 0 || password.length === 0}
                    onClick={async () => {
                      try {
                        setAuthLoading(true);
                        setError(null);
                        await sendMessage({
                          type: "SIGN_IN_EMAIL_PASSWORD",
                          email,
                          password,
                        });
                        setPassword("");
                        await loadState();
                      } catch (authError) {
                        setError(
                          authError instanceof Error
                            ? authError.message
                            : "Failed to sign in",
                        );
                      } finally {
                        setAuthLoading(false);
                      }
                    }}
                    type="button"
                  >
                    {authLoading ? "Signing in..." : "Sign In"}
                  </button>
                  <button
                    className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700"
                    onClick={async () => {
                      await sendMessage({ type: "OPEN_WEB_APP", path: "/login" });
                    }}
                    type="button"
                  >
                    Use web login
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {!loading ? (
        <section>
          <h2 className="mb-2 text-sm font-medium text-zinc-200">
            Recent bookmarks
          </h2>
          {items.length === 0 ? (
            <EmptyState
              description="Your recent bookmarks will appear here."
              title="No bookmarks yet"
            />
          ) : (
            <BookmarkList
              bookmarks={items}
              onDelete={async (bookmark) => {
                await sendMessage({
                  type: "DELETE_BOOKMARK",
                  bookmarkId: bookmark.id,
                });
                await loadState();
              }}
              onOpen={(bookmark) => {
                void chrome.tabs.create({ url: bookmark.url });
              }}
            />
          )}
        </section>
      ) : null}
    </main>
  );
}

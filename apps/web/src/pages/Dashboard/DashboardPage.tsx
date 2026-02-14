import type { Bookmark } from "@reading-list/firebase";
import { EmptyState, LoadingSpinner } from "@reading-list/ui";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useArchiveBookmark } from "@/hooks/useArchiveBookmark";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { BookmarkCard } from "@/pages/Dashboard/components";

const SORT_PREFERENCE_KEY = "dashboard-sort-preference";

type SortMode = "newest" | "oldest";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function sortBookmarks(bookmarks: Bookmark[], sortMode: SortMode): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    const first = a.createdAt.toMillis();
    const second = b.createdAt.toMillis();
    return sortMode === "newest" ? second - first : first - second;
  });
}

export function DashboardPage() {
  const { data, error, isLoading } = useBookmarks();
  const archiveMutation = useArchiveBookmark();
  const deleteMutation = useDeleteBookmark();
  const { signOut, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>(() => {
    const stored = window.localStorage.getItem(SORT_PREFERENCE_KEY);
    return stored === "oldest" ? "oldest" : "newest";
  });

  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const source = sortBookmarks(data ?? [], sortMode);
    if (!query) {
      return source;
    }
    return source.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query),
    );
  }, [data, searchQuery, sortMode]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const activeElementTag = document.activeElement?.tagName.toLowerCase();
      const isTyping =
        activeElementTag === "input" ||
        activeElementTag === "textarea" ||
        document.activeElement?.getAttribute("contenteditable") === "true";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      const searchInput = searchInputRef.current;
      if (
        event.key === "Escape" &&
        searchInput &&
        document.activeElement === searchInput
      ) {
        searchInput.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Bookmarks</h1>
          <p className="text-sm text-zinc-400">{user?.email ?? "Signed in"}</p>
        </div>
        <div className="flex items-center gap-2">
          {installPromptEvent ? (
            <Button
              onClick={async () => {
                await installPromptEvent.prompt();
                await installPromptEvent.userChoice;
                setInstallPromptEvent(null);
              }}
              variant="secondary"
            >
              Install App
            </Button>
          ) : null}
          <Link className="text-sm text-blue-300 hover:underline" to="/archive">
            View archive
          </Link>
          <Button
            onClick={async () => {
              await signOut();
            }}
            variant="ghost"
          >
            Sign out
          </Button>
        </div>
      </header>

      <section className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          placeholder="Search by title or URL..."
          ref={searchInputRef}
          value={searchQuery}
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSortMode("newest");
              window.localStorage.setItem(SORT_PREFERENCE_KEY, "newest");
            }}
            variant={sortMode === "newest" ? "default" : "secondary"}
          >
            Newest
          </Button>
          <Button
            onClick={() => {
              setSortMode("oldest");
              window.localStorage.setItem(SORT_PREFERENCE_KEY, "oldest");
            }}
            variant={sortMode === "oldest" ? "default" : "secondary"}
          >
            Oldest
          </Button>
        </div>
      </section>

      {isLoading ? (
        <section className="grid gap-3">
          <LoadingSpinner label="Loading bookmarks..." />
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
              key={`bookmark-skeleton-${index}`}
            />
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
          Failed to load bookmarks.{" "}
          {error instanceof Error ? error.message : "Unknown error"}.
        </section>
      ) : null}

      {!isLoading && !error && filteredBookmarks.length === 0 ? (
        <EmptyState
          description="Save links from the extension and they will appear here."
          title="No bookmarks found"
        />
      ) : null}

      <section className="grid gap-3">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard
            bookmark={bookmark}
            key={bookmark.id}
            onArchive={async (bookmarkId) => {
              try {
                await archiveMutation.mutateAsync(bookmarkId);
                toast.success("Bookmark archived");
              } catch {
                toast.error("Failed to archive bookmark");
              }
            }}
            onDelete={async (bookmarkId) => {
              if (!window.confirm("Delete this bookmark permanently?")) {
                return;
              }

              try {
                await deleteMutation.mutateAsync(bookmarkId);
                toast.success("Bookmark deleted");
              } catch {
                toast.error("Failed to delete bookmark");
              }
            }}
          />
        ))}
      </section>
    </main>
  );
}

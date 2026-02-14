import type { Bookmark } from "@reading-list/firebase";
import { EmptyState, LoadingSpinner } from "@reading-list/ui";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ArrowDownUp,
  BookmarkX,
  Download,
  LogOut,
  Search,
} from "lucide-react";
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
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Bookmarks
          </h1>
          <p className="text-sm text-zinc-400">{user?.email ?? "Signed in"}</p>
        </div>
        <div className="flex items-center gap-2">
          {installPromptEvent ? (
            <Button
              className="gap-2"
              onClick={async () => {
                await installPromptEvent.prompt();
                await installPromptEvent.userChoice;
                setInstallPromptEvent(null);
              }}
              variant="secondary"
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
          ) : null}
          <Link
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-400/10 hover:text-blue-300"
            to="/archive"
          >
            <Archive className="h-4 w-4" />
            View archive
          </Link>
          <Button
            className="gap-2 text-zinc-400 hover:text-white"
            onClick={async () => {
              await signOut();
            }}
            variant="ghost"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            className="pl-9 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500/50"
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Search by title or URL..."
            ref={searchInputRef}
            value={searchQuery}
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-zinc-900/50 p-1 ring-1 ring-zinc-800">
          <Button
            className="h-8 gap-2 rounded-md px-3 text-xs"
            onClick={() => {
              setSortMode("newest");
              window.localStorage.setItem(SORT_PREFERENCE_KEY, "newest");
            }}
            variant={sortMode === "newest" ? "secondary" : "ghost"}
          >
            <ArrowDownUp className="h-3 w-3 rotate-180" />
            Newest
          </Button>
          <Button
            className="h-8 gap-2 rounded-md px-3 text-xs"
            onClick={() => {
              setSortMode("oldest");
              window.localStorage.setItem(SORT_PREFERENCE_KEY, "oldest");
            }}
            variant={sortMode === "oldest" ? "secondary" : "ghost"}
          >
            <ArrowDownUp className="h-3 w-3" />
            Oldest
          </Button>
        </div>
      </section>

      {isLoading ? (
        <section className="grid gap-3">
          <LoadingSpinner label="Loading bookmarks..." />
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-32 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50"
              key={`bookmark-skeleton-${index}`}
            />
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
          <p className="font-medium">Failed to load bookmarks</p>
          <p className="mt-1 text-sm text-red-300/80">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </section>
      ) : null}

      {!isLoading && !error && filteredBookmarks.length === 0 ? (
        <div className="py-12">
          <EmptyState
            description={
              searchQuery
                ? `No bookmarks found matching "${searchQuery}"`
                : "Save links from the extension and they will appear here."
            }
            icon={BookmarkX}
            title="No bookmarks found"
          />
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

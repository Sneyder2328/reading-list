import { EmptyState, LoadingSpinner } from "@reading-list/ui";
import { Link } from "@tanstack/react-router";
import { ArchiveRestore, ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useArchivedBookmarks } from "@/hooks/useArchivedBookmarks";
import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { useUnarchiveBookmark } from "@/hooks/useUnarchiveBookmark";

export function ArchivePage() {
  const { data, error, isLoading } = useArchivedBookmarks();
  const unarchiveMutation = useUnarchiveBookmark();
  const deleteMutation = useDeleteBookmark();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Archive
          </h1>
          <p className="text-sm text-zinc-400">
            Restore archived bookmarks anytime.
          </p>
        </div>
        <Link
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          to="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      {isLoading ? (
        <section className="grid gap-3">
          <LoadingSpinner label="Loading archive..." />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50"
              key={`archived-skeleton-${index}`}
            />
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
          <p className="font-medium">Failed to load archive</p>
          <p className="mt-1 text-sm text-red-300/80">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </section>
      ) : null}

      {!isLoading && !error && (data?.length ?? 0) === 0 ? (
        <div className="py-12">
          <EmptyState
            description="Archived bookmarks will appear here."
            icon={ArchiveRestore}
            title="Archive is empty"
          />
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((bookmark) => (
          <Card
            className="group relative overflow-hidden transition-all hover:border-zinc-700 hover:shadow-md"
            key={bookmark.id}
          >
            <CardHeader>
              <CardTitle className="line-clamp-1 text-base leading-tight">
                {bookmark.title}
              </CardTitle>
              <CardDescription className="line-clamp-1 break-all text-xs">
                {bookmark.url}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Button
                className="h-8 gap-1.5 px-3 text-xs"
                onClick={async () => {
                  try {
                    await unarchiveMutation.mutateAsync(bookmark.id);
                    toast.success("Bookmark restored");
                  } catch {
                    toast.error("Failed to restore bookmark");
                  }
                }}
                variant="secondary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </Button>
              <div className="flex-1" />
              <Button
                className="h-8 w-8 px-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={async () => {
                  if (!window.confirm("Permanently delete this bookmark?")) {
                    return;
                  }

                  try {
                    await deleteMutation.mutateAsync(bookmark.id);
                    toast.success("Bookmark deleted");
                  } catch {
                    toast.error("Failed to delete bookmark");
                  }
                }}
                title="Delete permanently"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

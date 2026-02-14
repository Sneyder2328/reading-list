import { EmptyState, LoadingSpinner } from "@reading-list/ui";
import { Link } from "@tanstack/react-router";
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
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Archive</h1>
          <p className="text-sm text-zinc-400">
            Restore archived bookmarks anytime.
          </p>
        </div>
        <Link className="text-sm text-blue-300 hover:underline" to="/dashboard">
          Back to dashboard
        </Link>
      </header>

      {isLoading ? (
        <section className="grid gap-3">
          <LoadingSpinner label="Loading archive..." />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
              key={`archived-skeleton-${index}`}
            />
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
          Failed to load archive.{" "}
          {error instanceof Error ? error.message : "Unknown error"}.
        </section>
      ) : null}

      {!isLoading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState
          description="Archived bookmarks will appear here."
          title="Archive is empty"
        />
      ) : null}

      <section className="grid gap-3">
        {(data ?? []).map((bookmark) => (
          <Card key={bookmark.id}>
            <CardHeader>
              <CardTitle className="line-clamp-1 text-base">
                {bookmark.title}
              </CardTitle>
              <CardDescription className="line-clamp-1 break-all">
                {bookmark.url}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
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
                Restore
              </Button>
              <Button
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
                variant="danger"
              >
                Delete permanently
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

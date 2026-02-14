import type { Bookmark } from "@reading-list/firebase";
import { Archive, Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onArchive: (bookmarkId: string) => void;
  onDelete: (bookmarkId: string) => void;
}

export function BookmarkCard({
  bookmark,
  onArchive,
  onDelete,
}: BookmarkCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:border-zinc-700 hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-base leading-tight">
          {bookmark.title}
        </CardTitle>
        <CardDescription className="line-clamp-1 break-all text-xs">
          {bookmark.url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => {
              window.open(bookmark.url, "_blank", "noopener,noreferrer");
            }}
            variant="secondary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
          <Button
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => onArchive(bookmark.id)}
            variant="outline"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
          <Button
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => {
              navigator.clipboard.writeText(bookmark.url);
              toast.success("URL copied to clipboard");
            }}
            variant="ghost"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <div className="flex-1" />
          <Button
            className="h-8 w-8 px-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => onDelete(bookmark.id)}
            title="Delete bookmark"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

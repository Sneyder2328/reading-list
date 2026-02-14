import type { Bookmark } from "@reading-list/firebase";

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
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1 text-base">
          {bookmark.title}
        </CardTitle>
        <CardDescription className="line-clamp-1 break-all">
          {bookmark.url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              window.open(bookmark.url, "_blank", "noopener,noreferrer");
            }}
            variant="secondary"
          >
            Open
          </Button>
          <Button onClick={() => onArchive(bookmark.id)} variant="outline">
            Archive
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(bookmark.url);
            }}
            variant="ghost"
          >
            Copy URL
          </Button>
          <Button onClick={() => onDelete(bookmark.id)} variant="danger">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

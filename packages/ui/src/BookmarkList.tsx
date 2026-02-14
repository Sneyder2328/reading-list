import { BookmarkItem, type BookmarkItemData } from "./BookmarkItem";

interface BookmarkListProps {
  bookmarks: BookmarkItemData[];
  onOpen?: (bookmark: BookmarkItemData) => void;
  onArchive?: (bookmark: BookmarkItemData) => void;
  onDelete?: (bookmark: BookmarkItemData) => void;
}

export function BookmarkList({
  bookmarks,
  onOpen,
  onArchive,
  onDelete,
}: BookmarkListProps) {
  return (
    <section className="grid gap-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          bookmark={bookmark}
          key={bookmark.id}
          onArchive={onArchive}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </section>
  );
}

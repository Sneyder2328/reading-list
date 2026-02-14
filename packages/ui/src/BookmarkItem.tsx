export interface BookmarkItemData {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

interface BookmarkItemProps {
  bookmark: BookmarkItemData;
  onOpen?: (bookmark: BookmarkItemData) => void;
  onArchive?: (bookmark: BookmarkItemData) => void;
  onDelete?: (bookmark: BookmarkItemData) => void;
}

export function BookmarkItem({
  bookmark,
  onOpen,
  onArchive,
  onDelete,
}: BookmarkItemProps) {
  return (
    <article className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="line-clamp-1 text-sm font-medium text-zinc-100">
        {bookmark.title}
      </h3>
      <p className="mt-1 line-clamp-1 break-all text-xs text-zinc-400">
        {bookmark.url}
      </p>
      <p className="mt-1 text-xs text-zinc-500">Saved: {bookmark.createdAt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {onOpen ? (
          <button
            className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700"
            onClick={() => onOpen(bookmark)}
            type="button"
          >
            Open
          </button>
        ) : null}
        {onArchive ? (
          <button
            className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700"
            onClick={() => onArchive(bookmark)}
            type="button"
          >
            Archive
          </button>
        ) : null}
        {onDelete ? (
          <button
            className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
            onClick={() => onDelete(bookmark)}
            type="button"
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}

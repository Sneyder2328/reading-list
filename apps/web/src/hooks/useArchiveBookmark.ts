import type { Bookmark } from "@reading-list/firebase";
import { archiveBookmark } from "@reading-list/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

export function useArchiveBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: string) => archiveBookmark(bookmarkId),
    onMutate: async (bookmarkId: string) => {
      if (!user) {
        return null;
      }

      const activeKey = queryKeys.bookmarks(user.uid);
      const archivedKey = queryKeys.archivedBookmarks(user.uid);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: activeKey }),
        queryClient.cancelQueries({ queryKey: archivedKey }),
      ]);

      const previousActive =
        queryClient.getQueryData<Bookmark[]>(activeKey) ?? [];
      queryClient.setQueryData<Bookmark[]>(
        activeKey,
        previousActive.filter((bookmark) => bookmark.id !== bookmarkId),
      );

      return { previousActive };
    },
    onError: (_error, _bookmarkId, context) => {
      if (!user || !context) {
        return;
      }
      queryClient.setQueryData(
        queryKeys.bookmarks(user.uid),
        context.previousActive,
      );
    },
    onSuccess: async () => {
      if (!user) {
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.bookmarks(user.uid),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.archivedBookmarks(user.uid),
        }),
      ]);
    },
  });
}

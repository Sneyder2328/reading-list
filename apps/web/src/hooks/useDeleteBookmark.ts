import type { Bookmark } from "@reading-list/firebase";
import { deleteBookmark } from "@reading-list/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

export function useDeleteBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: string) => deleteBookmark(bookmarkId),
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
      const previousArchived =
        queryClient.getQueryData<Bookmark[]>(archivedKey) ?? [];

      queryClient.setQueryData<Bookmark[]>(
        activeKey,
        previousActive.filter((bookmark) => bookmark.id !== bookmarkId),
      );
      queryClient.setQueryData<Bookmark[]>(
        archivedKey,
        previousArchived.filter((bookmark) => bookmark.id !== bookmarkId),
      );

      return { previousActive, previousArchived };
    },
    onError: (_error, _bookmarkId, context) => {
      if (!user || !context) {
        return;
      }
      queryClient.setQueryData(
        queryKeys.bookmarks(user.uid),
        context.previousActive,
      );
      queryClient.setQueryData(
        queryKeys.archivedBookmarks(user.uid),
        context.previousArchived,
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

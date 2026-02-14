import type { Bookmark } from "@reading-list/firebase";
import { unarchiveBookmark } from "@reading-list/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

export function useUnarchiveBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: string) => unarchiveBookmark(bookmarkId),
    onMutate: async (bookmarkId: string) => {
      if (!user) {
        return null;
      }

      const archivedKey = queryKeys.archivedBookmarks(user.uid);
      await queryClient.cancelQueries({ queryKey: archivedKey });

      const previousArchived =
        queryClient.getQueryData<Bookmark[]>(archivedKey) ?? [];
      queryClient.setQueryData<Bookmark[]>(
        archivedKey,
        previousArchived.filter((bookmark) => bookmark.id !== bookmarkId),
      );

      return { previousArchived };
    },
    onError: (_error, _bookmarkId, context) => {
      if (!user || !context) {
        return;
      }
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

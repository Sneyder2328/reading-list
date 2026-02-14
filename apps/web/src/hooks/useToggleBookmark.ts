import { toggleBookmark } from "@reading-list/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

interface ToggleBookmarkInput {
  url: string;
  title: string;
  favicon?: string;
  description?: string;
}

export function useToggleBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ToggleBookmarkInput) => {
      if (!user) {
        throw new Error("You must be signed in");
      }
      return toggleBookmark(user.uid, input.url, {
        title: input.title,
        favicon: input.favicon,
        description: input.description,
      });
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

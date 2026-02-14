import { getBookmarks } from "@reading-list/firebase";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

export function useBookmarks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: user ? queryKeys.bookmarks(user.uid) : ["bookmarks", "anonymous"],
    enabled: Boolean(user),
    queryFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      return getBookmarks(user.uid);
    },
  });
}

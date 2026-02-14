import { getArchivedBookmarks } from "@reading-list/firebase";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/hooks/queryKeys";

export function useArchivedBookmarks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: user
      ? queryKeys.archivedBookmarks(user.uid)
      : ["archivedBookmarks", "anonymous"],
    enabled: Boolean(user),
    queryFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      return getArchivedBookmarks(user.uid);
    },
  });
}

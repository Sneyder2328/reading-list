export const queryKeys = {
  bookmarks: (userId: string) => ["bookmarks", userId] as const,
  archivedBookmarks: (userId: string) => ["archivedBookmarks", userId] as const,
};

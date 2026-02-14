export { firebaseApp, firebaseAuth, firebaseDb } from "./app";
export {
  getCurrentUser,
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from "./auth";
export { getFirebaseConfig } from "./config";

export {
  archiveBookmark,
  createBookmark,
  deleteBookmark,
  getArchivedBookmarks,
  getBookmarkById,
  getBookmarks,
  getRecentBookmarks,
  isUrlSaved,
  toggleBookmark,
  unarchiveBookmark,
} from "./firestore";

export type { AuthUser, Bookmark, CreateBookmarkInput } from "./types";
export { normalizeBookmarkUrl } from "./url";

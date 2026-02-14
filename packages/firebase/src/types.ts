import type { Timestamp } from "firebase/firestore";

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Bookmark {
  id: string;
  userId: string;
  url: string;
  normalizedUrl: string;
  title: string;
  favicon?: string;
  description?: string;
  createdAt: Timestamp;
  archivedAt?: Timestamp | null;
}

export interface CreateBookmarkInput {
  url: string;
  title: string;
  favicon?: string;
  description?: string;
}

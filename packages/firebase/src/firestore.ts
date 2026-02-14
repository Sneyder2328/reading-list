import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseDb } from "./app";
import type { Bookmark, CreateBookmarkInput } from "./types";
import { normalizeBookmarkUrl } from "./url";

const BOOKMARKS_COLLECTION = "bookmarks";

function toBookmark(id: string, data: Record<string, unknown>): Bookmark {
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
  const archivedAt =
    data.archivedAt instanceof Timestamp ? data.archivedAt : null;

  return {
    id,
    userId: data.userId as string,
    url: data.url as string,
    normalizedUrl: data.normalizedUrl as string,
    title: data.title as string,
    favicon: data.favicon as string | undefined,
    description: data.description as string | undefined,
    createdAt,
    archivedAt,
  };
}

async function getBookmarkByNormalizedUrl(
  userId: string,
  normalizedUrl: string,
): Promise<Bookmark | null> {
  const bookmarksRef = collection(firebaseDb, BOOKMARKS_COLLECTION);
  const bookmarksQuery = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("normalizedUrl", "==", normalizedUrl),
    limit(1),
  );
  const snapshot = await getDocs(bookmarksQuery);
  if (snapshot.empty) {
    return null;
  }

  const bookmarkDoc = snapshot.docs[0];
  return toBookmark(bookmarkDoc.id, bookmarkDoc.data());
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const bookmarksRef = collection(firebaseDb, BOOKMARKS_COLLECTION);
  const bookmarksQuery = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("archivedAt", "==", null),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(bookmarksQuery);
  return snapshot.docs.map((bookmarkDoc) =>
    toBookmark(bookmarkDoc.id, bookmarkDoc.data()),
  );
}

export async function getArchivedBookmarks(
  userId: string,
): Promise<Bookmark[]> {
  const bookmarksRef = collection(firebaseDb, BOOKMARKS_COLLECTION);
  const bookmarksQuery = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("archivedAt", "!=", null),
    orderBy("archivedAt", "desc"),
  );
  const snapshot = await getDocs(bookmarksQuery);
  return snapshot.docs.map((bookmarkDoc) =>
    toBookmark(bookmarkDoc.id, bookmarkDoc.data()),
  );
}

export async function getRecentBookmarks(
  userId: string,
  maxItems = 10,
): Promise<Bookmark[]> {
  const bookmarksRef = collection(firebaseDb, BOOKMARKS_COLLECTION);
  const bookmarksQuery = query(
    bookmarksRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxItems),
  );
  const snapshot = await getDocs(bookmarksQuery);
  return snapshot.docs.map((bookmarkDoc) =>
    toBookmark(bookmarkDoc.id, bookmarkDoc.data()),
  );
}

export async function isUrlSaved(
  userId: string,
  url: string,
): Promise<boolean> {
  const normalizedUrl = normalizeBookmarkUrl(url);
  const bookmark = await getBookmarkByNormalizedUrl(userId, normalizedUrl);
  return bookmark !== null && bookmark.archivedAt === null;
}

export async function createBookmark(
  userId: string,
  data: CreateBookmarkInput,
): Promise<Bookmark> {
  const normalizedUrl = normalizeBookmarkUrl(data.url);
  const existing = await getBookmarkByNormalizedUrl(userId, normalizedUrl);
  if (existing) {
    return existing;
  }

  const bookmarksRef = collection(firebaseDb, BOOKMARKS_COLLECTION);
  const bookmarkToCreate = {
    userId,
    url: data.url,
    normalizedUrl,
    title: data.title,
    favicon: data.favicon ?? null,
    description: data.description ?? null,
    createdAt: Timestamp.now(),
    archivedAt: null,
  };
  const createdBookmark = await addDoc(bookmarksRef, bookmarkToCreate);
  return {
    id: createdBookmark.id,
    ...bookmarkToCreate,
    favicon: data.favicon,
    description: data.description,
  };
}

export async function toggleBookmark(
  userId: string,
  url: string,
  data: Omit<CreateBookmarkInput, "url">,
): Promise<{ action: "saved" | "unsaved"; bookmark: Bookmark | null }> {
  const normalizedUrl = normalizeBookmarkUrl(url);
  const existing = await getBookmarkByNormalizedUrl(userId, normalizedUrl);

  if (!existing) {
    const bookmark = await createBookmark(userId, { ...data, url });
    return { action: "saved", bookmark };
  }

  await deleteDoc(doc(firebaseDb, BOOKMARKS_COLLECTION, existing.id));
  return { action: "unsaved", bookmark: null };
}

export async function archiveBookmark(bookmarkId: string): Promise<void> {
  const bookmarkRef = doc(firebaseDb, BOOKMARKS_COLLECTION, bookmarkId);
  await updateDoc(bookmarkRef, {
    archivedAt: Timestamp.now(),
  });
}

export async function unarchiveBookmark(bookmarkId: string): Promise<void> {
  const bookmarkRef = doc(firebaseDb, BOOKMARKS_COLLECTION, bookmarkId);
  await updateDoc(bookmarkRef, {
    archivedAt: null,
  });
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  await deleteDoc(doc(firebaseDb, BOOKMARKS_COLLECTION, bookmarkId));
}

export async function getBookmarkById(
  bookmarkId: string,
): Promise<Bookmark | null> {
  const bookmarkRef = doc(firebaseDb, BOOKMARKS_COLLECTION, bookmarkId);
  const snapshot = await getDoc(bookmarkRef);
  if (!snapshot.exists()) {
    return null;
  }
  return toBookmark(snapshot.id, snapshot.data());
}

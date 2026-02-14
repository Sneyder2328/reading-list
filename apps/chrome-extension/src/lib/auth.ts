import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  type UserCredential,
} from "firebase/auth";

import { firebaseAuth } from "./firebase";

const STORAGE_USER_KEY = "authUser";
const STORAGE_TOKEN_KEY = "authAccessToken";

export interface StoredUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

function toStoredUser(userCredential: UserCredential): StoredUser {
  return {
    uid: userCredential.user.uid,
    displayName: userCredential.user.displayName,
    email: userCredential.user.email,
    photoURL: userCredential.user.photoURL,
  };
}

export async function signInWithGoogle(): Promise<StoredUser> {
  const token = await chrome.identity.getAuthToken({ interactive: true });

  if (!token.token) {
    throw new Error("Failed to get Google auth token");
  }

  const credential = GoogleAuthProvider.credential(null, token.token);
  const userCredential = await signInWithCredential(firebaseAuth, credential);
  const user = toStoredUser(userCredential);

  await chrome.storage.local.set({
    [STORAGE_TOKEN_KEY]: token.token,
    [STORAGE_USER_KEY]: user,
  });

  return user;
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const result = await chrome.storage.local.get(STORAGE_USER_KEY);
  return (result[STORAGE_USER_KEY] as StoredUser | undefined) ?? null;
}

export async function signOut(): Promise<void> {
  const tokenResult = await chrome.storage.local.get(STORAGE_TOKEN_KEY);
  const accessToken = tokenResult[STORAGE_TOKEN_KEY] as string | undefined;

  if (accessToken) {
    await chrome.identity.removeCachedAuthToken({ token: accessToken });
  }

  await firebaseSignOut(firebaseAuth);
  await chrome.storage.local.remove([STORAGE_TOKEN_KEY, STORAGE_USER_KEY]);
}

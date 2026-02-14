import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";

import { firebaseAuth } from "./firebase";

const STORAGE_USER_KEY = "authUser";

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
  throw new Error(
    "Google sign-in is not supported in the extension without additional OAuth setup. Use email/password sign-in instead.",
  );
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<StoredUser> {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  const user = toStoredUser(userCredential);

  await chrome.storage.local.set({
    [STORAGE_USER_KEY]: user,
  });

  return user;
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const result = await chrome.storage.local.get(STORAGE_USER_KEY);
  return (result[STORAGE_USER_KEY] as StoredUser | undefined) ?? null;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(firebaseAuth);
  await chrome.storage.local.remove([STORAGE_USER_KEY]);
}

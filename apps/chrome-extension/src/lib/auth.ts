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
  const accessToken = await new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (tokenResult) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }
      const token =
        typeof tokenResult === "string"
          ? tokenResult
          : (tokenResult as { token?: string } | null | undefined)?.token;

      if (!token) {
        reject(new Error("Failed to get Google auth token"));
        return;
      }
      resolve(token);
    });
  });

  const credential = GoogleAuthProvider.credential(null, accessToken);
  const userCredential = await signInWithCredential(firebaseAuth, credential);
  const user = toStoredUser(userCredential);

  await chrome.storage.local.set({
  [STORAGE_TOKEN_KEY]: accessToken,
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

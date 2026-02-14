import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "./app";
import type { AuthUser } from "./types";

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(firebaseAuth, provider);

  return toAuthUser(credential.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(firebaseAuth);
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  return toAuthUser(credential.user);
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  return toAuthUser(credential.user);
}

export function getCurrentUser(): AuthUser | null {
  const user = firebaseAuth.currentUser;
  return user ? toAuthUser(user) : null;
}

export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void,
): () => void {
  return firebaseOnAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}

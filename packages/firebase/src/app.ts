import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getFirebaseConfig } from "./config";

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

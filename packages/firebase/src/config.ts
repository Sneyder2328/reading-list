import type { FirebaseOptions } from "firebase/app";

function getEnvValue(key: string): string {
  const viteEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env[key] as string | undefined)
      : undefined;
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const processEnv = globalWithProcess.process?.env?.[key];
  const value = viteEnv ?? processEnv;

  if (!value) {
    throw new Error(`Missing required Firebase env variable: ${key}`);
  }

  return value;
}

export function getFirebaseConfig(): FirebaseOptions {
  return {
    apiKey: getEnvValue("VITE_FIREBASE_API_KEY"),
    authDomain: getEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnvValue("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnvValue("VITE_FIREBASE_APP_ID"),
  };
}

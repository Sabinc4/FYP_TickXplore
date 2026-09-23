import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth: ReturnType<typeof getAuth> | null = null;

function getFirebaseAuth(): ReturnType<typeof getAuth> {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error(
      "Google sign-in is not configured yet (missing VITE_FIREBASE_* values in .env)."
    );
  }
  if (!auth) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return auth;
}

export async function signInWithGoogle(): Promise<string> {
  const authInstance = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authInstance, provider);
  return result.user.getIdToken();
}

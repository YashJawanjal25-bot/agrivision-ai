import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Read Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verify if required environment variables are set and not placeholders
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_firebase_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id"
);

// Initialize Firebase only if not already initialized
let app;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "[AgriVision AI] Firebase credentials are not yet configured in frontend/.env. " +
    "Demo Mode is enabled for immediate testing. Add your Firebase project keys to enable live cloud authentication."
  );
}

export { app, auth };
export default firebaseConfig;

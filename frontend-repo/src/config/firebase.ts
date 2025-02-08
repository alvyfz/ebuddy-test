import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import nextConfig from "../../next.config";

const firebaseConfig = {
  apiKey: nextConfig.env?.FIREBASE_API_KEY,
  authDomain: nextConfig.env?.FIREBASE_AUTH_DOMAIN,
  projectId: nextConfig.env?.FIREBASE_PROJECT_ID,
  storageBucket: nextConfig.env?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: nextConfig.env?.FIREBASE_MESSAGING_SENDER_ID,
  appId: nextConfig.env?.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;

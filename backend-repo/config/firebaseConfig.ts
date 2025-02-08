
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json"; // File JSON dari Firebase Console

// Inisialisasi Firebase Admin SDK
initializeApp({
    credential: cert(serviceAccount),
});

// Inisialisasi Firestore
const db = getFirestore();

export { db };
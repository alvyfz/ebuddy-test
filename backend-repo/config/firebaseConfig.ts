import * as admin from 'firebase-admin'
const serviceAccount = require('./config.firebase-admin')

// Inisialisasi Firebase Admin SDK

const app = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  'admin'
)

// Inisialisasi Firestore
const db = app.firestore()

export { db, app }

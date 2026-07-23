const admin = require('firebase-admin');
require('dotenv').config();

let db = null;
let bucket = null;
let isDemo = true;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Handle escaped newlines in local configuration
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : null;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      }),
      storageBucket: storageBucket || `${projectId}.appspot.com`
    });

    db = admin.firestore();
    bucket = admin.storage().bucket();
    isDemo = false;
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization error. Reverting to Demo Mode:', error.message);
  }
} else {
  console.log('Using BAMP AI Backend in Demo Mode (Local JSON / In-Memory State).');
}

module.exports = {
  admin,
  db,
  bucket,
  isDemo
};

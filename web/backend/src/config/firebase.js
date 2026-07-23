const admin = require('firebase-admin');
require('dotenv').config();

let db = null;
let bucket = null;
let isDemo = true;

const projectId = process.env.FIREBASE_PROJECT_ID || 'bamp-1de96';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : null;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'bamp-1de96.appspot.com';

if (projectId && clientEmail && privateKey) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        }),
        storageBucket
      });
    }

    db = admin.firestore();
    bucket = admin.storage().bucket();
    isDemo = false;
    console.log(`[FIREBASE ADMIN] Initialized Admin SDK for project: ${projectId}`);
  } catch (error) {
    console.warn(`[FIREBASE ADMIN] Service Account initialization notice: ${error.message}`);
  }
} else {
  console.log(`[FIREBASE ADMIN] Running in hybrid mode for project: ${projectId}`);
}

module.exports = {
  admin,
  db,
  bucket,
  isDemo
};

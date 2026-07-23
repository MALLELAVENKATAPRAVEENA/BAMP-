const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let db = null;
let bucket = null;
let isDemo = false;

const projectId = process.env.FIREBASE_PROJECT_ID || 'bamp-1de96';
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'bamp-1de96.appspot.com';
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  if (!admin.apps.length) {
    let credential;
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require('./serviceAccountKey.json');
      credential = admin.credential.cert(serviceAccount);
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
    } else {
      credential = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential,
      storageBucket
    });
  }

  db = admin.firestore();
  bucket = admin.storage().bucket();
  isDemo = false;
  console.log(`[FIREBASE ADMIN SDK] Connected to Live Database & Storage for project: ${projectId}`);
} catch (error) {
  console.warn(`[FIREBASE ADMIN SDK] Initialization fallback: ${error.message}`);
  isDemo = true;
}

module.exports = {
  admin,
  db,
  bucket,
  isDemo
};

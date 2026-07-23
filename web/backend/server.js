const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Print Firebase connection status info
const firebaseConfigured = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

console.log('==================================================');
console.log('BAMP AI Treatment Predictor Backend Server Init');
if (firebaseConfigured) {
  console.log('Firebase Mode: CONNECTED (Using Cloud Firestore & Storage)');
} else {
  console.log('Firebase Mode: DEMO / LOCAL (No credentials found, using JSON/Memory database)');
}
console.log('==================================================');

// Start listening
app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});

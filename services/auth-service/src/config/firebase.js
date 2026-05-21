require('dotenv').config();
const admin = require('firebase-admin');

function parsePrivateKey(rawKey) {
  if (!rawKey) throw new Error('FIREBASE_PRIVATE_KEY is not set in .env');
  let key = rawKey;
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, '\n');
  return key;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  });
  console.log('✅ Firebase initialized');
}

const db   = admin.firestore();
const auth = admin.auth();
module.exports = { admin, db, auth };
import admin from 'firebase-admin';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Path to your Firebase service account JSON
const serviceAccountPath = "C:\\Users\\ibaxq\\Downloads\\skincare-haven-firebase-adminsdk-fbsvc-09403ab3a7.json";

// Initialize Firebase Admin (server-side)
export function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: serviceAccount.storage_bucket
    });
  }
  return admin;
}

// Initialize Firebase for client-side (browser) operations
export function initializeFirebaseClient() {
  const serviceAccount = require(serviceAccountPath);
  
  const firebaseConfig = {
    apiKey: serviceAccount.apiKey,
    authDomain: `${serviceAccount.project_id}.firebaseapp.com`,
    projectId: serviceAccount.project_id,
    storageBucket: serviceAccount.storage_bucket,
    messagingSenderId: serviceAccount.messaging_sender_id,
    appId: serviceAccount.app_id
  };

  const app = initializeApp(firebaseConfig);
  return getStorage(app);
}
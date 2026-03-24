import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const adminFirebaseConfig = {
  apiKey: process.env.REACT_APP_ADMIN_FIREBASE_API_KEY || 'AIzaSyAV99ochiSY3QAnFytmoY78dV-fGLa-gEU',
  authDomain: process.env.REACT_APP_ADMIN_FIREBASE_AUTH_DOMAIN || 'adultopia-creator-vote-final.firebaseapp.com',
  projectId: process.env.REACT_APP_ADMIN_FIREBASE_PROJECT_ID || 'adultopia-creator-vote-final',
  messagingSenderId: process.env.REACT_APP_ADMIN_FIREBASE_MESSAGING_SENDER_ID || '1050166091624',
  appId: process.env.REACT_APP_ADMIN_FIREBASE_APP_ID || '1:1050166091624:web:30beb22e751e5d8e39c0dd',
};

const ADMIN_APP_NAME = 'admin';

let adminApp: FirebaseApp;
const existing = getApps().find(a => a.name === ADMIN_APP_NAME);
if (existing) {
  adminApp = existing;
} else {
  adminApp = initializeApp(adminFirebaseConfig, ADMIN_APP_NAME);
}

export const adminDb: Firestore = getFirestore(adminApp);

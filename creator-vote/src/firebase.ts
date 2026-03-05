import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? 'adultopia-creator-vote',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? '',
};

/** Firebase が正しく設定されているか（API キーが入っているか） */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };
export const googleProvider = new GoogleAuthProvider();

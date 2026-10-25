/**
 * Saarathi Firebase Integration Service
 * Manages Firebase App, Auth state, and Firestore user session synchronization
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForSaarathiPlatform2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saarathi-companion.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saarathi-companion",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saarathi-companion.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109283746501",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109283746501:web:abcdef123456"
};

let app = null;
let auth = null;
let db = null;
let isInitialized = false;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  isInitialized = true;
  console.log('[Firebase] Client SDK initialized for project:', firebaseConfig.projectId);
} catch (err) {
  console.warn('[Firebase] Client initialization note:', err.message);
}

/**
 * Saves or updates student login information and profile in Firebase Firestore
 */
export async function saveLoginInfoToFirebase(user, profile) {
  if (!user || !user.email) return;

  const loginPayload = {
    userId: user.id || user.email,
    email: user.email,
    fullName: user.full_name || profile?.full_name || 'Student',
    role: user.role || 'student',
    educationLevel: profile?.education_level || 'UG',
    targetRole: profile?.target_role || 'Software Development Intern',
    lastLoginAt: new Date().toISOString(),
    clientPlatform: 'Saarathi Web App 2026',
    domicileState: profile?.state || 'Telangana',
    marksPercentage: profile?.percentage || profile?.cgpa || 85.0
  };

  // 1. Persist to local offline Firebase storage cache
  try {
    const history = JSON.parse(localStorage.getItem('saarathi_firebase_logins') || '[]');
    history.unshift(loginPayload);
    localStorage.setItem('saarathi_firebase_logins', JSON.stringify(history.slice(0, 20)));
    localStorage.setItem('saarathi_firebase_current_user', JSON.stringify(loginPayload));
  } catch (e) {
    // ignore local storage errors
  }

  // 2. Persist to Firestore if cloud connection is active
  if (isInitialized && db) {
    try {
      const userDocRef = doc(db, 'users', user.id || user.email.replace(/[^a-zA-Z0-9]/g, '_'));
      await setDoc(userDocRef, {
        ...loginPayload,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`[Firebase] Successfully synchronized login info for ${user.email} in Firestore`);
    } catch (err) {
      console.warn('[Firebase] Firestore sync notice (will retry on next session):', err.message);
    }
  }
}

export { app, auth, db, isInitialized };

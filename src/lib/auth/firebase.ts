import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork, initializeFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required config
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with settings to force long polling (HTTP) instead of WebSockets
// This helps resolve network connectivity issues with proxies/firewalls
let db: Firestore;
try {
  if (!getApps().length || !getApps()[0]) {
    // Use initializeFirestore with explicit settings for new app
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true, // Force long polling instead of WebSockets
    });
    console.log('Firestore initialized with long polling mode');
  } else {
    // App already exists, get existing Firestore instance
    db = getFirestore(app);
    console.log('Using existing Firestore instance');
    
    // Try to force long polling on existing instance
    if (typeof window !== 'undefined') {
      disableNetwork(db).then(() => {
        console.log('Firestore network disabled, re-enabling with long polling...');
        return enableNetwork(db);
      }).then(() => {
        console.log('Firestore network re-enabled');
      }).catch((error) => {
        console.warn('Failed to configure Firestore network mode:', error);
      });
    }
  }
} catch (error) {
  console.warn('Failed to initialize Firestore with long polling, using default:', error);
  db = getFirestore(app);
}

// Log initialization
console.log('Firebase initialized with project:', firebaseConfig.projectId);

// Utility function to get JWT token for the current user
export const getCurrentUserJWT = async (forceRefresh: boolean = false): Promise<string | null> => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.warn('No authenticated user found');
            return null;
        }
        
        const token = await currentUser.getIdToken(forceRefresh);
        return token;
    } catch (error) {
        console.error('Error getting JWT token:', error);
        return null;
    }
};

// Utility function to get JWT token with claims
export const getCurrentUserJWTWithClaims = async (forceRefresh: boolean = false): Promise<{ token: string; claims: any } | null> => {
    try {
        const token = await getCurrentUserJWT(forceRefresh);
        if (!token) return null;
        
        // Decode the token to get claims
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Invalid JWT token format');
            return null;
        }
        
        const payload = JSON.parse(atob(tokenParts[1]));
        return { token, claims: payload };
    } catch (error) {
        console.error('Error getting JWT token with claims:', error);
        return null;
    }
};

export {
    app,
    auth,
    db,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    type User
};

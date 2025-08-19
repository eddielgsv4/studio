
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsJPFbmy4rICLIJQtIrG8-aLvqzLT2BkQ",
  authDomain: "v4salesai.firebaseapp.com",
  projectId: "v4salesai",
  storageBucket: "v4salesai.firebasestorage.app",
  messagingSenderId: "497433679232",
  appId: "1:497433679232:web:1ee7486a0932e5fcd29d65"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};

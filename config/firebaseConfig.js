// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDsZIi-MTxDRjk9FyKX8DPAAZj9U2aJ4EA",
  authDomain: "adhd-hub.firebaseapp.com",
  projectId: "adhd-hub",
  storageBucket: "adhd-hub.firebasestorage.app",
  messagingSenderId: "996689673215",
  appId: "1:996689673215:web:df192e4ca338b43e2ec5ca",
  measurementId: "G-5JHLKXH18H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

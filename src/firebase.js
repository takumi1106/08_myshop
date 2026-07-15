// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCdmCcnBK4jKJLJEBZBgclbwLwunY0-bE",
  authDomain: "react-ecsite-4e314.firebaseapp.com",
  projectId: "react-ecsite-4e314",
  storageBucket: "react-ecsite-4e314.firebasestorage.app",
  messagingSenderId: "663181635294",
  appId: "1:663181635294:web:3f0b4a83c41dfdc80c9c4f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

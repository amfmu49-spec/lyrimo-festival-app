import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1kaqThA1IHbHB9yFrHeY5gBfXYhPgc14",
  authDomain: "lyrimofes.firebaseapp.com",
  projectId: "lyrimofes",
  storageBucket: "lyrimofes.firebasestorage.app",
  messagingSenderId: "329084639921",
  appId: "1:329084639921:web:8b50856245237ae86ea090",
  measurementId: "G-DFGLKVM4LH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcq1BQ8HR6z1hBtq_scBqA_NQ-Wr6sM_M",
  authDomain: "fined-6ce57.firebaseapp.com",
  projectId: "fined-6ce57",
  storageBucket: "fined-6ce57.firebasestorage.app",
  messagingSenderId: "390171657546",
  appId: "1:390171657546:web:3754aa74178ecd7ed82db3",
  measurementId: "G-4B0GN3QK0D"
};

const app = initializeApp(firebaseConfig);

// Firestore DB
const db = getFirestore(app);

// Auth
const auth = getAuth(app);

export { db, auth };

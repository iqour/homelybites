// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuK33SEPwThs4Crhe-a4nKxvy1C7DwY-c",
  authDomain: "homely-bites-ea0f4.firebaseapp.com",
  projectId: "homely-bites-ea0f4",
  storageBucket: "homely-bites-ea0f4.firebasestorage.app",
  messagingSenderId: "986253910172",
  appId: "1:986253910172:web:9f1cedcbc0c874f2334d59",
  measurementId: "G-LX4JMZ81QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

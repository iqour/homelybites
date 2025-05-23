// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAuK33SEPwThs4Crhe-a4nKxvy1C7DwY-c",
    authDomain: "homely-bites-ea0f4.firebaseapp.com",
    projectId: "homely-bites-ea0f4",
    storageBucket: "homely-bites-ea0f4.firebasestorage.app",
    messagingSenderId: "986253910172",
    appId: "1:986253910172:web:9f1cedcbc0c874f2334d59",
    measurementId: "G-LX4JMZ81QK"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  export default firebaseApp;

  export {db, auth, firebaseApp} ;
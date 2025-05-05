import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
const firebaseConfig2 = {
  apiKey: "AIzaSyAujSRW76zHkQywQ26A-NpMyp42WHEVO4M",
  authDomain: "myway-71fc9.firebaseapp.com",
  projectId: "myway-71fc9",
  storageBucket: "myway-71fc9.firebasestorage.app",
  messagingSenderId: "646053508010",
  appId: "1:646053508010:web:7461dae8c32732bf42b1d3",
  measurementId: "G-TQ25L9HT7P"
};
let app2: FirebaseApp;

const app = initializeApp(firebaseConfig);
if (!getApps().some(app => app.name === "AnyAppName")) {
  app2 = initializeApp(firebaseConfig2, "AnyAppName");
} else {
  app2 = getApp("AnyAppName");
}const db = getFirestore(app);
const storage = getStorage();

const auth = getAuth(app);
const auth2 = getAuth(app2); 

export {db,auth,auth2,storage}
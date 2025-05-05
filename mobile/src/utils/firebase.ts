import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFunctions} from "firebase/functions"


const firebaseConfig = {
  apiKey: "AIzaSyAujSRW76zHkQywQ26A-NpMyp42WHEVO4M",
  authDomain: "myway-71fc9.firebaseapp.com",
  projectId: "myway-71fc9",
  storageBucket: "myway-71fc9.firebasestorage.app",
  messagingSenderId: "646053508010",
  appId: "1:646053508010:web:f359124e9c5512f442b1d3",
  measurementId: "G-QW0CW4ZT97"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app); 
const storage = getStorage();
const functions = getFunctions(app)


export { auth, db,storage,functions };

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v9.0.0 and later, appId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtK_V4LnyNtyUHxXN2GjwWe66nWfrIolo",
  authDomain: "pindrop-30acc.firebaseapp.com",
  databaseURL: "https://pindrop-30acc-default-rtdb.firebaseio.com",
  projectId: "pindrop-30acc",
  storageBucket: "pindrop-30acc.appspot.com",
  messagingSenderId: "795172413748",
  appId: "1:795172413748:web:2286c694ab059f91a7c561",
  measurementId: "G-48W9SKM27H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app); // Add this line to include the database module

export { app, analytics, firestore, storage, database };
 start
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJO7Ke5G-3PE62chMudJfnfNfuiYg5OA8",
  authDomain: "recon-autobots.firebaseapp.com",
  projectId: "recon-autobots",
  storageBucket: "recon-autobots.firebasestorage.app",
  messagingSenderId: "596311089019",
  appId: "1:596311089019:web:76d75712d0c2b99a76e7de",
  measurementId: "G-NLJHQ2KS13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Export the app instance
export default app;

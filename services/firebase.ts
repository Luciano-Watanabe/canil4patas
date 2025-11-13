// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVJiSpiYaPt4mPT1gMbaoo5OCLtxsF_mU",
  authDomain: "canil---meus-filhos-de-4-patas.firebaseapp.com",
  projectId: "canil---meus-filhos-de-4-patas",
  storageBucket: "canil---meus-filhos-de-4-patas.firebasestorage.app",
  messagingSenderId: "563066958400",
  appId: "1:563066958400:web:f5081df67ff63815a1a5a5",
  measurementId: "G-GL4QDPX5PL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

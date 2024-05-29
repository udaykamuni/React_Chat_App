// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  //apiKey: "AIzaSyBPAeDSRNyijwyiYFx1DmqGZkp4CzBcqcA",
  authDomain: "reactchatapp-7a210.firebaseapp.com",
  projectId: "reactchatapp-7a210",
  storageBucket: "reactchatapp-7a210.appspot.com",
  messagingSenderId: "476472176757",
  appId: "1:476472176757:web:e4be38a5d5e073c953883c"
};

const app = initializeApp(firebaseConfig); 


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

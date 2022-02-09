import dotenv from "dotenv";
//import { variables } from '$lib/variables'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
//dotenv.config()
const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "pokerapp-a4302.firebaseapp.com",
  projectId: "pokerapp-a4302",
  storageBucket: "pokerapp-a4302.appspot.com",
  messagingSenderId: "704885010595",
  appId: "1:704885010595:web:b2148246443791a8cd4f16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCffpPM2gtK7CKLgB0Dq4A0BV0zbjqmpGc",
  authDomain: "pokerapp-a4302.firebaseapp.com",
  projectId: "pokerapp-a4302",
  storageBucket: "pokerapp-a4302.appspot.com",
  messagingSenderId: "704885010595",
  appId: "1:704885010595:web:b2148246443791a8cd4f16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
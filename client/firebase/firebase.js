//import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
//dotenv.config()
const firebaseConfig = {
	apiKey: 'APIKEY',
	authDomain: 'pokerapp-a4302.firebaseapp.com',
	projectId: 'pokerapp-a4302',
	storageBucket: 'pokerapp-a4302.appspot.com',
	messagingSenderId: '704885010595',
	appId: '1:704885010595:web:22997e4a68935174cd4f16'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

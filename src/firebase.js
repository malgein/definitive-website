
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyDfCxUdiW3KlET0cOEqnbq0mON-bGgWrq8",
  authDomain: "react-portafolio-dashboard.firebaseapp.com",
  projectId: "react-portafolio-dashboard",
  storageBucket: "react-portafolio-dashboard.appspot.com",
  messagingSenderId: "495995656595",
  appId: "1:495995656595:web:e5bb58298750c4b00ff066"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


export const signInWithGoogle = () => signInWithPopup(auth, provider);
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBG8LYIpRAUhvCcARHw_om4kvwHaVIngCI",
  authDomain: "rewear-9c9f9.firebaseapp.com",
  projectId: "rewear-9c9f9",
  storageBucket: "rewear-9c9f9.firebasestorage.app",
  messagingSenderId: "382353289973",
  appId: "1:382353289973:web:1da3c31289b75ac0ca8bbc",
  measurementId: "G-MGZN7RT6Z4",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

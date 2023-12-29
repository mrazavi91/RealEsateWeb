// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "realestatemern-2baed.firebaseapp.com",
    projectId: "realestatemern-2baed",
    storageBucket: "realestatemern-2baed.appspot.com",
    messagingSenderId: "391914851306",
    appId: "1:391914851306:web:3c30aa07363ca9c6884093"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
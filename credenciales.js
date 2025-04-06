// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGRUGUxz3Klhb-KgaysYvGoOnAcXshJX4",
  authDomain: "tucolectivoapp.firebaseapp.com",
  projectId: "tucolectivoapp",
  storageBucket: "tucolectivoapp.firebasestorage.app",
  messagingSenderId: "516416809368",
  appId: "1:516416809368:web:aea7cc47174b9d2796e3ed"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
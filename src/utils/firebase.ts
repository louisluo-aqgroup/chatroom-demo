// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgzJETEgtqyb7Hv-4IbRBukNu6PtXWLCY",
  authDomain: "testlogin-68b80.firebaseapp.com",
  databaseURL: "https://testlogin-68b80-default-rtdb.firebaseio.com",
  projectId: "testlogin-68b80",
  storageBucket: "testlogin-68b80.firebasestorage.app",
  messagingSenderId: "853670327109",
  appId: "1:853670327109:web:4e51845b2bb6de9c7a842c",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);

export const googleProvider = new GoogleAuthProvider();

export default firebase;

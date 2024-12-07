// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_EauYsUXAdTtKqnZ4dV9lSOiMVrolSvQ",
  authDomain: "fantasy-fusion-1624e.firebaseapp.com",
  projectId: "fantasy-fusion-1624e",
  storageBucket: "fantasy-fusion-1624e.firebasestorage.app",
  messagingSenderId: "980881744894",
  appId: "1:980881744894:web:58912b9612c2b31fd056af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth};
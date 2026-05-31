// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA7NYGPJITwdwxtxaje2R0cSOTLUXgYdk",
  authDomain: "xoviqlabs.firebaseapp.com",
  projectId: "xoviqlabs",
  storageBucket: "xoviqlabs.firebasestorage.app",
  messagingSenderId: "412475645243",
  appId: "1:412475645243:web:2441f41d11ac8438b22b1e",
  measurementId: "G-M44KJCHXFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

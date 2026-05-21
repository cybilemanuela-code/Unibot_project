// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0545VMkSf0jC97YSdjG9A2_cChV3kmRQ",
  authDomain: "unibot-56f52.firebaseapp.com",
  projectId: "unibot-56f52",
  storageBucket: "unibot-56f52.firebasestorage.app",
  messagingSenderId: "425060661350",
  appId: "1:425060661350:web:b8901b1058198c13c215a7",
  measurementId: "G-R0WKFE9RZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
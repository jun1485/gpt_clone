// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR7QdPQJWH7z_L96iuLAAYKZZZYpNUN4g",
  authDomain: "gpt-clone-2d9b8.firebaseapp.com",
  projectId: "gpt-clone-2d9b8",
  storageBucket: "gpt-clone-2d9b8.appspot.com",
  messagingSenderId: "648411162988",
  appId: "1:648411162988:web:67d21be9da8e3039082b49",
  measurementId: "G-Z2M1LTNM8K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };

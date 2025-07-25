import { boot } from 'quasar/wrappers'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8xg4QO9UiFnzcj_jp1DLkXaRX_SCO858",
  authDomain: "pet-compain.firebaseapp.com",
  projectId: "pet-compain",
  storageBucket: "pet-compain.appspot.com",
  messagingSenderId: "587293082624",
  appId: "1:587293082624:web:1b823737cd5c4c1cad84e5",
  measurementId: "G-Z0TYTVDSC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
})

export {db};
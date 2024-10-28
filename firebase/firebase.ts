// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSn3yO2l6k41WUzPba61iJHBJH-eEQp-4",
  authDomain: "expressnews-fa07d.firebaseapp.com",
  projectId: "expressnews-fa07d",
  storageBucket: "expressnews-fa07d.appspot.com",
  messagingSenderId: "404469601235",
  appId: "1:404469601235:web:6d74229051dadef65ad526",
  measurementId: "G-X90JGKFJ75"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
export default app;

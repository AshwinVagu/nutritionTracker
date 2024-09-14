// Import necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object containing your project's credentials
const firebaseConfig = {
  apiKey: "AIzaSyAyanfVMVN2WDGtEdOIv41xGBQbx3FaTxc",
  authDomain: "acs560-wellness-wise.firebaseapp.com",
  projectId: "acs560-wellness-wise",
  storageBucket: "acs560-wellness-wise.appspot.com",
  messagingSenderId: "1071452464493",
  appId: "1:1071452464493:web:df5c8f4d5a0f8b07666664",
  measurementId: "G-DZ7QLKHHQL",
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Obtain the authentication service instance from Firebase
export const auth = getAuth(app);

// Obtain the Firestore database instance from Firebase
export const db = getFirestore(app);

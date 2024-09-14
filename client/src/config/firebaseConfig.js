// Import necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object containing your project's credentials
const firebaseConfig = {
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Obtain the authentication service instance from Firebase
export const auth = getAuth(app);

// Obtain the Firestore database instance from Firebase
export const db = getFirestore(app);

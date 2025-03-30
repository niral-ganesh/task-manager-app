// START import necessary dependencies
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// END import necessary dependencies

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1FIpO31SjzMtP_B08p2K4OZy3Y2nh8FY",
  authDomain: "tutorapp-8fe34.firebaseapp.com",
  projectId: "tutorapp-8fe34",
  storageBucket: "tutorapp-8fe34.appspot.com",
  messagingSenderId: "155599790605",
  appId: "1:155599790605:web:4e06aea7289072d5f82b44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Ensure Authentication Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Export Modules
export { auth, db, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc };
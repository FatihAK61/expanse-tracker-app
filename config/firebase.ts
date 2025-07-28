import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyk3ctz3-Of7zmXpMWeX6DR5k2saH4-eU",
  authDomain: "my-avasome-project.firebaseapp.com",
  databaseURL:
    "https://my-avasome-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-avasome-project",
  storageBucket: "my-avasome-project.firebasestorage.app",
  messagingSenderId: "876837512297",
  appId: "1:876837512297:web:09d7eb6a3df668d7032ef8",
  measurementId: "G-WHGFDX8L1V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//authenticate
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//db
export const firestore = getFirestore(app);

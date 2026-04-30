import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBineyc6N4lQ_M3AdmHJt1G5vxv1TBVNOo",
  authDomain: "withsoori-81bc4.firebaseapp.com",
  projectId: "withsoori-81bc4",
  storageBucket: "withsoori-81bc4.firebasestorage.app",
  messagingSenderId: "528491610698",
  appId: "1:528491610698:web:468edf9dfbc947d633dcb3",
  measurementId: "G-SHH3E96NXR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Admin emails whitelist - only these emails can access admin
const ADMIN_EMAILS = [
  "tmayuranga1928@gmail.com",
  // Add more admin emails here if needed
];

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if email is in admin whitelist
    if (!ADMIN_EMAILS.includes(user.email)) {
      await signOut(auth);
      return { success: false, error: "Unauthorized email. Admin access denied." };
    }

    const token = await user.getIdToken();
    return { success: true, user, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logOut() {
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function getAuthToken() {
  return auth.currentUser?.getIdToken();
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth, ADMIN_EMAILS };
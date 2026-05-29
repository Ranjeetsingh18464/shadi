import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDQFxiRzf9YMQY9LK_DvSh-gAm5NPxsygg",
  authDomain: "shadi1-b55bc.firebaseapp.com",
  projectId: "shadi1-b55bc",
  storageBucket: "shadi1-b55bc.firebasestorage.app",
  messagingSenderId: "589288837030",
  appId: "1:589288837030:web:3d6189530eb9aca9004967",
  measurementId: "G-2523SP02G8",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()
const phoneProvider = new PhoneAuthProvider(auth)

export { app, auth, db, storage, googleProvider, phoneProvider, RecaptchaVerifier }

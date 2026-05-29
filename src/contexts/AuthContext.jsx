import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../utils/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('user')
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setUserProfile(docSnap.data())
            setRole(docSnap.data().role || 'user')
          } else {
            await setDoc(docRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              role: 'user',
              accountType: 'free',
              profileComplete: false,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              isActive: true,
              isVerified: false,
              isOnline: true,
              privacy: {
                showPhoto: true,
                showContact: false,
                showOnlineStatus: true,
                privateMode: false,
                invisibleBrowsing: false,
                hideFromSearch: false,
                messagePermission: 'everyone',
              },
            })
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'user',
              accountType: 'free',
              profileComplete: false,
            })
            setRole('user')
          }
        } catch (err) {
          /* permission errors expected */
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setRole('user')
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = useCallback(async (email, password, userData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (result.user) {
      try { await updateProfile(result.user, { displayName: userData.fullName }) } catch (e) {}
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          ...userData,
          uid: result.user.uid,
          email,
          role: 'user',
          accountType: 'free',
          profileComplete: false,
          isActive: true,
          isVerified: false,
          isOnline: true,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          privacy: {
            showPhoto: true,
            showContact: false,
            showOnlineStatus: true,
            privateMode: false,
            invisibleBrowsing: false,
            hideFromSearch: false,
            messagePermission: 'everyone',
          },
          notificationPreferences: {
            email: true, push: true, sms: false,
            interestReceived: true, messageReceived: true,
            matchFound: true, subscriptionExpiry: true, adminAnnouncements: false,
          },
        })
      } catch (e) { /* Firestore may not be initialized yet */ }
      try { await sendEmailVerification(result.user) } catch (e) {}
    }
    return result.user
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    try {
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp(),
        isOnline: true,
      })
    } catch (e) { /* Firestore may not be initialized */ }
    return result.user
  }, [])

  const googleLogin = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider)
    try {
      const userRef = doc(db, 'users', result.user.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          accountType: 'free',
          profileComplete: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isActive: true,
          isVerified: true,
          isOnline: true,
          privacy: {
            showPhoto: true, showContact: false, showOnlineStatus: true,
            privateMode: false, invisibleBrowsing: false, hideFromSearch: false,
            messagePermission: 'everyone',
          },
        })
      } else {
        await updateDoc(userRef, { lastLogin: serverTimestamp(), isOnline: true })
      }
    } catch (e) { /* Firestore may not be initialized */ }
    return result.user
  }, [])

  const sendOTP = useCallback(async (phoneNumber, recaptchaContainerId) => {
    const recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
    })
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
    return confirmationResult
  }, [])

  const verifyOTP = useCallback(async (confirmationResult, otp) => {
    const result = await confirmationResult.confirm(otp)
    const userRef = doc(db, 'users', result.user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
        role: 'user',
        accountType: 'free',
        profileComplete: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        isVerified: true,
        isOnline: true,
      })
    }
    return result.user
  }, [])

  const logout = useCallback(async () => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: false })
    }
    await signOut(auth)
    setUser(null)
    setUserProfile(null)
    setRole('user')
    navigate('/')
  }, [user, navigate])

  const resetPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  const updateUserProfile = useCallback(async (data) => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    try {
      await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() })
    } catch (e) {
      // If update fails (doc may not exist yet), use setDoc with merge
      await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
    }
    setUserProfile(prev => ({ ...prev, ...data }))
  }, [user])

  const value = {
    user,
    userProfile,
    loading,
    role,
    signup,
    login,
    googleLogin,
    logout,
    resetPassword,
    sendOTP,
    verifyOTP,
    updateUserProfile,
    setUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

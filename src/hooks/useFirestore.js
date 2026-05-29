import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc,
  deleteDoc, doc, onSnapshot, serverTimestamp, increment, arrayUnion, arrayRemove,
} from 'firebase/firestore'
import { db } from '../utils/firebase'

export function useCollection(collectionName, constraints = [], dependencies = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, collectionName), ...constraints)
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setData(results)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [...dependencies])

  return { data, loading, error }
}

export function useDocument(docPath) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docPath) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const docRef = doc(db, docPath)
    const unsubscribe = onSnapshot(docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() })
        } else {
          setData(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [docPath])

  return { data, loading, error }
}

export function useFirestore() {
  const addDocument = useCallback(async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef
  }, [])

  const updateDocument = useCallback(async (collectionName, docId, data) => {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }, [])

  const deleteDocument = useCallback(async (collectionName, docId) => {
    await deleteDoc(doc(db, collectionName, docId))
  }, [])

  const getDocument = useCallback(async (collectionName, docId) => {
    try {
      const docSnap = await getDoc(doc(db, collectionName, docId))
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
    } catch (e) { console.error(e); return null }
  }, [])

  const queryCollection = useCallback(async (collectionName, constraints = []) => {
    try {
      const q = query(collection(db, collectionName), ...constraints)
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) { console.error(e); return [] }
  }, [])

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    queryCollection,
  }
}

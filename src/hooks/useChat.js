import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, limit } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../contexts/AuthContext'

export function useChat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setConversations([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setConversations(convs)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const createConversation = useCallback(async (otherUserId) => {
    if (!user) return null

    try {
      const existingQuery = query(
        collection(db, 'conversations'),
        where('participants', '==', [user.uid, otherUserId]),
        limit(1)
      )
      const existingSnap = await getDocs(existingQuery)

      if (!existingSnap.empty) {
        return existingSnap.docs[0].id
      }

      const altQuery = query(
        collection(db, 'conversations'),
        where('participants', '==', [otherUserId, user.uid]),
        limit(1)
      )
      const altSnap = await getDocs(altQuery)

      if (!altSnap.empty) {
        return altSnap.docs[0].id
      }
    } catch (e) { console.error(e); return null }

    const docRef = await addDoc(collection(db, 'conversations'), {
      participants: [user.uid, otherUserId],
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
      lastMessage: '',
      lastSender: user.uid,
      unreadCount: { [user.uid]: 0, [otherUserId]: 0 },
    })

    return docRef.id
  }, [user])

  const sendMessage = useCallback(async (conversationId, text, type = 'text', attachment = null) => {
    if (!user || !text.trim()) return

    await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId: user.uid,
      text: text.trim(),
      type,
      attachment,
      read: false,
      createdAt: serverTimestamp(),
    })

    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: text.trim().slice(0, 100),
      lastMessageAt: serverTimestamp(),
      lastSender: user.uid,
    })
  }, [user])

  return {
    conversations,
    loading,
    error,
    createConversation,
    sendMessage,
  }
}

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMessages(msgs)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [conversationId])

  return { messages, loading, error }
}

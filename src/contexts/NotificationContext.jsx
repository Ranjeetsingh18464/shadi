import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const NotificationContext = createContext(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0
          const tb = b.createdAt?.toMillis?.() || 0
          return tb - ta
        })
        .slice(0, 50)
      setNotifications(notifs)
      setUnreadCount(notifs.filter(n => !n.read).length)
      notifs.slice(0, 3).forEach(n => {
        if (!n.read && !n.notified) {
          toast(n.title, { icon: n.icon || '🔔' })
        }
      })
    }, () => {})

    return unsubscribe
  }, [user])

  const addNotification = useCallback(async (data) => {
    if (!user) return
    await addDoc(collection(db, 'notifications'), {
      ...data,
      userId: user.uid,
      read: false,
      notified: false,
      createdAt: serverTimestamp(),
    })
  }, [user])

  const markAsRead = useCallback(async (notificationId) => {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true })
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter(n => !n.read)
    await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })))
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [notifications])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

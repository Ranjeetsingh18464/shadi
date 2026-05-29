import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useMessages } from '../../hooks/useChat'
import { FiSend, FiArrowLeft, FiPaperclip, FiSmile, FiCheck, FiCheckCircle, FiUser, FiMoreVertical } from 'react-icons/fi'
import { formatTimestamp, getInitials } from '../../utils/helpers'

export default function ChatRoom() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const { messages, loading } = useMessages(roomId)
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const convSnap = await getDoc(doc(db, 'conversations', roomId))
        if (convSnap.exists()) {
          const data = convSnap.data()
          const otherId = data.participants.find(p => p !== user?.uid)
          if (otherId) {
            const userSnap = await getDoc(doc(db, 'users', otherId))
            if (userSnap.exists()) setOtherUser({ uid: otherId, ...userSnap.data() })
          }
        }
      } catch (err) { console.error(err) }
    }
    if (roomId) fetchConversation()
  }, [roomId, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      const { addDoc, collection, serverTimestamp, updateDoc } = await import('firebase/firestore')
      await addDoc(collection(db, 'messages'), {
        conversationId: roomId,
        senderId: user.uid,
        text: newMessage.trim(),
        type: 'text',
        read: false,
        createdAt: serverTimestamp(),
      })
      await updateDoc(doc(db, 'conversations', roomId), {
        lastMessage: newMessage.trim().slice(0, 100),
        lastMessageAt: serverTimestamp(),
        lastSender: user.uid,
      })
      setNewMessage('')
    } catch (err) { console.error(err) }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="min-h-screen pt-16 pb-16 md:pb-0 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <Link to="/chat" className="p-1 -ml-1 text-gray-500 hover:text-gray-700"><FiArrowLeft size={20} /></Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {getInitials(otherUser?.displayName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{otherUser?.displayName || 'User'}</h3>
          <p className="text-xs text-green-500">{otherUser?.isOnline ? 'Online' : 'Offline'}</p>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700"><FiMoreVertical size={18} /></button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
        {loading ? (
          <div className="text-center py-10"><div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <FiUser className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === user?.uid
            const showDate = i === 0 || !messages[i-1]?.createdAt || 
              (msg.createdAt?.toDate?.()?.toDateString() !== messages[i-1]?.createdAt?.toDate?.()?.toDateString())
            return (
              <div key={msg.id}>
                {showDate && msg.createdAt && (
                  <p className="text-center text-[10px] text-gray-400 my-3">{formatTimestamp(msg.createdAt)}</p>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isMine ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'} rounded-2xl px-4 py-2.5 shadow-sm`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMine ? 'text-white/70' : 'text-gray-400'}`}>
                      <span className="text-[10px]">{msg.createdAt ? formatTimestamp(msg.createdAt).split(',')[0] : ''}</span>
                      {isMine && (msg.read ? <FiCheckCircle size={12} /> : <FiCheck size={12} />)}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600"><FiPaperclip size={20} /></button>
          <div className="flex-1 relative">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              placeholder="Type a message..." />
          </div>
          <button onClick={sendMessage} disabled={!newMessage.trim()}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white disabled:opacity-50">
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

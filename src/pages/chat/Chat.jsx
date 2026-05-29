import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, onSnapshot, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../hooks/useChat'
import { FiMessageSquare, FiSearch, FiUser, FiCheck, FiCheckCircle } from 'react-icons/fi'
import { formatTimestamp, getInitials } from '../../utils/helpers'

export default function Chat() {
  const { user } = useAuth()
  const { conversations, loading } = useChat()
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [userProfiles, setUserProfiles] = useState({})

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = {}
      for (const conv of conversations) {
        for (const pid of conv.participants) {
          if (pid !== user?.uid && !profiles[pid]) {
            const snap = await getDoc(doc(db, 'users', pid))
            if (snap.exists()) profiles[pid] = snap.data()
          }
        }
      }
      setUserProfiles(profiles)
    }
    if (conversations.length > 0) fetchProfiles()
  }, [conversations, user])

  const getOtherUser = (participants) => {
    const otherId = participants.find(p => p !== user?.uid)
    const profile = userProfiles[otherId]
    return {
      uid: otherId,
      displayName: profile?.displayName || 'Unknown',
      photoURL: profile?.photoURL || '',
      isOnline: profile?.isOnline || false,
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Messages</h1>
        </div>

        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" placeholder="Search conversations..." />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full skeleton"></div>
                <div className="flex-1 space-y-2"><div className="h-4 skeleton w-1/3"></div><div className="h-3 skeleton w-2/3"></div></div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-500">No messages yet</h3>
            <p className="text-sm text-gray-400 mt-1">Start connecting with your matches!</p>
            <Link to="/matches" className="btn-primary mt-4 inline-block text-sm">Browse Matches</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const other = getOtherUser(conv.participants)
              return (
                <Link key={conv.id} to={`/chat/${conv.id}`}>
                  <motion.div className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {other.photoURL ? <img src={other.photoURL} className="w-full h-full rounded-full object-cover" /> : getInitials(other.displayName)}
                      </div>
                      {other.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{other.displayName}</h3>
                        <span className="text-[10px] text-gray-400">{formatTimestamp(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.lastSender === user?.uid && <FiCheck className="inline mr-0.5" size={12} />}
                        {conv.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

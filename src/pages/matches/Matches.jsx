import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { FiHeart, FiUsers, FiStar, FiClock } from 'react-icons/fi'
import ProfileCard from '../../components/common/ProfileCard'

export default function Matches() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const q = query(collection(db, 'users'), where('profileComplete', '==', true))
        const snapshot = await getDocs(q)
        setProfiles(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })).filter(p => !['admin','superadmin','super-admin','moderator'].includes(p.role)).sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0
          const tb = b.createdAt?.toMillis?.() || 0
          return tb - ta
        }).slice(0, 20))
      } catch (err) { /* silent */ }
      setLoading(false)
    }
    fetchProfiles()
  }, [])

  const tabs = [
    { label: 'Suggested', icon: FiStar, path: '/matches' },
    { label: 'New Matches', icon: FiUsers, path: '/matches/new' },
    { label: 'Interests', icon: FiHeart, path: '/matches/interests' },
    { label: 'Saved', icon: FiClock, path: '/matches/saved' },
  ]

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Your Matches</h1>
          <Link to="/matches/search" className="text-sm text-rose-600 hover:text-rose-700 font-medium">Search Filters</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <Link key={tab.label} to={tab.path}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all data-[active=true]:bg-white data-[active=true]:shadow-sm data-[active=true]:text-rose-600 text-gray-500"
              data-active={window.location.pathname === tab.path}
            >
              <tab.icon size={16} /> {tab.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="card p-0 overflow-hidden">
                <div className="h-48 skeleton"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton w-2/3"></div>
                  <div className="h-3 skeleton w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-500">No matches found</h3>
            <p className="text-sm text-gray-400 mt-1">Complete your profile to get better match suggestions</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {profiles.map((profile, i) => (
              <motion.div key={profile.uid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <ProfileCard profile={profile} compact />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

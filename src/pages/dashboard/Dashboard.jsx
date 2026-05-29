import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { FiUser, FiHeart, FiMessageSquare, FiEye, FiStar, FiArrowRight, FiBell, FiSettings, FiEdit2 } from 'react-icons/fi'
import ProfileCard from '../../components/common/ProfileCard'

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({ interests: 0, messages: 0, views: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'users'), where('profileComplete', '==', true))
        const snapshot = await getDocs(q)
        setMatches(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })).filter(p => !['admin','superadmin','super-admin','moderator'].includes(p.role)).sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0
          const tb = b.createdAt?.toMillis?.() || 0
          return tb - ta
        }).slice(0, 8))
      } catch (err) { /* silent */ }
    }
    fetchData()
  }, [])

  if (!userProfile?.profileComplete) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiEdit2 className="text-white" size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 font-display">
              Complete Your Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Set up your profile to start receiving matches and connecting with potential life partners.
            </p>
            <Link to="/dashboard/profile-setup" className="btn-primary inline-flex items-center gap-2">
              Get Started <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display">
            Welcome, {userProfile?.displayName || 'User'}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your matchmaking overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FiHeart, label: 'Interests', value: stats.interests, color: 'from-rose-400 to-pink-500' },
            { icon: FiMessageSquare, label: 'Messages', value: stats.messages, color: 'from-blue-400 to-indigo-500' },
            { icon: FiEye, label: 'Profile Views', value: stats.views, color: 'from-green-400 to-emerald-500' },
            { icon: FiStar, label: 'Compatibility', value: '92%', color: 'from-amber-400 to-orange-500' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 md:p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/matches" className="btn-primary text-sm">View Matches</Link>
          <Link to="/matches/search" className="btn-secondary text-sm">Search Profiles</Link>
          <Link to="/dashboard/edit-profile" className="btn-secondary text-sm">Edit Profile</Link>
          <Link to="/subscription" className="btn-outline text-sm">Upgrade Plan</Link>
        </div>

        {/* Suggested Matches */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Matches</h2>
            <Link to="/matches" className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {matches.map((profile, i) => (
              <motion.div key={profile.uid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProfileCard profile={profile} compact />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="card p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Profile Strength</h3>
            <span className="text-sm font-medium text-rose-600">75%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Add more details to increase your profile strength and get better matches</p>
        </div>
      </div>
    </div>
  )
}

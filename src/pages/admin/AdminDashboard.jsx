import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, query, where, limit, Timestamp, addDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { FiUsers, FiUserCheck, FiDollarSign, FiFlag, FiTrendingUp, FiActivity, FiShield, FiBell, FiX } from 'react-icons/fi'
import { getInitials, getTimeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0, activeUsers: 0, premiumUsers: 0,
    reports: 0, revenue: 0, newUsersToday: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [pendingReports, setPendingReports] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersSnap, premiumSnap, reportsSnap, recentSnap, reportDocs] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(query(collection(db, 'users'), where('accountType', '==', 'premium'))),
          getDocs(collection(db, 'reports')),
          getDocs(query(collection(db, 'users'), limit(5))),
          getDocs(query(collection(db, 'reports'), limit(5))),
        ])
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const newToday = usersSnap.docs.filter(d => {
          const ts = d.data().createdAt
          return ts?.toDate?.() >= today || (typeof ts === 'string' && new Date(ts) >= today)
        }).length
        setStats({
          totalUsers: usersSnap.size,
          activeUsers: usersSnap.docs.filter(d => d.data().isActive !== false).length,
          premiumUsers: premiumSnap.size,
          reports: reportsSnap.size,
          revenue: premiumSnap.size * 4999,
          newUsersToday: newToday,
        })
        setRecentUsers(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setPendingReports(reportDocs.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) { console.error('Dashboard fetch error:', err) }
    }
    fetchData()
  }, [])

  const sendNotification = async () => {
    const msg = window.prompt('Notification message to send to all users:')
    if (!msg) return
    try {
      await addDoc(collection(db, 'notifications'), {
        message: msg,
        type: 'admin',
        createdAt: new Date().toISOString(),
      })
      toast.success('Notification sent')
    } catch { toast.error('Failed to send') }
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: FiUsers, change: '+12%', color: 'from-blue-400 to-indigo-500' },
    { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: FiActivity, change: '+8%', color: 'from-green-400 to-emerald-500' },
    { label: 'Premium Users', value: stats.premiumUsers.toLocaleString(), icon: FiUserCheck, change: '+15%', color: 'from-amber-400 to-orange-500' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: FiDollarSign, change: '+20%', color: 'from-rose-400 to-pink-500' },
    { label: 'Reports', value: stats.reports.toLocaleString(), icon: FiFlag, change: stats.reports > 0 ? '+2' : '0', color: 'from-red-400 to-rose-500' },
    { label: 'New Today', value: stats.newUsersToday.toLocaleString(), icon: FiTrendingUp, change: '+5%', color: 'from-purple-400 to-violet-500' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>
        <button onClick={sendNotification} className="btn-primary text-sm flex items-center gap-2"><FiBell size={16} /> Send Notification</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={18} />
              </div>
              <span className="text-xs text-green-500 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Users & Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Users</h2>
          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">No users yet</div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(u.displayName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.displayName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{getTimeAgo(u.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h2>
          {pendingReports.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">No pending reports</div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map(r => (
                <div key={r.id} className="text-sm">
                  <p className="text-gray-900 dark:text-white font-medium">{r.reason}</p>
                  <p className="text-xs text-gray-500">Reporter: {r.reporterId?.slice(0, 8)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { FiUser, FiBell, FiLock, FiGlobe, FiMoon, FiSun, FiLogOut } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [notifPrefs, setNotifPrefs] = useState({
    email: true, push: true, sms: false,
    interestReceived: true, messageReceived: true,
    matchFound: true, subscriptionExpiry: true, adminAnnouncements: false,
  })

  const toggleNotif = (key) => setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Account */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4"><FiUser className="text-rose-500" size={20} /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2></div>
            <div className="space-y-3">
              <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Email</span><span className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span></div>
              <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium text-gray-900 dark:text-white">{user?.phoneNumber || 'Not set'}</span></div>
              <button className="btn-secondary text-sm mt-2">Change Password</button>
            </div>
          </div>

          {/* Theme */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">{isDark ? <FiMoon className="text-rose-500" size={20} /> : <FiSun className="text-rose-500" size={20} />}<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2></div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Dark Mode</span>
              <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4"><FiBell className="text-rose-500" size={20} /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h2></div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Channels</h3>
                {['email', 'push', 'sms'].map(ch => (
                  <div key={ch} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500 capitalize">{ch === 'push' ? 'Push Notifications' : ch === 'sms' ? 'SMS Alerts' : 'Email Notifications'}</span>
                    <button onClick={() => toggleNotif(ch)} className={`relative w-12 h-6 rounded-full transition-colors ${notifPrefs[ch] ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifPrefs[ch] ? 'translate-x-6' : ''}`}></span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notify me about</h3>
                {[
                  { key: 'interestReceived', label: 'Interest Received' },
                  { key: 'messageReceived', label: 'Message Received' },
                  { key: 'matchFound', label: 'Match Found' },
                  { key: 'subscriptionExpiry', label: 'Subscription Expiry' },
                  { key: 'adminAnnouncements', label: 'Admin Announcements' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <button onClick={() => toggleNotif(item.key)} className={`relative w-12 h-6 rounded-full transition-colors ${notifPrefs[item.key] ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifPrefs[item.key] ? 'translate-x-6' : ''}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button onClick={handleLogout} className="card p-4 w-full flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <FiLogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

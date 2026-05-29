import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FiEye, FiEyeOff, FiUser, FiLock, FiGlobe, FiUsers, FiMessageSquare, FiCamera, FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'

const privacyOptions = [
  {
    category: 'Profile Visibility',
    icon: FiEye,
    items: [
      { key: 'showPhoto', label: 'Show Profile Photo', description: 'Display your profile photo to others' },
      { key: 'showContact', label: 'Show Contact Details', description: 'Allow others to see your phone/email' },
      { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you are online' },
      { key: 'hideFromSearch', label: 'Hide Profile from Search', description: 'Your profile won\'t appear in search results' },
      { key: 'privateMode', label: 'Private Profile Mode', description: 'Only visible to people you accept' },
      { key: 'invisibleBrowsing', label: 'Invisible Browsing', description: 'Browse profiles without being seen' },
    ]
  },
  {
    category: 'Communication',
    icon: FiMessageSquare,
    items: [
      { key: 'messagePermission', label: 'Who Can Message You', description: 'Control who can send you messages', type: 'select', options: ['everyone', 'premium_only', 'accepted_only'] },
    ]
  },
]

export default function PrivacySettings() {
  const { userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(
    userProfile?.privacy || {
      showPhoto: true, showContact: false, showOnlineStatus: true,
      privateMode: false, invisibleBrowsing: false, hideFromSearch: false,
      messagePermission: 'everyone',
    }
  )

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateUserProfile({ privacy: settings })
      toast.success('Privacy settings updated')
    } catch (err) {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Privacy Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Control your profile visibility and privacy</p>

          <div className="space-y-4">
            {privacyOptions.map((section, idx) => (
              <div key={idx} className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className="text-rose-500" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.category}</h2>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                      {item.type === 'select' ? (
                        <select
                          value={settings[item.key] || 'everyone'}
                          onChange={(e) => setSettings(prev => ({ ...prev, [item.key]: e.target.value }))}
                          className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="premium_only">Premium Only</option>
                          <option value="accepted_only">Accepted Only</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => toggle(item.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-6' : ''}`}></span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} disabled={loading} className="btn-primary">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Settings'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

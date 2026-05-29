import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { FiBell, FiMessageSquare, FiHeart, FiUser, FiSettings, FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiSearch, FiChevronDown, FiShield } from 'react-icons/fi'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/matches/search', label: 'Matches' },
  { path: '/success-stories', label: 'Success Stories' },
]

export default function Navbar() {
  const { user, userProfile, logout, role } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const location = useLocation()
  const [settings, setSettings] = useState({
    siteName: 'lakh_khushiya.com',
    logo: null,
    siteDescription: "India's Most Trusted Matrimonial Platform",
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    getDoc(doc(db, 'admin', 'settings')).then(snap => {
      if (snap.exists()) {
        const s = snap.data()
        setSettings(s)
        document.title = s.siteName ? `${s.siteName} - India's #1 Matrimonial Platform` : "lakh_khushiya.com - India's #1 Matrimonial Platform"
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [location])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo ? (
              <img src={settings.logo} alt="" className="h-8 md:h-9 w-auto" />
            ) : (
              <span className="text-2xl md:text-3xl">💍</span>
            )}
            <span className="text-xl md:text-2xl font-bold gradient-text font-display">{settings?.siteName || 'lakh_khushiya.com'}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-rose-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-rose-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              <>
                <Link to="/chat" className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiMessageSquare size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[10px] flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        userProfile?.displayName?.[0] || user.email?.[0] || 'U'
                      )}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                      {userProfile?.displayName || 'User'}
                    </span>
                    <FiChevronDown size={16} className="text-gray-400 hidden lg:block" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{userProfile?.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {(role === 'admin' || role === 'superadmin' || role === 'super-admin') ? (
                              <span className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full capitalize">{role}</span>
                            ) : (
                              <span className="text-xs text-gray-400">Role: {role}</span>
                            )}
                            <span className="text-[10px] text-gray-400 font-mono">ID: {user?.uid?.slice(0, 8)}...</span>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <FiUser size={16} /> Dashboard
                          </Link>
                          <Link to="/matches/saved" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <FiHeart size={16} /> Saved Profiles
                          </Link>
                          <Link to="/dashboard/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <FiBell size={16} /> Notifications
                            {unreadCount > 0 && <span className="ml-auto bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                          </Link>
                          <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <FiSettings size={16} /> Settings
                          </Link>
                          {(role === 'admin' || role === 'superadmin' || role === 'super-admin') && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <FiShield size={16} /> Admin Panel
                            </Link>
                          )}
                          {role === 'moderator' && (
                            <Link to="/moderator" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <FiShield size={16} /> Moderator Panel
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                          <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                            <FiLogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/auth/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

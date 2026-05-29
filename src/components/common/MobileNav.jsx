import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiSearch, FiHeart, FiMessageSquare, FiUser } from 'react-icons/fi'
import { useNotifications } from '../../contexts/NotificationContext'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: FiHome },
  { path: '/matches/search', label: 'Search', icon: FiSearch },
  { path: '/matches', label: 'Matches', icon: FiHeart },
  { path: '/chat', label: 'Chat', icon: FiMessageSquare },
  { path: '/dashboard/profile', label: 'Profile', icon: FiUser },
]

export default function MobileNav() {
  const location = useLocation()
  const { unreadCount } = useNotifications()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-rose-600' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className="relative">
                <item.icon size={22} />
                {item.path === '/chat' && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-rose-500 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

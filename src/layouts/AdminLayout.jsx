import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiHome, FiUsers, FiFlag, FiCreditCard, FiSettings, FiLogOut, FiMenu, FiX, FiShield, FiBell, FiMessageSquare, FiPieChart } from 'react-icons/fi'

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FiPieChart },
  { path: '/admin/users', label: 'Users', icon: FiUsers },
  { path: '/admin/reports', label: 'Reports', icon: FiFlag },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: FiCreditCard },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
]

const moderatorNavItems = [
  { path: '/moderator', label: 'Dashboard', icon: FiShield },
  { path: '/moderator/reports', label: 'Reports', icon: FiFlag },
  { path: '/moderator/users', label: 'Users', icon: FiUsers },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin' || userProfile?.role === 'super-admin'
  const navItems = isAdmin ? adminNavItems : moderatorNavItems

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">💍</span>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {isAdmin ? 'Admin' : 'Moderator'}
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 w-full transition-all"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <FiMenu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {userProfile?.displayName?.[0] || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                  {userProfile?.displayName || 'Admin'}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

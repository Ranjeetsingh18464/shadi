import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import MobileNav from '../components/common/MobileNav'
import { useAuth } from '../contexts/AuthContext'

export default function MainLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className={`${user ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      {user && <MobileNav />}
    </div>
  )
}

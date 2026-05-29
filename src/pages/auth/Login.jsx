import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('email')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('CONFIGURATION_NOT_FOUND')) {
        toast.error('Firebase Authentication is not enabled. Please enable Email/Password sign-in in your Firebase Console.')
      } else if (msg.includes('user-not-found')) {
        toast.error('No account found with this email')
      } else if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        toast.error('Invalid email or password')
      } else if (msg.includes('too-many-requests')) {
        toast.error('Too many attempts. Please try again later.')
      } else {
        toast.error('Failed to login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await googleLogin()
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'email' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <FiMail className="inline mr-1.5" size={16} /> Email
        </button>
        <button
          onClick={() => setActiveTab('phone')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'phone' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <FiPhone className="inline mr-1.5" size={16} /> Phone
        </button>
      </div>

      {activeTab === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="Enter your email" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-sm text-rose-600 hover:text-rose-700">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
            <input type="tel" className="input-field" placeholder="+91 98765 43210" />
          </div>
          <button className="btn-primary w-full py-3">Send OTP</button>
        </div>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600"></div></div>
        <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500">Or continue with</span></div>
      </div>

      <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Continue with Google</span>
      </button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account? <Link to="/auth/register" className="text-rose-600 font-medium hover:text-rose-700">Register Free</Link>
      </p>
    </motion.div>
  )
}

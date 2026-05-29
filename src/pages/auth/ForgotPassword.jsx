import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Reset link sent to your email')
    } catch (err) {
      toast.error('Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {!sent ? (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="Enter your email" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Reset Link'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
          <p className="text-sm text-gray-500 mb-6">We've sent a password reset link to {email}</p>
        </div>
      )}

      <Link to="/auth/login" className="flex items-center justify-center gap-1 text-sm text-rose-600 hover:text-rose-700 mt-4">
        <FiArrowLeft size={16} /> Back to Login
      </Link>
    </motion.div>
  )
}

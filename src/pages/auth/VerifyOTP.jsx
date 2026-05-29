import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) return toast.error('Please enter complete OTP')
    setLoading(true)
    try {
      toast.success('Phone verified successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to your phone</p>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
          />
        ))}
      </div>

      <button onClick={handleVerify} disabled={loading} className="btn-primary w-full py-3 mb-4 flex items-center justify-center">
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify OTP'}
      </button>

      <p className="text-sm text-gray-500">
        Didn't receive code? <button className="text-rose-600 font-medium hover:text-rose-700">Resend OTP</button>
      </p>
    </motion.div>
  )
}

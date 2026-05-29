import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi'
import { RELIGIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const steps = [
  { title: 'Basic Info', subtitle: 'Tell us about yourself' },
  { title: 'Account', subtitle: 'Create your account' },
  { title: 'Verification', subtitle: 'Verify your email' },
]

export default function Register() {
  const { signup, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', gender: '', dateOfBirth: '', religion: '',
    email: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleGoogleRegister = async () => {
    setLoading(true)
    try {
      await googleLogin()
      toast.success('Account created!')
      navigate('/dashboard/profile-setup')
    } catch (err) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.fullName || !formData.gender || !formData.dateOfBirth || !formData.religion) {
        return toast.error('Please fill in all fields')
      }
      setStep(2)
      return
    }
    if (step === 2) {
      if (!formData.email || !formData.password) return toast.error('Please fill in all fields')
      if (formData.password.length < 8) return toast.error('Password must be at least 8 characters')
      if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match')
      setStep(3)
      return
    }
    if (step === 3) {
      setLoading(true)
      try {
        await signup(formData.email, formData.password, {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          religion: formData.religion,
          displayName: formData.fullName,
        })
        toast.success('Registration successful! Please verify your email.')
        navigate('/dashboard/profile-setup')
      } catch (err) {
        toast.error(err.message.includes('email-already-in-use') ? 'Email already registered' : 'Registration failed')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex flex-col items-center`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'gradient-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
              }`}>
                {step > i + 1 ? <FiCheck size={16} /> : i + 1}
              </div>
              <p className={`text-[10px] mt-1 font-medium ${step === i + 1 ? 'text-rose-600' : 'text-gray-400'}`}>{s.title}</p>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
              <p className="text-sm text-gray-500 -mt-2">This helps us find better matches for you</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">I'm a</label>
                <div className="grid grid-cols-2 gap-3">
                  {['male', 'female'].map(g => (
                    <button type="button" key={g} onClick={() => updateField('gender', g)}
                      className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                        formData.gender === g
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                          : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {g === 'male' ? '👨 Groom' : '👩 Bride'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="input-field pl-10" placeholder="Enter your full name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Religion</label>
                <select value={formData.religion} onChange={(e) => updateField('religion', e.target.value)} className="input-field">
                  <option value="">Select religion</option>
                  {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Details</h2>
              <p className="text-sm text-gray-500 -mt-2">Create your login credentials</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="input-field pl-10" placeholder="Enter your email" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} className="input-field pl-10 pr-10" placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <p className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiCheck className="inline mr-1" size={12} /> At least 8 characters
                    </p>
                    <p className={`text-xs ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiCheck className="inline mr-1" size={12} /> Uppercase & lowercase
                    </p>
                    <p className={`text-xs ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiCheck className="inline mr-1" size={12} /> At least 1 number
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className="input-field pl-10" placeholder="Re-enter password" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Almost Done!</h2>
              <p className="text-sm text-gray-500 -mt-2">Review your information before creating your account</p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Name</span><span className="text-sm font-medium text-gray-900 dark:text-white">{formData.fullName}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Gender</span><span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{formData.gender === 'male' ? 'Groom' : 'Bride'}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Date of Birth</span><span className="text-sm font-medium text-gray-900 dark:text-white">{formData.dateOfBirth}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Religion</span><span className="text-sm font-medium text-gray-900 dark:text-white">{formData.religion}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Email</span><span className="text-sm font-medium text-gray-900 dark:text-white">{formData.email}</span></div>
              </div>

              <p className="text-xs text-gray-400">By creating an account, you agree to our <Link to="/terms" className="text-rose-600">Terms of Service</Link> and <Link to="/privacy" className="text-rose-600">Privacy Policy</Link></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 flex items-center justify-center gap-1">
              <FiChevronLeft size={18} /> Back
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-1">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
              step < 3 ? <>Next <FiChevronRight size={18} /></> : 'Create Account'
            }
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600"></div></div>
        <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500">Or register with</span></div>
      </div>

      <button onClick={handleGoogleRegister} disabled={loading} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Continue with Google</span>
      </button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link to="/auth/login" className="text-rose-600 font-medium hover:text-rose-700">Sign In</Link>
      </p>
    </motion.div>
  )
}

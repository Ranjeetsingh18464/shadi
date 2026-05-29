import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Contact() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    getDoc(doc(db, 'admin', 'settings')).then(snap => {
      if (snap.exists()) setSettings(snap.data())
    }).catch(() => {})
  }, [])

  const isAdmin = ['admin', 'superadmin', 'super-admin'].includes(role)

  const startEdit = (key, currentValue) => {
    setEditing(key)
    setEditValue(currentValue || '')
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditValue('')
  }

  const saveEdit = async (key) => {
    try {
      const updated = { ...settings, [key]: editValue }
      await setDoc(doc(db, 'admin', 'settings'), updated)
      setSettings(updated)
      toast.success('Updated')
    } catch { toast.error('Failed to save') }
    setEditing(null)
  }

  const contactFields = [
    { key: 'supportPhone', icon: FiPhone, label: 'Phone', value: settings?.supportPhone || '+91 8057007105', desc: '24/7 Support' },
    { key: 'contactEmail', icon: FiMail, label: 'Email', value: settings?.contactEmail || 'support@gmail.com', desc: 'We reply within 24 hours' },
    { key: 'contactAddress', icon: FiMapPin, label: 'Office', value: settings?.contactAddress || 'Mumbai, Maharashtra, India', desc: settings?.contactAddressDesc || 'Visit us by appointment' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields')
    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Contact Us</h1>
          <p className="text-gray-500 mt-2">We're here to help you find your perfect match</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {contactFields.map((item, i) => (
              <div key={i} className="card p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-rose-500" size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  {editing === item.key ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none" autoFocus />
                      <button onClick={() => saveEdit(item.key)} className="text-green-500 hover:text-green-600"><FiCheck size={16} /></button>
                      <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><FiX size={16} /></button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                  )}
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                {isAdmin && editing !== item.key && (
                  <button onClick={() => startEdit(item.key, item.value)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all p-1">
                    <FiEdit2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="Your Name *" />
              <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="input-field" placeholder="Your Email *" />
              <input type="text" value={form.subject} onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))} className="input-field" placeholder="Subject" />
              <textarea value={form.message} onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))} rows={4} className="input-field" placeholder="Your Message *"></textarea>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiMessageSquare size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

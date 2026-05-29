import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiCheck, FiX, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

const defaults = {
  lastUpdated: 'March 2024',
  sections: [
    { title: '1. Information We Collect', content: 'We collect information you provide when creating your profile including name, age, gender, religion, education, photos, and partner preferences. We also collect usage data and communication data.' },
    { title: '2. How We Use Your Information', content: 'We use your information to provide matchmaking services, improve our algorithms, send relevant notifications, and ensure platform security. We never sell your personal data to third parties.' },
    { title: '3. Data Protection', content: 'We implement industry-standard encryption and security measures to protect your data. Your password is encrypted and never stored in plain text. We regularly audit our security practices.' },
    { title: '4. Your Privacy Controls', content: 'You have full control over your privacy settings. You can choose what information is visible, block users, hide your profile, and control who can message you. Access these settings from your Privacy Settings page.' },
    { title: '5. Cookies', content: 'We use cookies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.' },
    { title: '6. Data Retention', content: 'We retain your data as long as your account is active. Upon account deletion, your data is permanently removed within 30 days. Backup copies may be retained for a limited period.' },
    { title: '7. Third-Party Services', content: 'We may use third-party services for payment processing and analytics. These services have their own privacy policies and data handling practices.' },
    { title: '8. Contact Us', content: 'For privacy-related inquiries, contact our Data Protection Officer.' },
  ]
}

export default function Privacy() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [data, setData] = useState(defaults)
  const [editing, setEditing] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [unsavedIdx, setUnsavedIdx] = useState(null)

  const isAdmin = ['admin', 'superadmin', 'super-admin'].includes(role)

  useEffect(() => {
    getDoc(doc(db, 'admin', 'privacy')).then(snap => {
      if (snap.exists() && snap.data().sections?.length) setData(snap.data())
    }).catch(() => {})
  }, [])

  const saveAll = async (updated) => {
    try {
      await setDoc(doc(db, 'admin', 'privacy'), updated)
      setData(updated)
      toast.success('Privacy policy saved')
    } catch { toast.error('Failed to save') }
  }

  const startEdit = (i) => {
    setEditing(i)
    setEditTitle(data.sections[i].title)
    setEditContent(data.sections[i].content)
  }

  const cancelEdit = () => {
    if (unsavedIdx !== null) {
      const sections = data.sections.filter((_, idx) => idx !== unsavedIdx)
      setData(prev => ({ ...prev, sections }))
      setUnsavedIdx(null)
    }
    setEditing(null)
  }

  const saveEdit = (i) => {
    if (!editTitle.trim()) return toast.error('Title is required')
    const sections = data.sections.map((s, idx) => idx === i ? { title: editTitle.trim(), content: editContent.trim() } : s)
    saveAll({ ...data, sections })
    setEditing(null)
    setUnsavedIdx(null)
  }

  const deleteSection = (i) => {
    if (!confirm('Delete this section?')) return
    const sections = data.sections.filter((_, idx) => idx !== i)
    saveAll({ ...data, sections })
    if (editing === i) { setEditing(null); setUnsavedIdx(null) }
  }

  const addSection = () => {
    const idx = data.sections.length
    setData(prev => ({ ...prev, sections: [...prev.sections, { title: '', content: '' }] }))
    setEditing(idx)
    setEditTitle('')
    setEditContent('')
    setUnsavedIdx(idx)
  }

  const inputClass = "w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Privacy Policy</h1>
            </div>
            {isAdmin && (
              <button onClick={addSection} className="btn-primary text-sm flex items-center gap-1"><FiPlus size={14} /> Add Section</button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-8">Last updated: {data.lastUpdated || 'March 2024'}</p>

          <div className="card p-6 md:p-8 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {data.sections.map((section, i) => (
              <section key={i} className="group relative">
                {editing === i ? (
                  <div className="space-y-3">
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputClass + " font-semibold"} placeholder="Title" />
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} className={inputClass} placeholder="Content" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => saveEdit(i)} className="text-green-500 hover:text-green-600 p-1"><FiCheck size={18} /></button>
                      <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                    <p>{section.content}</p>
                    {isAdmin && (
                      <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(i)} className="p-1.5 text-gray-400 hover:text-blue-500"><FiEdit2 size={13} /></button>
                        <button onClick={() => deleteSection(i)} className="p-1.5 text-gray-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                      </div>
                    )}
                  </>
                )}
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

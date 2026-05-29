import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiCheck, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const defaults = {
  lastUpdated: 'March 2024',
  sections: [
    { title: '1. Acceptance of Terms', content: 'By accessing and using the platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.' },
    { title: '2. User Eligibility', content: 'You must be at least 18 years old to use our services. You agree to provide accurate and truthful information when creating your profile. Any misrepresentation may result in account termination.' },
    { title: '3. Account Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.' },
    { title: '4. Privacy', content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.' },
    { title: '5. Prohibited Activities', content: 'You agree not to: post false or misleading information, harass other users, use the platform for commercial purposes, share inappropriate content, or engage in any illegal activities.' },
    { title: '6. Subscription & Payments', content: 'Premium subscription fees are non-refundable unless specified otherwise. We reserve the right to change pricing with notice. Auto-renewal can be cancelled anytime from settings.' },
    { title: '7. Limitation of Liability', content: 'We are a platform for connecting individuals. We are not responsible for the conduct of any user, either online or offline. We do not guarantee marriage or relationship outcomes.' },
    { title: '8. Contact', content: 'For questions about these terms, contact us via the Contact Us page.' },
  ]
}

export default function Terms() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [data, setData] = useState(defaults)
  const [editing, setEditing] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [unsavedIdx, setUnsavedIdx] = useState(null)

  const isAdmin = ['admin', 'superadmin', 'super-admin'].includes(role)

  useEffect(() => {
    getDoc(doc(db, 'admin', 'terms')).then(snap => {
      if (snap.exists() && snap.data().sections?.length) setData(snap.data())
    }).catch(() => {})
  }, [])

  const saveAll = async (updated) => {
    try {
      await setDoc(doc(db, 'admin', 'terms'), updated)
      setData(updated)
      toast.success('Terms of service saved')
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Terms of Service</h1>
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

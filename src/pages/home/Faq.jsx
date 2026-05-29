import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiChevronDown, FiEdit2, FiCheck, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const defaults = [
  { q: 'How do I create an account on lakh_khushiya.com?', a: 'Simply click on "Register Free" and fill in your basic details. You can sign up using email or Google account. Complete your profile to start finding matches.' },
  { q: 'Is lakh_khushiya.com free to use?', a: 'Yes, basic registration and browsing are completely free. You can create your profile, upload photos, and search for matches. Premium features require a subscription.' },
  { q: 'How do you verify profiles?', a: 'We verify profiles through email verification, phone verification, and manual review of uploaded documents. Verified profiles get a special badge.' },
  { q: 'How does the matchmaking work?', a: 'Our AI-powered system matches you based on your preferences, profile details, and compatibility scores. You can also use advanced filters to find specific matches.' },
  { q: 'Is my information safe?', a: 'Absolutely. We use industry-standard encryption and security measures. You have full control over your privacy settings and what information is visible to others.' },
  { q: 'How do I send interest to someone?', a: 'When you find a profile you like, click "Send Interest" button. If they accept, you can start messaging each other.' },
  { q: 'Can I block or report a user?', a: 'Yes, you can block any user from their profile page or report them if you find any inappropriate behavior. Our moderation team reviews all reports.' },
  { q: 'How do I upgrade to premium?', a: 'Go to the Subscription page from your dashboard. Choose a plan that suits you and complete the payment. Premium features will be activated immediately.' },
  { q: 'Can I delete my account?', a: 'Yes, you can delete your account from Settings. Your data will be permanently removed within 30 days.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via email or phone from the Contact Us page.' },
]

export default function Faq() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [faqs, setFaqs] = useState(defaults)
  const [openId, setOpenId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editQ, setEditQ] = useState('')
  const [editA, setEditA] = useState('')
  const [unsavedIdx, setUnsavedIdx] = useState(null)

  const isAdmin = ['admin', 'superadmin', 'super-admin'].includes(role)

  useEffect(() => {
    getDoc(doc(db, 'admin', 'faq')).then(snap => {
      if (snap.exists() && snap.data().questions?.length) setFaqs(snap.data().questions)
    }).catch(() => {})
  }, [])

  const saveAll = async (updated) => {
    try {
      await setDoc(doc(db, 'admin', 'faq'), { questions: updated })
      setFaqs(updated)
      toast.success('FAQs saved')
    } catch { toast.error('Failed to save') }
  }

  const startEdit = (i) => {
    setEditing(i)
    setEditQ(faqs[i].q)
    setEditA(faqs[i].a)
  }

  const cancelEdit = () => {
    if (unsavedIdx !== null) {
      setFaqs(prev => prev.filter((_, idx) => idx !== unsavedIdx))
      setUnsavedIdx(null)
    }
    setEditing(null)
  }

  const saveEdit = (i) => {
    if (!editQ.trim()) return toast.error('Question is required')
    const updated = faqs.map((f, idx) => idx === i ? { q: editQ.trim(), a: editA.trim() } : f)
    saveAll(updated)
    setEditing(null)
    setUnsavedIdx(null)
  }

  const deleteFaq = (i) => {
    if (!confirm('Delete this FAQ?')) return
    const updated = faqs.filter((_, idx) => idx !== i)
    saveAll(updated)
    if (openId === i) setOpenId(null)
    if (editing === i) { setEditing(null); setUnsavedIdx(null) }
  }

  const addFaq = () => {
    const idx = faqs.length
    setFaqs(prev => [...prev, { q: '', a: '' }])
    setEditing(idx)
    setEditQ('')
    setEditA('')
    setUnsavedIdx(idx)
  }

  const inputClass = "w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Find answers to common questions about our platform</p>
          {isAdmin && (
            <button onClick={addFaq} className="mt-4 btn-primary text-sm inline-flex items-center gap-1">
              <FiPlus size={14} /> Add FAQ
            </button>
          )}
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden group">
              {editing === i ? (
                <div className="p-4 space-y-3">
                  <input type="text" value={editQ} onChange={e => setEditQ(e.target.value)} className={inputClass} placeholder="Question" />
                  <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={3} className={inputClass} placeholder="Answer" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveEdit(i)} className="text-green-500 hover:text-green-600 p-1"><FiCheck size={18} /></button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={18} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <button onClick={() => setOpenId(openId === i ? null : i)} className="flex-1 p-4 flex items-center justify-between text-left">
                      <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                      <FiChevronDown className={`text-gray-400 flex-shrink-0 transition-transform ${openId === i ? 'rotate-180' : ''}`} size={18} />
                    </button>
                    {isAdmin && (
                      <div className="flex items-center gap-1 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(i)} className="p-1.5 text-gray-400 hover:text-blue-500"><FiEdit2 size={13} /></button>
                        <button onClick={() => deleteFaq(i)} className="p-1.5 text-gray-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {openId === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowRight, FiEdit2, FiCheck, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const defaults = [
  { title: '10 Tips for Finding Your Perfect Life Partner', excerpt: 'Discover essential tips to help you find a compatible life partner through matrimonial platforms.', author: 'lakh_khushiya.com Team', date: 'March 15, 2024', category: 'Advice' },
  { title: 'The Importance of Compatibility in Marriage', excerpt: 'Understanding why compatibility matters more than you think for a successful marriage.', author: 'Relationship Expert', date: 'March 10, 2024', category: 'Relationships' },
  { title: 'How to Create an Attractive Matrimony Profile', excerpt: 'Learn how to make your profile stand out and attract the right matches.', author: 'lakh_khushiya.com Team', date: 'March 5, 2024', category: 'Tips' },
  { title: 'Modern Love: Finding Your Match Online', excerpt: 'The changing landscape of matchmaking and how online platforms are helping people find love.', author: 'Guest Author', date: 'February 28, 2024', category: 'Trends' },
]

export default function Blog() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [posts, setPosts] = useState(defaults)
  const [editing, setEditing] = useState(null)
  const [editPost, setEditPost] = useState({})
  const [unsavedIdx, setUnsavedIdx] = useState(null)

  const isAdmin = ['admin', 'superadmin', 'super-admin'].includes(role)

  useEffect(() => {
    getDoc(doc(db, 'admin', 'blog')).then(snap => {
      if (snap.exists() && snap.data().posts?.length) setPosts(snap.data().posts)
    }).catch(() => {})
  }, [])

  const saveAll = async (updated) => {
    try {
      await setDoc(doc(db, 'admin', 'blog'), { posts: updated })
      setPosts(updated)
      toast.success('Blog saved')
    } catch { toast.error('Failed to save') }
  }

  const startEdit = (i) => {
    setEditing(i)
    setEditPost({ ...posts[i] })
  }

  const cancelEdit = () => {
    if (unsavedIdx !== null) {
      setPosts(prev => prev.filter((_, idx) => idx !== unsavedIdx))
      setUnsavedIdx(null)
    }
    setEditing(null)
  }

  const saveEdit = (i) => {
    if (!editPost.title?.trim()) return toast.error('Title is required')
    const updated = posts.map((p, idx) => idx === i ? editPost : p)
    saveAll(updated)
    setEditing(null)
    setUnsavedIdx(null)
  }

  const deletePost = (i) => {
    if (!confirm('Delete this post?')) return
    saveAll(posts.filter((_, idx) => idx !== i))
    if (editing === i) { setEditing(null); setUnsavedIdx(null) }
  }

  const addPost = () => {
    const idx = posts.length
    setPosts(prev => [...prev, { title: '', excerpt: '', author: '', date: '', category: '' }])
    setEditing(idx)
    setEditPost({ title: '', excerpt: '', author: '', date: '', category: '' })
    setUnsavedIdx(idx)
  }

  const inputClass = "w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-rose-500 outline-none"

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Blog</h1>
            {isAdmin && (
              <button onClick={addPost} className="btn-primary text-sm flex items-center gap-1"><FiPlus size={14} /> Add Post</button>
            )}
          </div>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Relationship advice, matrimony tips, and success insights</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400 md:col-span-2 py-10">No posts yet.</p>
          ) : posts.map((post, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-6 hover:shadow-lg transition-shadow group relative"
            >
              {editing === i ? (
                <div className="space-y-3">
                  <input type="text" value={editPost.category} onChange={e => setEditPost(p => ({ ...p, category: e.target.value }))} className={inputClass + " w-32"} placeholder="Category" />
                  <input type="text" value={editPost.title} onChange={e => setEditPost(p => ({ ...p, title: e.target.value }))} className={inputClass + " font-semibold"} placeholder="Title" />
                  <textarea value={editPost.excerpt} onChange={e => setEditPost(p => ({ ...p, excerpt: e.target.value }))} rows={3} className={inputClass} placeholder="Excerpt" />
                  <div className="flex gap-2">
                    <input type="text" value={editPost.author} onChange={e => setEditPost(p => ({ ...p, author: e.target.value }))} className={inputClass} placeholder="Author" />
                    <input type="text" value={editPost.date} onChange={e => setEditPost(p => ({ ...p, date: e.target.value }))} className={inputClass} placeholder="Date" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveEdit(i)} className="text-green-500 hover:text-green-600 p-1"><FiCheck size={18} /></button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={18} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">{post.category}</span>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><FiUser size={12} /> {post.author}</span>
                      <span className="flex items-center gap-1"><FiCalendar size={12} /> {post.date}</span>
                    </div>
                    <span className="text-rose-600 flex items-center gap-1">Read More <FiArrowRight size={12} /></span>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(i)} className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow text-gray-400 hover:text-blue-500"><FiEdit2 size={13} /></button>
                      <button onClick={() => deletePost(i)} className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow text-gray-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

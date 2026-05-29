import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { FiHeart, FiStar } from 'react-icons/fi'

export default function SuccessStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'successStories'), orderBy('createdAt', 'desc'), limit(20))
        const snapshot = await getDocs(q)
        setStories(snapshot.docs.map(d => ({ ...d.data(), id: d.id })))
      } catch (err) {
        /* silent */
      }
      setLoading(false)
    }
    fetchStories()
  }, [])
  return (
    <div className="min-h-screen pt-20 pb-10">
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">Success Stories</h1>
            <p className="text-rose-100 text-lg max-w-2xl mx-auto">Real love stories from real couples who found their perfect match on lakh_khushiya.com</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card p-6 space-y-3"><div className="h-4 skeleton w-3/4"></div><div className="h-20 skeleton"></div><div className="h-10 skeleton w-1/2"></div></div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <FiHeart className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-500">No success stories yet</h3>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your love story!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div key={story.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, s) => <FiStar key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{story.story}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{story.name}</p>
                      <p className="text-xs text-gray-500">{story.location}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold gradient-text">{story.match}</p>
                    <p className="text-[10px] text-gray-400">Match</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-12 card p-8">
          <FiHeart className="mx-auto text-rose-500 mb-4" size={36} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-2">Start Your Love Story Today</h2>
          <p className="text-gray-500 mb-6">Join millions of happy couples who found their soulmate</p>
          <a href="/auth/register" className="btn-primary inline-block">Create Free Profile</a>
        </motion.div>
      </div>
    </div>
  )
}

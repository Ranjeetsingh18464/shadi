import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiHeart, FiShield, FiUsers, FiMessageCircle, FiStar, FiCheck, FiArrowRight, FiPlay, FiMapPin, FiBook, FiBriefcase } from 'react-icons/fi'
import ProfileCard from '../../components/common/ProfileCard'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
}

export default function Home() {
  const { user } = useAuth()
  const [featuredProfiles, setFeaturedProfiles] = useState([])
  const [plans, setPlans] = useState([])
  const [stories, setStories] = useState([])
  const [searchGender, setSearchGender] = useState('')
  const [searchAge, setSearchAge] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profSnap, planSnap, storySnap] = await Promise.all([
          user ? getDocs(query(collection(db, 'users'), where('profileComplete', '==', true), limit(6))) : Promise.resolve({ docs: [] }),
          getDocs(collection(db, 'subscriptionPlans')),
          getDocs(collection(db, 'successStories')),
        ])
        setFeaturedProfiles(profSnap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(p => !['admin','superadmin','super-admin','moderator'].includes(p.role)).sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0
          const tb = b.createdAt?.toMillis?.() || 0
          return tb - ta
        }))
        const planList = []
        planSnap.forEach(d => planList.push({ id: d.id, ...d.data() }))
        planList.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        setPlans(planList)
        setStories(storySnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) { /* permission errors expected for unauthenticated users */ }
    }
    fetchData()
  }, [user])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-200 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200 dark:bg-pink-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <FiHeart className="fill-current" size={14} /> India's #1 Matrimonial Platform
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Find Your{' '}
                <span className="gradient-text">Perfect</span>{' '}
                Life Partner
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Join millions of happy couples who found their soulmate on lakh_khushiya.com. 
                India's most trusted matrimonial platform with verified profiles and smart matchmaking.
              </p>

              {/* Quick Search */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Start Your Search</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <select value={searchGender} onChange={(e) => setSearchGender(e.target.value)} className="input-field text-sm">
                    <option value="">I'm looking for</option>
                    <option value="male">Groom</option>
                    <option value="female">Bride</option>
                  </select>
                  <select value={searchAge} onChange={(e) => setSearchAge(e.target.value)} className="input-field text-sm">
                    <option value="">Age</option>
                    {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                  <Link
                    to={`/matches/search?gender=${searchGender}&age=${searchAge}`}
                    className="btn-primary col-span-2 md:col-span-1 flex items-center justify-center gap-2"
                  >
                    <FiSearch size={18} /> Search Matches
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 md:gap-10 mt-8">
                <div><span className="text-2xl md:text-3xl font-bold gradient-text">10M+</span><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered Users</p></div>
                <div><span className="text-2xl md:text-3xl font-bold gradient-text">2.5M+</span><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Success Stories</p></div>
                <div><span className="text-2xl md:text-3xl font-bold gradient-text">98%</span><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Satisfaction Rate</p></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900/40 dark:to-pink-900/40 rounded-3xl rotate-6 absolute top-4 left-4"></div>
                <div className="w-80 h-96 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold font-display">Start Your Journey</h3>
                    <p className="text-sm text-white/80 mt-1">Find your soulmate today</p>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center"><FiHeart className="text-rose-500" size={20} /></div>
                  <div><p className="text-sm font-semibold text-gray-900 dark:text-white">New Match!</p><p className="text-xs text-gray-500">Compatibility 95%</p></div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><FiShield className="text-green-500" size={20} /></div>
                  <div><p className="text-sm font-semibold text-gray-900 dark:text-white">Verified</p><p className="text-xs text-gray-500">100% Real Profiles</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12 md:mb-16">
            <span className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 font-display">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">Find your perfect match in three simple steps</p>
          </motion.div>
          <motion.div {...stagger} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiUsers, title: 'Create Profile', desc: 'Sign up free and create your detailed profile with photos and preferences', color: 'from-rose-400 to-pink-500' },
              { icon: FiSearch, title: 'Find Matches', desc: 'Browse verified profiles with smart filters and AI matchmaking', color: 'from-pink-400 to-rose-500' },
              { icon: FiHeart, title: 'Connect & Celebrate', desc: 'Send interest, chat in real-time, and begin your love story', color: 'from-rose-500 to-pink-600' },
            ].map((item, i) => (
              <motion.div key={i} className="text-center p-6 md:p-8" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Matches */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Featured Profiles</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Browse through recently joined members</p>
          </motion.div>

          {featuredProfiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProfiles.map((profile, i) => (
                <motion.div key={profile.uid} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <ProfileCard profile={profile} compact />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card p-0 overflow-hidden">
                  <div className="h-40 skeleton"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 skeleton w-2/3"></div>
                    <div className="h-2 skeleton w-1/2"></div>
                    <div className="h-2 skeleton w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <motion.div {...fadeInUp} className="text-center mt-10">
            <Link to="/matches/search" className="btn-primary inline-flex items-center gap-2">
              View All Profiles <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Plans */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Membership</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 font-display">Choose Your Plan</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Unlock premium features to find your perfect match faster</p>
          </motion.div>

          {plans.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No plans available yet.</p>
          ) : (
          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                className={`card p-6 md:p-8 text-center relative ${
                  idx === 1 ? 'ring-2 ring-rose-500 scale-105' : ''
                }`}
              >
                {idx === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-4xl font-bold gradient-text">
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <p className="text-sm text-gray-500 mt-1">{plan.duration}</p>}
                </div>
                <ul className="space-y-2.5 mb-6 text-left">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.price === 0 ? '/auth/register' : '/subscription'}
                  className={`block w-full py-3 rounded-xl font-medium transition-all ${
                    plan.price === 0
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                >
                  {plan.price === 0 ? 'Get Started Free' : 'Upgrade Now'}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 font-display">Success Stories</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Real stories from real couples who found love</p>
          </motion.div>

          {stories.length === 0 ? (
            <p className="text-center text-gray-400">No success stories yet.</p>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 3).map((story, i) => (
              <motion.div key={story.id || i} className="card p-6" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, s) => <FiStar key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{story.story}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {story.coupleName?.split(' ').map(n => n[0]).join('') || 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{story.coupleName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{story.duration ? `Found love in ${story.duration} • ` : ''}{story.location || ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          <motion.div {...fadeInUp} className="text-center mt-8">
            <Link to="/success-stories" className="text-rose-600 hover:text-rose-700 font-medium text-sm inline-flex items-center gap-1">
              Read More Success Stories <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-rose-500 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Find Love On The Go</h2>
            <p className="text-rose-100 mb-8 text-lg">Download our mobile app for a seamless matchmaking experience</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => window.open('https://apps.apple.com', '_blank')} className="bg-black text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                App Store
              </button>
              <button onClick={() => window.open('https://play.google.com/store', '_blank')} className="bg-black text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.995.995 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                Google Play
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Why Choose lakh_khushiya.com?</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: FiShield, title: 'Verified Profiles', desc: 'All profiles are manually verified for authenticity' },
              { icon: FiUsers, title: 'Smart Matching', desc: 'AI-powered compatibility scoring for better matches' },
              { icon: FiMessageCircle, title: 'Private & Safe', desc: 'Control your privacy with advanced settings' },
              { icon: FiStar, title: 'Premium Service', desc: 'Dedicated support and premium matchmaking' },
            ].map((item, i) => (
              <motion.div key={i} className="text-center p-6" {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-rose-500" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

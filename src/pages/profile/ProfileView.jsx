import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { FiMapPin, FiBriefcase, FiBook, FiHeart, FiCalendar, FiUser, FiDollarSign, FiStar, FiMessageSquare, FiShield, FiCheck, FiShare2, FiFlag } from 'react-icons/fi'
import { calculateAge, getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProfileView() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = id || user?.uid
      if (!uid) return
      try {
        const docSnap = await getDoc(doc(db, 'users', uid))
        if (docSnap.exists()) setProfile({ uid: docSnap.id, ...docSnap.data() })
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchProfile()
  }, [id, user])

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!profile) return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-gray-500">Profile not found</p></div>

  const photos = profile.photos?.length > 0 ? profile.photos : profile.photoURL ? [{ url: profile.photoURL, isMain: true }] : []
  const isOwnProfile = user?.uid === profile.uid

  const sendInterest = async () => {
    if (!user) return toast.error('Please login first')
    try {
      await addDoc(collection(db, 'interests'), {
        senderId: user.uid,
        receiverId: profile.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
      toast.success('Interest sent successfully!')
    } catch (err) {
      toast.error('Failed to send interest')
    }
  }

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile link copied!')
  }

  const reportProfile = () => {
    if (!user) return toast.error('Please login first')
    const reason = window.prompt('Why are you reporting this profile?')
    if (!reason) return
    addDoc(collection(db, 'reports'), {
      reporterId: user.uid,
      reportedId: profile.uid,
      reason,
      createdAt: new Date().toISOString(),
    }).then(() => toast.success('Report submitted')).catch(() => toast.error('Failed to submit report'))
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Photos */}
          <div className="md:col-span-1">
            <div className="card overflow-hidden sticky top-24">
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                {photos[activePhoto]?.url ? (
                  <img src={photos[activePhoto].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(profile.displayName)}
                    </div>
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-1 p-2 overflow-x-auto">
                  {photos.map((photo, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activePhoto ? 'border-rose-500' : 'border-transparent'}`}>
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {!isOwnProfile && (
                <div className="p-4 space-y-2">
                  <button onClick={sendInterest} className="btn-primary w-full flex items-center justify-center gap-2">
                    <FiHeart size={16} /> Send Interest
                  </button>
                  <Link to={`/chat/${profile.uid}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <FiMessageSquare size={16} /> Send Message
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-4">
            {/* Name & Status */}
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <FiUser size={14} /> {profile.age} yrs, {profile.height}
                  </p>
                </div>
                <div className="flex gap-2">
                  {profile.isVerified && <span className="badge-success flex items-center gap-1"><FiCheck size={12} /> Verified</span>}
                  {profile.accountType === 'premium' && <span className="badge-premium">Premium</span>}
                </div>
              </div>

              {profile.about && (
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">{profile.about}</p>
              )}

              <div className="flex flex-wrap gap-1.5 mt-4">
                {profile.religion && <span className="badge-primary">{profile.religion}</span>}
                {profile.caste && <span className="badge-primary">{profile.caste}</span>}
                {profile.motherTongue && <span className="badge-primary">{profile.motherTongue}</span>}
                {profile.manglik && <span className={`${profile.manglik === 'Yes' ? 'badge-warning' : 'badge-success'}`}>{profile.manglik === 'Yes' ? 'Manglik' : 'Non-Manglik'}</span>}
                {profile.maritalStatus && <span className="badge-primary">{profile.maritalStatus}</span>}
              </div>
            </div>

            {/* Basic Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: FiCalendar, label: 'Age', value: profile.age },
                  { icon: FiUser, label: 'Height', value: profile.height },
                  { icon: FiUser, label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '-' },
                  { icon: FiHeart, label: 'Marital Status', value: profile.maritalStatus || '-' },
                  { icon: FiStar, label: 'Manglik', value: profile.manglik || '-' },
                  { icon: FiMapPin, label: 'Location', value: `${profile.city || ''}, ${profile.state || ''}` },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5"><item.icon size={12} /> {item.label}</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Info</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: FiBook, label: 'Education', value: profile.education },
                  { icon: FiBriefcase, label: 'Profession', value: profile.profession },
                  { icon: FiDollarSign, label: 'Annual Income', value: profile.annualIncome },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5"><item.icon size={12} /> {item.label}</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifestyle</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><div className="text-xs text-gray-400 mb-0.5">Diet</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.dietaryPreference || '-'}</p></div>
                <div><div className="text-xs text-gray-400 mb-0.5">Smoking</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.smoking || '-'}</p></div>
                <div><div className="text-xs text-gray-400 mb-0.5">Drinking</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.drinking || '-'}</p></div>
              </div>
              {profile.hobbies?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Hobbies & Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.hobbies.map((h, i) => (
                      <span key={i} className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs px-3 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Family */}
            {profile.aboutFamily && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Family Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {profile.familyType && <div><div className="text-xs text-gray-400 mb-0.5">Family Type</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.familyType}</p></div>}
                  {profile.familyValues && <div><div className="text-xs text-gray-400 mb-0.5">Family Values</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.familyValues}</p></div>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{profile.aboutFamily}</p>
              </div>
            )}

            {/* Partner Preferences */}
            {profile.partnerPreferences && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Partner Preferences</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><div className="text-xs text-gray-400 mb-0.5">Age</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.minAge || 18} - {profile.partnerPreferences.maxAge || 60} yrs</p></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Religion</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.religion || 'Any'}</p></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Caste</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.caste || 'Any'}</p></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Education</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.education || 'Any'}</p></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Profession</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.profession || 'Any'}</p></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Marital Status</div><p className="text-sm font-medium text-gray-900 dark:text-white">{profile.partnerPreferences.maritalStatus || 'Any'}</p></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={shareProfile} className="btn-secondary flex items-center gap-2 text-sm"><FiShare2 size={16} /> Share Profile</button>
              <button onClick={reportProfile} className="btn-secondary flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"><FiFlag size={16} /> Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

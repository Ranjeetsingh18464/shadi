import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiMessageSquare, FiUserCheck, FiMapPin, FiBriefcase, FiBook, FiCheck, FiX } from 'react-icons/fi'
import { calculateAge, formatCurrency, getTimeAgo, getInitials } from '../../utils/helpers'

export default function ProfileCard({ profile, onInterest, onSave, isSaved, compact = false }) {
  const [imgError, setImgError] = useState(false)

  if (!profile) return null

  const mainPhoto = profile.photos?.find(p => p.isMain)?.url || profile.photos?.[0]?.url || profile.photoURL

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card card-hover overflow-hidden ${compact ? '' : ''}`}
    >
      {/* Photo Section */}
      <div className="relative">
        <Link to={`/matches/profile/${profile.uid}`}>
          <div className={`${compact ? 'h-40' : 'h-52'} bg-gradient-to-br from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden`}>
            {mainPhoto && !imgError ? (
              <img
                src={mainPhoto}
                alt={profile.displayName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profile.displayName || profile.fullName)}
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {profile.accountType === 'premium' && (
            <span className="badge-premium text-[10px] px-2 py-0.5">PREMIUM</span>
          )}
          {profile.isVerified && (
            <span className="badge-success text-[10px] px-2 py-0.5 flex items-center gap-1">
              <FiCheck size={10} /> Verified
            </span>
          )}
          {profile.isOnline && (
            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Online
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => onSave?.(profile.uid)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSaved ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-rose-50'
            }`}
          >
            <FiHeart size={14} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Age & Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <Link to={`/matches/profile/${profile.uid}`}>
            <h3 className="text-white font-semibold text-sm truncate">
              {profile.displayName || profile.fullName}
              {profile.age && <span className="font-normal ml-1">{profile.age}</span>}
            </h3>
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FiMapPin size={12} />
          <span className="truncate">{profile.city || profile.state || 'Location not set'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FiBriefcase size={12} />
          <span className="truncate">{profile.profession || 'Profession not set'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FiBook size={12} />
          <span className="truncate">{profile.education || 'Education not set'}</span>
        </div>

        {profile.religion && (
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[10px] bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">
              {profile.religion}
            </span>
            {profile.manglik && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                profile.manglik === 'Yes'
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {profile.manglik === 'Yes' ? 'Manglik' : 'Non-Manglik'}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {onInterest && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onInterest(profile.uid, 'send')}
              className="flex-1 btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1"
            >
              <FiUserCheck size={14} /> Interest
            </button>
            <Link
              to={`/chat?user=${profile.uid}`}
              className="flex-1 btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1"
            >
              <FiMessageSquare size={14} /> Chat
            </Link>
          </div>
        )}

        <div className="text-[10px] text-gray-400 dark:text-gray-500 pt-1">
          {getTimeAgo(profile.lastLogin || profile.createdAt)}
        </div>
      </div>
    </motion.div>
  )
}

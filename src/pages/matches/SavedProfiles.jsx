import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export default function SavedProfiles() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-6">Saved Profiles</h1>
        <div className="text-center py-20">
          <FiHeart className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-500">No saved profiles yet</h3>
          <p className="text-sm text-gray-400 mt-1">Profiles you save will appear here</p>
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export default function Interests() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-6">Interests</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Received Interests</h2>
            <div className="text-center py-10 text-gray-500 text-sm">No interests received yet</div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Sent Interests</h2>
            <div className="text-center py-10 text-gray-500 text-sm">No interests sent yet</div>
          </div>
        </div>
      </div>
    </div>
  )
}

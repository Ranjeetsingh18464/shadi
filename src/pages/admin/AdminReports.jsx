import { useNavigate } from 'react-router-dom'
import { FiFlag, FiCheck, FiX } from 'react-icons/fi'

export default function AdminReports() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        </div>
        <span className="text-sm text-gray-500">Moderate user reports</span>
      </div>

      <div className="text-center py-20">
        <FiFlag className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-500">No pending reports</h3>
        <p className="text-sm text-gray-400 mt-1">All user reports have been resolved</p>
      </div>
    </div>
  )
}

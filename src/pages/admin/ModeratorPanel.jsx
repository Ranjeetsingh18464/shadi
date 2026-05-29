import { useNavigate } from 'react-router-dom'
import { FiShield, FiFlag, FiUsers, FiCamera, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi'

export default function ModeratorPanel() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors -ml-2" title="Close"><FiX size={22} /></button>
          <FiShield className="text-amber-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Moderator Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Reports', value: '0', icon: FiFlag, color: 'from-red-400 to-rose-500' },
          { label: 'Photo Reviews', value: '0', icon: FiCamera, color: 'from-blue-400 to-indigo-500' },
          { label: 'User Reports', value: '0', icon: FiUsers, color: 'from-amber-400 to-orange-500' },
          { label: 'Chat Reviews', value: '0', icon: FiMessageSquare, color: 'from-green-400 to-emerald-500' },
        ].map((item, i) => (
          <div key={i} className="card p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="text-white" size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="text-center py-10 text-sm text-gray-500">No pending moderation tasks</div>
      </div>
    </div>
  )
}

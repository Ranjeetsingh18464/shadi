import { useNotifications } from '../../contexts/NotificationContext'
import { FiBell, FiCheck, FiHeart, FiMessageSquare, FiStar, FiShield } from 'react-icons/fi'
import { formatTimestamp } from '../../utils/helpers'

const iconMap = {
  interest: FiHeart,
  message: FiMessageSquare,
  match: FiStar,
  system: FiShield,
}

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-secondary text-sm flex items-center gap-1">
              <FiCheck size={16} /> Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <FiBell className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-500">No notifications</h3>
            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = iconMap[notif.type] || FiBell
              return (
                <div key={notif.id} onClick={() => markAsRead(notif.id)}
                  className={`card p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.read ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notif.title}
                    </p>
                    {notif.body && <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">{formatTimestamp(notif.createdAt)}</p>
                  </div>
                  {!notif.read && <span className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-2"></span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

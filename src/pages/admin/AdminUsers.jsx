import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiShield, FiTrash2, FiCheck, FiX, FiArrowUp } from 'react-icons/fi'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'))
        setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (e) { console.error(e) }
    }
    fetchUsers()
  }, [])

  const changeRole = async (userId, currentRole) => {
    const roles = ['user', 'moderator', 'admin', 'super-admin']
    const idx = roles.indexOf(currentRole)
    const nextRole = roles[(idx + 1) % roles.length]
    try {
      await updateDoc(doc(db, 'users', userId), { role: nextRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u))
      toast.success(`Role changed to ${nextRole}`)
    } catch { toast.error('Failed to update role') }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        </div>
        <span className="text-sm text-gray-500">{users.length} total users</span>
      </div>

      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search users..." />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user.displayName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      user.role === 'super-admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>{user.role || 'user'}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.accountType || 'free'}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? <FiCheck size={12} /> : <FiX size={12} />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => changeRole(user.id, user.role || 'user')} className="p-1.5 text-gray-400 hover:text-blue-500 rounded" title="Change role"><FiShield size={14} /></button>
                      <button onClick={() => deleteUser(user.id)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded" title="Delete user"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-500">No users found</div>
        )}
      </div>
    </div>
  )
}

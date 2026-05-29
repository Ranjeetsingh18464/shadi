import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import MatchFilters from '../../components/matches/MatchFilters'
import ProfileCard from '../../components/common/ProfileCard'
import { useAuth } from '../../contexts/AuthContext'
import { FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function SearchProfiles() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [searchPerformed, setSearchPerformed] = useState(false)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async (filterParams = {}) => {
    setLoading(true)
    try {
      const constraints = []
      constraints.push(where('role', '==', 'user'))
      constraints.push(limit(50))
      if (filterParams.gender) constraints.push(where('gender', '==', filterParams.gender))
      const q = query(collection(db, 'users'), ...constraints)
      const snapshot = await getDocs(q)
      setProfiles(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })).filter(p => p.uid !== user?.uid))
    } catch (err) {
      if (err.code === 'failed-precondition') {
        toast.error('Missing Firestore index. Create it from the console link in the error log.')
      }
    }
    setLoading(false)
  }

  const handleSearch = () => {
    setSearchPerformed(true)
    fetchProfiles(filters)
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Search Profiles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find your perfect match with advanced filters</p>
        </div>

        <MatchFilters filters={filters} onFilterChange={setFilters} onSearch={handleSearch} />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="card p-0 overflow-hidden"><div className="h-48 skeleton"></div><div className="p-3 space-y-2"><div className="h-4 skeleton w-2/3"></div><div className="h-3 skeleton w-1/2"></div></div></div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <FiSearch className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-500">No profiles found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{profiles.length} profiles found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profiles.map((profile, i) => (
                  <motion.div key={profile.uid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ProfileCard profile={profile} compact />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

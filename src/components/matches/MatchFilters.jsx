import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSliders, FiSearch, FiX, FiChevronDown, FiRotateCcw } from 'react-icons/fi'
import {
  RELIGIONS, MOTHER_TONGUES, MARITAL_STATUSES, EDUCATION_LEVELS,
  PROFESSIONS, INCOME_RANGES, HEIGHTS, MANGALIK_OPTIONS, COUNTRIES, INDIAN_STATES
} from '../../utils/constants'

const defaultFilters = {
  gender: '',
  minAge: 18,
  maxAge: 60,
  minHeight: '',
  maxHeight: '',
  religion: '',
  caste: '',
  manglik: '',
  education: '',
  profession: '',
  minIncome: '',
  maxIncome: '',
  country: '',
  state: '',
  city: '',
  motherTongue: '',
  maritalStatus: '',
  hasPhoto: false,
  verifiedOnly: false,
  premiumOnly: false,
  onlineOnly: false,
  recentlyActive: false,
}

export default function MatchFilters({ filters, onFilterChange, onSearch }) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters || defaultFilters)
  const [showMore, setShowMore] = useState(false)

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    onFilterChange(updated)
  }

  const handleReset = () => {
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters = Object.entries(localFilters).some(([key, val]) => {
    if (typeof val === 'boolean') return val
    return val !== '' && val !== undefined
  })

  return (
    <div className="card p-4 md:p-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, profession, location..."
            value={localFilters.searchQuery || ''}
            onChange={(e) => handleChange('searchQuery', e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-xl border transition-all ${
            isOpen || hasActiveFilters
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800'
              : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <FiSliders size={18} />
        </button>
        <button onClick={onSearch} className="btn-primary">
          <FiSearch size={18} className="md:mr-1" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Looking for</label>
                  <select value={localFilters.gender} onChange={(e) => handleChange('gender', e.target.value)} className="input-field">
                    <option value="">Any</option>
                    <option value="male">Groom</option>
                    <option value="female">Bride</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Age Range</label>
                  <div className="flex gap-2">
                    <input type="number" min="18" max="100" value={localFilters.minAge} onChange={(e) => handleChange('minAge', parseInt(e.target.value))} className="input-field" placeholder="Min" />
                    <input type="number" min="18" max="100" value={localFilters.maxAge} onChange={(e) => handleChange('maxAge', parseInt(e.target.value))} className="input-field" placeholder="Max" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Religion</label>
                  <select value={localFilters.religion} onChange={(e) => handleChange('religion', e.target.value)} className="input-field">
                    <option value="">Any Religion</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mother Tongue</label>
                  <select value={localFilters.motherTongue} onChange={(e) => handleChange('motherTongue', e.target.value)} className="input-field">
                    <option value="">Any Language</option>
                    {MOTHER_TONGUES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Marital Status</label>
                  <select value={localFilters.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)} className="input-field">
                    <option value="">Any</option>
                    {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Manglik</label>
                  <select value={localFilters.manglik} onChange={(e) => handleChange('manglik', e.target.value)} className="input-field">
                    <option value="">Any</option>
                    {MANGALIK_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Advanced Filters */}
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-1 text-sm text-rose-600 mt-4 mb-2 hover:text-rose-700"
              >
                <FiChevronDown className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
                {showMore ? 'Show Less' : 'Advanced Filters'}
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Education</label>
                        <select value={localFilters.education} onChange={(e) => handleChange('education', e.target.value)} className="input-field">
                          <option value="">Any Education</option>
                          {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profession</label>
                        <select value={localFilters.profession} onChange={(e) => handleChange('profession', e.target.value)} className="input-field">
                          <option value="">Any Profession</option>
                          {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Income Range</label>
                        <div className="flex gap-2">
                          <select value={localFilters.minIncome} onChange={(e) => handleChange('minIncome', e.target.value)} className="input-field">
                            <option value="">Min</option>
                            {INCOME_RANGES.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                          <select value={localFilters.maxIncome} onChange={(e) => handleChange('maxIncome', e.target.value)} className="input-field">
                            <option value="">Max</option>
                            {INCOME_RANGES.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country</label>
                        <select value={localFilters.country} onChange={(e) => handleChange('country', e.target.value)} className="input-field">
                          <option value="">Any Country</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                        <select value={localFilters.state} onChange={(e) => handleChange('state', e.target.value)} className="input-field">
                          <option value="">Any State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                        <input type="text" value={localFilters.city} onChange={(e) => handleChange('city', e.target.value)} className="input-field" placeholder="Enter city" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Filters */}
              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={localFilters.hasPhoto} onChange={(e) => handleChange('hasPhoto', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Has Photo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={localFilters.verifiedOnly} onChange={(e) => handleChange('verifiedOnly', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={localFilters.premiumOnly} onChange={(e) => handleChange('premiumOnly', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Premium Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={localFilters.onlineOnly} onChange={(e) => handleChange('onlineOnly', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Online Now</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <FiRotateCcw size={14} /> Reset All
                </button>
                <button onClick={onSearch} className="btn-primary text-sm">
                  <FiSearch size={16} className="mr-1" /> Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { RELIGIONS, MOTHER_TONGUES, MARITAL_STATUSES, EDUCATION_LEVELS, PROFESSIONS, INCOME_RANGES, HEIGHTS, MANGALIK_OPTIONS, DIETARY_PREFERENCES, SMOKING_HABITS, DRINKING_HABITS, LIFESTYLE_OPTIONS, COUNTRIES, INDIAN_STATES, FAMILY_VALUES, FAMILY_TYPE } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function EditProfile() {
  const { userProfile, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ ...userProfile })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateUserProfile(form)
      toast.success('Profile updated!')
      navigate('/dashboard/profile')
    } catch (err) {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 md:p-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1 font-display">Edit Profile</h1>
          <p className="text-sm text-gray-500 mb-6">Update your personal information</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input type="text" value={form.displayName || ''} onChange={(e) => update('displayName', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-sm font-medium mb-1.5">Height</label>
                  <select value={form.height || ''} onChange={(e) => update('height', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Religion</label>
                  <select value={form.religion || ''} onChange={(e) => update('religion', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Mother Tongue</label>
                  <select value={form.motherTongue || ''} onChange={(e) => update('motherTongue', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {MOTHER_TONGUES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Marital Status</label>
                  <select value={form.maritalStatus || ''} onChange={(e) => update('maritalStatus', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Manglik</label>
                  <select value={form.manglik || ''} onChange={(e) => update('manglik', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {MANGALIK_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select></div>
              </div>
              <div className="mt-4"><label className="block text-sm font-medium mb-1.5">About Me</label>
                <textarea value={form.about || ''} onChange={(e) => update('about', e.target.value)} rows={4} className={inputClass} /></div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Career & Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Education</label>
                  <select value={form.education || ''} onChange={(e) => update('education', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Profession</label>
                  <select value={form.profession || ''} onChange={(e) => update('profession', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Annual Income</label>
                  <select value={form.annualIncome || ''} onChange={(e) => update('annualIncome', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {INCOME_RANGES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Country</label>
                  <select value={form.country || ''} onChange={(e) => update('country', e.target.value)} className={inputClass}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">State</label>
                  <select value={form.state || ''} onChange={(e) => update('state', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">City</label>
                  <input type="text" value={form.city || ''} onChange={(e) => update('city', e.target.value)} className={inputClass} /></div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Diet</label>
                  <select value={form.dietaryPreference || ''} onChange={(e) => update('dietaryPreference', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {DIETARY_PREFERENCES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Smoking</label>
                  <select value={form.smoking || ''} onChange={(e) => update('smoking', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {SMOKING_HABITS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium mb-1.5">Drinking</label>
                  <select value={form.drinking || ''} onChange={(e) => update('drinking', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {DRINKING_HABITS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select></div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Hobbies</label>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_OPTIONS.map(h => (
                    <button key={h} type="button" onClick={() => {
                      const hobbies = (form.hobbies || []).includes(h) ? form.hobbies.filter(x => x !== h) : [...(form.hobbies || []), h]
                      update('hobbies', hobbies)
                    }} className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      (form.hobbies || []).includes(h) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-gray-200 dark:border-gray-600 text-gray-500'
                    }`}>{h}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn-primary text-sm flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

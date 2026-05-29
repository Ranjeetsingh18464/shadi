import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../utils/firebase'
import { FiUser, FiCalendar, FiMapPin, FiBook, FiBriefcase, FiHeart, FiDollarSign, FiChevronLeft, FiChevronRight, FiCheck, FiUpload, FiX, FiLoader } from 'react-icons/fi'
import { RELIGIONS, CASTES, MOTHER_TONGUES, MARITAL_STATUSES, EDUCATION_LEVELS, PROFESSIONS, INCOME_RANGES, HEIGHTS, MANGALIK_OPTIONS, DIETARY_PREFERENCES, SMOKING_HABITS, DRINKING_HABITS, LIFESTYLE_OPTIONS, COUNTRIES, INDIAN_STATES, FAMILY_VALUES, FAMILY_TYPE } from '../../utils/constants'
import toast from 'react-hot-toast'

const steps = [
  { title: 'Personal', subtitle: 'Basic details' },
  { title: 'Professional', subtitle: 'Education & career' },
  { title: 'Lifestyle', subtitle: 'Habits & interests' },
  { title: 'Family', subtitle: 'Family background' },
  { title: 'Photos', subtitle: 'Upload photos' },
  { title: 'Partner', subtitle: 'Partner preferences' },
]

export default function ProfileSetup() {
  const { user, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '', dateOfBirth: '', age: '', height: '', weight: '',
    religion: '', caste: '', subCaste: '', motherTongue: '', manglik: '',
    maritalStatus: '', about: '',
    education: '', profession: '', annualIncome: '',
    country: 'India', state: '', city: '',
    dietaryPreference: '', smoking: '', drinking: '', hobbies: [],
    familyType: '', familyValues: '', familyLocation: '', aboutFamily: '',
    photos: [],
    partnerPreferences: {
      minAge: 25, maxAge: 35, minHeight: '', maxHeight: '', religion: '',
      caste: '', manglik: '', education: '', profession: '', maritalStatus: '',
    },
  })

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (formData.photos.length + files.length > 10) {
      return toast.error('Maximum 10 photos allowed')
    }
    if (!user) {
      toast.error('You must be logged in to upload photos')
      return
    }
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return
      }
      setUploading(true)
      const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`)
      const task = uploadBytesResumable(storageRef, file)
      task.on('state_changed',
        (snapshot) => { setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },
        (error) => {
          console.error('Upload error:', error.code, error.message)
          setUploading(false)
          if (error.code === 'storage/unauthorized') {
            toast.error('Upload blocked by Storage rules. Deploy storage.rules or enable Storage in Firebase Console.')
          } else if (error.code === 'storage/object-not-found') {
            toast.error('Storage bucket not found. Enable Firebase Storage in the console first.')
          } else {
            toast.error('Upload failed: ' + error.message)
          }
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          setFormData(prev => ({ ...prev, photos: [...prev.photos, url] }))
          setUploading(false)
          setUploadProgress(0)
        }
      )
    })
    e.target.value = ''
  }

  const removePhoto = (index) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleNext = () => {
    if (step === 1) {
      if (!formData.displayName || !formData.dateOfBirth || !formData.religion) return toast.error('Please fill required fields')
    }
    if (step < steps.length) setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const dob = new Date(formData.dateOfBirth)
      const age = new Date().getFullYear() - dob.getFullYear()
      const profileData = {
        ...formData,
        age,
        profileComplete: true,
      }
      await updateUserProfile(profileData)
      toast.success('Profile completed successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message?.includes('permission') ? 'Firestore permissions error. Run: firebase deploy --only firestore:rules' :
               err.message?.includes('database') ? 'Create Firestore database in Firebase Console' :
               `Save failed: ${err.message}`)
      console.error('Profile save error:', err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'gradient-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
              }`}>
                {step > i + 1 ? <FiCheck size={14} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{steps[step - 1].title} Details</h2>
          <p className="text-sm text-gray-500 mb-6">{steps[step - 1].subtitle}</p>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name *</label>
                    <input type="text" value={formData.displayName} onChange={(e) => updateField('displayName', e.target.value)} className={inputClass} placeholder="Your full name" /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Date of Birth *</label>
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Height</label>
                    <select value={formData.height} onChange={(e) => updateField('height', e.target.value)} className={inputClass}>
                      <option value="">Select height</option>
                      {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={(e) => updateField('weight', e.target.value)} className={inputClass} placeholder="Weight" /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Religion *</label>
                    <select value={formData.religion} onChange={(e) => updateField('religion', e.target.value)} className={inputClass}>
                      <option value="">Select religion</option>
                      {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Caste</label>
                    <select value={formData.caste} onChange={(e) => updateField('caste', e.target.value)} className={inputClass}>
                      <option value="">Select caste</option>
                      {CASTES[formData.religion]?.map(c => <option key={c} value={c}>{c}</option>) || <option>Other</option>}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Sub Caste</label>
                    <input type="text" value={formData.subCaste} onChange={(e) => updateField('subCaste', e.target.value)} className={inputClass} placeholder="Sub caste (optional)" /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Mother Tongue</label>
                    <select value={formData.motherTongue} onChange={(e) => updateField('motherTongue', e.target.value)} className={inputClass}>
                      <option value="">Select language</option>
                      {MOTHER_TONGUES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Manglik</label>
                    <select value={formData.manglik} onChange={(e) => updateField('manglik', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {MANGALIK_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Marital Status</label>
                    <select value={formData.maritalStatus} onChange={(e) => updateField('maritalStatus', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">About Me</label>
                  <textarea value={formData.about} onChange={(e) => updateField('about', e.target.value)} rows={3} className={inputClass} placeholder="Tell us about yourself..." /></div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Education</label>
                    <select value={formData.education} onChange={(e) => updateField('education', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Profession</label>
                    <select value={formData.profession} onChange={(e) => updateField('profession', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Annual Income</label>
                    <select value={formData.annualIncome} onChange={(e) => updateField('annualIncome', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {INCOME_RANGES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Country</label>
                    <select value={formData.country} onChange={(e) => updateField('country', e.target.value)} className={inputClass}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">State</label>
                    <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">City</label>
                    <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} placeholder="Your city" /></div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Diet Preference</label>
                    <select value={formData.dietaryPreference} onChange={(e) => updateField('dietaryPreference', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {DIETARY_PREFERENCES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Smoking</label>
                    <select value={formData.smoking} onChange={(e) => updateField('smoking', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {SMOKING_HABITS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Drinking</label>
                    <select value={formData.drinking} onChange={(e) => updateField('drinking', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {DRINKING_HABITS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select></div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Hobbies & Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {LIFESTYLE_OPTIONS.map(h => (
                      <button key={h} type="button" onClick={() => {
                        const hobbies = formData.hobbies.includes(h) ? formData.hobbies.filter(x => x !== h) : [...formData.hobbies, h]
                        updateField('hobbies', hobbies)
                      }} className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        formData.hobbies.includes(h) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'
                      }`}>{h}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Family Type</label>
                    <select value={formData.familyType} onChange={(e) => updateField('familyType', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {FAMILY_TYPE.map(t => <option key={t} value={t}>{t}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Family Values</label>
                    <select value={formData.familyValues} onChange={(e) => updateField('familyValues', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {FAMILY_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Family Location</label>
                    <input type="text" value={formData.familyLocation} onChange={(e) => updateField('familyLocation', e.target.value)} className={inputClass} placeholder="Family location" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">About Family</label>
                  <textarea value={formData.aboutFamily} onChange={(e) => updateField('aboutFamily', e.target.value)} rows={3} className={inputClass} placeholder="Tell us about your family..." /></div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center hover:border-rose-300 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-sm text-gray-500">Drag & drop your photos here, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Upload up to 10 photos (JPG, PNG)</p>
                  <button type="button" className="btn-primary mt-4 text-sm">Browse Photos</button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {uploading && (
                  <div className="text-center text-sm text-gray-500">
                    <FiLoader className="inline animate-spin mr-2" /> Uploading... {uploadProgress}%
                  </div>
                )}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {formData.photos.map((photo, i) => (
                      <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg relative group">
                        <img src={photo} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">Tell us about your ideal life partner</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Min Age</label>
                    <input type="number" value={formData.partnerPreferences.minAge} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, minAge: parseInt(e.target.value) })} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Max Age</label>
                    <input type="number" value={formData.partnerPreferences.maxAge} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, maxAge: parseInt(e.target.value) })} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Religion</label>
                    <select value={formData.partnerPreferences.religion} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, religion: e.target.value })} className={inputClass}>
                      <option value="">Any</option>
                      {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Caste</label>
                    <input type="text" value={formData.partnerPreferences.caste} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, caste: e.target.value })} className={inputClass} placeholder="Any" /></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Education</label>
                    <select value={formData.partnerPreferences.education} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, education: e.target.value })} className={inputClass}>
                      <option value="">Any</option>
                      {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Profession</label>
                    <select value={formData.partnerPreferences.profession} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, profession: e.target.value })} className={inputClass}>
                      <option value="">Any</option>
                      {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Manglik</label>
                    <select value={formData.partnerPreferences.manglik} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, manglik: e.target.value })} className={inputClass}>
                      <option value="">Any</option>
                      {MANGALIK_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Marital Status</label>
                    <select value={formData.partnerPreferences.maritalStatus} onChange={(e) => updateField('partnerPreferences', { ...formData.partnerPreferences, maritalStatus: e.target.value })} className={inputClass}>
                      <option value="">Any</option>
                      {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex items-center gap-1 text-sm">
                <FiChevronLeft size={16} /> Previous
              </button>
            )}
            <div className="flex-1"></div>
            {step < steps.length ? (
              <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-1 text-sm">
                Next <FiChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-1 text-sm">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

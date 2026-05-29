import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const defaults = {
  siteName: 'lakh_khushiya.com',
  siteDescription: "India's Most Trusted Matrimonial Platform",
  contactEmail: 'support@gmail.com',
  supportPhone: '+91 8057007105',
  contactAddress: 'Mumbai, Maharashtra, India',
  contactAddressDesc: 'Visit us by appointment',
  quickLinks: [
    { label: 'Search Matches', path: '/matches/search' },
    { label: 'Register Free', path: '/auth/register' },
    { label: 'Success Stories', path: '/success-stories' },
    { label: 'Membership Plans', path: '/subscription' },
    { label: 'Blog', path: '/blog' },
  ],
  supportLinks: [
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQs', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
  facebook: 'https://facebook.com/lakhkushiya',
  twitter: 'https://twitter.com/lakhkushiya',
  instagram: 'https://instagram.com/lakhkushiya',
  linkedin: 'https://linkedin.com/company/lakhkushiya',
  maintenanceMode: false,
  newUserVerification: true,
  photoApproval: true,
  allowGoogleLogin: true,
  allowPhoneLogin: true,
}

export default function AdminSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(defaults)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'admin', 'settings'))
        if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }))
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'admin', 'settings'), settings)
      toast.success('Settings saved')
    } catch { toast.error('Failed to save settings') }
  }

  const [editingLink, setEditingLink] = useState({ group: null, idx: null })
  const [linkForm, setLinkForm] = useState({ label: '', path: '' })

  if (loading) return <div className="text-center py-10 text-gray-500">Loading settings...</div>

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"

  const startEditLink = (group, idx, link) => {
    setEditingLink({ group, idx })
    setLinkForm({ label: link.label, path: link.path })
  }

  const saveLink = (group) => {
    if (!linkForm.label.trim() || !linkForm.path.trim()) return toast.error('Label and path required')
    const key = group === 'quick' ? 'quickLinks' : 'supportLinks'
    const updated = [...settings[key]]
    if (editingLink.idx === -1) updated.push({ label: linkForm.label.trim(), path: linkForm.path.trim() })
    else updated[editingLink.idx] = { label: linkForm.label.trim(), path: linkForm.path.trim() }
    setSettings(prev => ({ ...prev, [key]: updated }))
    setEditingLink({ group: null, idx: null })
  }

  const deleteLink = (group, idx) => {
    const key = group === 'quick' ? 'quickLinks' : 'supportLinks'
    const updated = settings[key].filter((_, i) => i !== idx)
    setSettings(prev => ({ ...prev, [key]: updated }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm">Save Settings</button>
      </div>

      <div className="card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Logo URL (image link for navbar/footer)</label>
              <input type="url" value={settings.logo || ''} onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))} className={inputClass} placeholder="https://example.com/logo.png" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Contact Email</label>
              <input type="email" value={settings.contactEmail} onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Support Phone</label>
              <input type="text" value={settings.supportPhone} onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Office Address</label>
              <input type="text" value={settings.contactAddress} onChange={(e) => setSettings(prev => ({ ...prev, contactAddress: e.target.value }))} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1.5">Address Description</label>
              <input type="text" value={settings.contactAddressDesc} onChange={(e) => setSettings(prev => ({ ...prev, contactAddressDesc: e.target.value }))} className={inputClass} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Site Description (shown in footer)</label>
              <textarea value={settings.siteDescription} onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))} rows={2} className={inputClass} /></div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Facebook URL</label>
              <input type="url" value={settings.facebook || ''} onChange={e => setSettings(prev => ({ ...prev, facebook: e.target.value }))} className={inputClass} placeholder="https://facebook.com/yourpage" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Twitter / X URL</label>
              <input type="url" value={settings.twitter || ''} onChange={e => setSettings(prev => ({ ...prev, twitter: e.target.value }))} className={inputClass} placeholder="https://twitter.com/yourprofile" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Instagram URL</label>
              <input type="url" value={settings.instagram || ''} onChange={e => setSettings(prev => ({ ...prev, instagram: e.target.value }))} className={inputClass} placeholder="https://instagram.com/yourprofile" /></div>
            <div><label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
              <input type="url" value={settings.linkedin || ''} onChange={e => setSettings(prev => ({ ...prev, linkedin: e.target.value }))} className={inputClass} placeholder="https://linkedin.com/company/yourpage" /></div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Footer Links</h2>
          {['quick', 'support'].map(group => (
            <div key={group} className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">{group === 'quick' ? 'Quick Links' : 'Support Links'}</h3>
              <div className="space-y-2">
                {(settings[group === 'quick' ? 'quickLinks' : 'supportLinks'] || []).map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {editingLink.group === group && editingLink.idx === i ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="text" value={linkForm.label} onChange={e => setLinkForm(f => ({ ...f, label: e.target.value }))} className="input-field text-sm flex-1" placeholder="Label" />
                        <input type="text" value={linkForm.path} onChange={e => setLinkForm(f => ({ ...f, path: e.target.value }))} className="input-field text-sm flex-1" placeholder="/path" />
                        <button onClick={() => saveLink(group)} className="text-green-500 hover:text-green-600 p-1"><FiCheck size={16} /></button>
                        <button onClick={() => setEditingLink({ group: null, idx: null })} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={16} /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{link.label}</span>
                        <span className="text-xs text-gray-400 flex-1">{link.path}</span>
                        <button onClick={() => startEditLink(group, i, link)} className="p-1 text-gray-400 hover:text-blue-500"><FiEdit2 size={13} /></button>
                        <button onClick={() => deleteLink(group, i)} className="p-1 text-gray-400 hover:text-red-500"><FiTrash2 size={13} /></button>
                      </>
                    )}
                  </div>
                ))}
                {editingLink.group === group && editingLink.idx === -1 && (
                  <div className="flex items-center gap-2">
                    <input type="text" value={linkForm.label} onChange={e => setLinkForm(f => ({ ...f, label: e.target.value }))} className="input-field text-sm flex-1" placeholder="Label" />
                    <input type="text" value={linkForm.path} onChange={e => setLinkForm(f => ({ ...f, path: e.target.value }))} className="input-field text-sm flex-1" placeholder="/path" />
                    <button onClick={() => saveLink(group)} className="text-green-500 hover:text-green-600 p-1"><FiCheck size={16} /></button>
                    <button onClick={() => setEditingLink({ group: null, idx: null })} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={16} /></button>
                  </div>
                )}
                <button onClick={() => { setEditingLink({ group, idx: -1 }); setLinkForm({ label: '', path: '' }) }} className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-1">
                  <FiPlus size={12} /> Add Link
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Toggles</h2>
          <div className="space-y-4">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Enable site maintenance mode' },
              { key: 'newUserVerification', label: 'New User Verification', desc: 'Require email verification for new users' },
              { key: 'photoApproval', label: 'Photo Approval Needed', desc: 'Admin must approve profile photos' },
              { key: 'allowGoogleLogin', label: 'Google Login', desc: 'Allow users to login with Google' },
              { key: 'allowPhoneLogin', label: 'Phone Login', desc: 'Allow users to login with phone number' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

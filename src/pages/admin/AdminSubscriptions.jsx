import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const emptyPlan = { name: '', price: 0, duration: '', features: [], order: 0 }

export default function AdminSubscriptions() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyPlan)
  const [featuresText, setFeaturesText] = useState('')

  const fetchPlans = async () => {
    try {
      const snap = await getDocs(collection(db, 'subscriptionPlans'))
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      setPlans(list)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchPlans() }, [])

  const openCreate = () => {
    setForm(emptyPlan)
    setFeaturesText('')
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (plan) => {
    setForm({ name: plan.name, price: plan.price, duration: plan.duration, features: plan.features, order: plan.order ?? 0 })
    setFeaturesText(plan.features.join('\n'))
    setEditingId(plan.id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Plan name is required')
    const data = { ...form, features: featuresText.split('\n').map(s => s.trim()).filter(Boolean) }
    try {
      if (editingId) {
        await updateDoc(doc(db, 'subscriptionPlans', editingId), data)
        toast.success('Plan updated')
      } else {
        await addDoc(collection(db, 'subscriptionPlans'), data)
        toast.success('Plan created')
      }
      setShowModal(false)
      fetchPlans()
    } catch { toast.error('Failed to save plan') }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" plan?`)) return
    try {
      await deleteDoc(doc(db, 'subscriptionPlans', id))
      toast.success('Plan deleted')
      fetchPlans()
    } catch { toast.error('Failed to delete plan') }
  }

  if (loading) return <div className="text-center py-10 text-gray-500">Loading plans...</div>

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Close"><FiX size={22} /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} /> Create Plan</button>
      </div>

      {plans.length === 0 ? (
        <p className="text-center py-10 text-gray-400">No plans yet. Click "Create Plan" to add one.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(plan)} className="p-1.5 text-gray-400 hover:text-blue-500"><FiEdit2 size={14} /></button>
                  <button onClick={() => handleDelete(plan.id, plan.name)} className="p-1.5 text-gray-400 hover:text-red-500"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <p className="text-2xl font-bold gradient-text mb-1">₹{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.duration}</p>
              <ul className="space-y-2">
                {plan.features?.map((f, i) => (
                  <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-rose-500 rounded-full"></span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Plan' : 'Create Plan'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="e.g. Gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputClass} placeholder="e.g. 6 months" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} rows={6} className={inputClass} placeholder="Create Profile&#10;Browse Matches&#10;Unlimited Interests" />
              </div>
              <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2"><FiCheck size={16} /> {editingId ? 'Update Plan' : 'Create Plan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

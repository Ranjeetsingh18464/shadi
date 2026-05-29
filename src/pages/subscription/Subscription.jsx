import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { FiCheck, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Subscription() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [billing, setBilling] = useState('yearly')

  useEffect(() => {
    getDocs(collection(db, 'subscriptionPlans')).then(snap => {
      const list = []
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      setPlans(list)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) return toast('You are already on the Free plan', { icon: 'ℹ️' })
    setSubscribing(true)
    try {
      toast.success('Redirecting to payment...')
    } catch {
      toast.error('Payment failed')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) return <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>

  if (plans.length === 0) return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
      <p className="text-gray-400">No subscription plans available yet.</p>
    </div>
  )

  const goldIdx = plans.findIndex(p => p.name?.toLowerCase() === 'gold')

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display">Choose Your Plan</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">Unlock premium features to find your perfect match faster</p>
          <div className="flex items-center justify-center gap-2 mt-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mx-auto">
            <button onClick={() => setBilling('monthly')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-rose-600 text-[10px] font-bold ml-1">SAVE 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className={`card p-6 md:p-8 relative ${idx === goldIdx ? 'ring-2 ring-rose-500 scale-105 shadow-xl' : ''}`}
            >
              {idx === goldIdx && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <FiStar size={12} /> MOST POPULAR
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.price === 0 ? 'Get started with basic features' : 'Everything you need to find your match'}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold gradient-text">₹{plan.price === 0 ? '0' : billing === 'yearly' ? (plan.price * 0.8).toLocaleString() : plan.price.toLocaleString()}</span>
                {plan.price > 0 && <span className="text-sm text-gray-500 ml-1">/{billing === 'yearly' ? 'year' : plan.duration}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => handleSubscribe(plan)} disabled={subscribing || plan.price === 0}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.price === 0 ? 'btn-secondary' : 'btn-primary shadow-lg shadow-rose-200 dark:shadow-rose-900/30'
                }`}
              >
                {subscribing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> :
                  plan.price === 0 ? 'Current Plan' : 'Subscribe Now'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* All Plans Comparison */}
        {plans.length > 1 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">Compare All Features</h2>
            <div className="overflow-x-auto">
              <table className="w-full card">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Features</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="p-4 text-sm font-bold text-gray-900 dark:text-white text-center">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allFeatures = [...new Set(plans.flatMap(p => p.features || []))]
                    return allFeatures.map((feature, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{feature}</td>
                        {plans.map(plan => {
                          const has = (plan.features || []).includes(feature)
                          return (
                            <td key={plan.id} className="p-4 text-center">
                              {has ? <FiCheck className="mx-auto text-green-500" size={18} /> : <span className="text-gray-300 dark:text-gray-600">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

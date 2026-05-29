import { motion } from 'framer-motion'
import { FiCreditCard, FiDownload, FiClock } from 'react-icons/fi'

export default function PaymentHistory() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Payment History</h1>
            <p className="text-sm text-gray-500 mt-1">Your subscription and payment records</p>
          </div>
        </div>

        <div className="text-center py-20">
          <FiCreditCard className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-500">No payment history</h3>
          <p className="text-sm text-gray-400 mt-1">Your payment records will appear here</p>
        </div>
      </div>
    </div>
  )
}

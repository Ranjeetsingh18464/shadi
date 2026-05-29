export const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export const formatTimestamp = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? 'Just now' : `${minutes}m ago`
    }
    return `${hours}h ago`
  }
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export const calculateAge = (dob) => {
  if (!dob) return 0
  const birthDate = dob.toDate ? dob.toDate() : new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const calculateCompatibility = (profile1, profile2) => {
  if (!profile1 || !profile2) return 0
  let score = 0
  let total = 0

  if (profile1.religion === profile2.religion) { score += 15; total += 15 }
  if (profile1.caste === profile2.caste) { score += 10; total += 10 }
  if (profile1.motherTongue === profile2.motherTongue) { score += 10; total += 10 }
  if (profile1.manglik === profile2.manglik) { score += 10; total += 10 }
  if (profile1.maritalStatus === profile2.maritalStatus) { score += 5; total += 5 }
  if (profile1.dietaryPreference === profile2.dietaryPreference) { score += 5; total += 5 }
  if (profile1.smoking === profile2.smoking) { score += 5; total += 5 }
  if (profile1.drinking === profile2.drinking) { score += 5; total += 5 }
  if (profile1.education === profile2.education) { score += 10; total += 10 }
  if (Math.abs((profile1.age || 0) - (profile2.age || 0)) <= 3) { score += 10; total += 10 }
  if (profile1.country === profile2.country) { score += 5; total += 5 }
  if (profile1.state === profile2.state) { score += 5; total += 5 }

  return total > 0 ? Math.round((score / total) * 100) : 0
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || ''
  return text.slice(0, maxLength) + '...'
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/
  return re.test(phone)
}

export const getHeightInCm = (heightStr) => {
  if (!heightStr) return 0
  const match = heightStr.match(/(\d+)'(\d+)/)
  if (match) {
    return parseInt(match[1]) * 30.48 + parseInt(match[2]) * 2.54
  }
  return 0
}

export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatCurrency = (amount) => {
  if (!amount) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getTimeAgo = (date) => {
  if (!date) return ''
  const now = new Date()
  const d = date.toDate ? date.toDate() : new Date(date)
  const seconds = Math.floor((now - d) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Online'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export const removeDuplicates = (arr, key) => {
  return arr.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  )
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

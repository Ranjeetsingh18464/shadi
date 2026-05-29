export const validateProfile = (data) => {
  const errors = {}

  if (!data.fullName?.trim()) errors.fullName = 'Full name is required'
  else if (data.fullName.length < 2) errors.fullName = 'Name must be at least 2 characters'

  if (!data.gender) errors.gender = 'Gender is required'

  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required'
  else {
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()
    if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old'
    else if (age > 100) errors.dateOfBirth = 'Invalid date of birth'
  }

  if (!data.religion) errors.religion = 'Religion is required'
  if (!data.maritalStatus) errors.maritalStatus = 'Marital status is required'

  if (!data.height) errors.height = 'Height is required'
  if (!data.education) errors.education = 'Education is required'
  if (!data.profession) errors.profession = 'Profession is required'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validatePartnerPreferences = (data) => {
  const errors = {}
  if (data.minAge && data.maxAge && data.minAge > data.maxAge) {
    errors.ageRange = 'Min age cannot be greater than max age'
  }
  if (data.minHeight && data.maxHeight && data.minHeight > data.maxHeight) {
    errors.heightRange = 'Min height cannot be greater than max height'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateSignup = (data) => {
  const errors = {}
  if (!data.email?.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format'

  if (!data.password) errors.password = 'Password is required'
  else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.password = 'Password must contain uppercase, lowercase, and number'
  }

  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  if (!data.fullName?.trim()) errors.fullName = 'Full name is required'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateLogin = (data) => {
  const errors = {}
  if (!data.email?.trim()) errors.email = 'Email is required'
  if (!data.password) errors.password = 'Password is required'
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other'
]

export const CASTES = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Jat', 'Gurjar', 'Rajput', 'Maratha', 'Kayastha', 'Other'],
  Muslim: ['Sunni', 'Shia', 'Sufi', 'Other'],
  Christian: ['Catholic', 'Protestant', 'Orthodox', 'Other'],
  Sikh: ['Jatt', 'Khatri', 'Arora', 'Ramgarhia', 'Bhatra', 'Other'],
  Buddhist: ['Mahayana', 'Theravada', 'Vajrayana', 'Other'],
  Jain: ['Digambara', 'Shwetambara', 'Other'],
  Other: ['Other'],
}

export const MOTHER_TONGUES = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati',
  'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Santali',
  'Kashmiri', 'Nepali', 'Sindhi', 'Konkani', 'Dogri', 'Bodo', 'Manipuri', 'Other'
]

export const MARITAL_STATUSES = [
  'Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'
]

export const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'Associate Degree', "Bachelor's Degree",
  "Master's Degree", 'Doctorate', 'MBA', 'CA', 'CS', 'Other'
]

export const PROFESSIONS = [
  'Software Engineer', 'Doctor', 'Lawyer', 'Teacher', 'Business Owner',
  'Government Employee', 'Banking Professional', 'Engineer', 'Accountant',
  'Architect', 'Consultant', 'Dentist', 'Professor', 'Nurse',
  'Marketing Professional', 'Sales Professional', 'Civil Services',
  'Armed Forces', 'Artist', 'Writer', 'Self Employed', 'Not Working', 'Other'
]

export const INCOME_RANGES = [
  'Below ₹1 Lakh', '₹1 - 2 Lakhs', '₹2 - 3 Lakhs', '₹3 - 5 Lakhs',
  '₹5 - 7 Lakhs', '₹7 - 10 Lakhs', '₹10 - 15 Lakhs', '₹15 - 20 Lakhs',
  '₹20 - 30 Lakhs', '₹30 - 50 Lakhs', '₹50 Lakhs - 1 Crore', 'Above 1 Crore'
]

export const HEIGHTS = [
  "4'5\" (135cm)", "4'6\" (137cm)", "4'7\" (140cm)", "4'8\" (142cm)",
  "4'9\" (145cm)", "4'10\" (147cm)", "4'11\" (150cm)", "5'0\" (152cm)",
  "5'1\" (155cm)", "5'2\" (157cm)", "5'3\" (160cm)", "5'4\" (163cm)",
  "5'5\" (165cm)", "5'6\" (168cm)", "5'7\" (170cm)", "5'8\" (173cm)",
  "5'9\" (175cm)", "5'10\" (178cm)", "5'11\" (180cm)", "6'0\" (183cm)",
  "6'1\" (185cm)", "6'2\" (188cm)", "6'3\" (191cm)", "6'4\" (193cm)",
  "6'5\" (196cm)", "6'6\" (198cm)", "6'7\" (201cm)", "6'8\" (203cm)",
]

export const DIETARY_PREFERENCES = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan']

export const SMOKING_HABITS = ['No', 'Occasionally', 'Yes']
export const DRINKING_HABITS = ['No', 'Occasionally', 'Yes']

export const MANGALIK_OPTIONS = ['Yes', 'No', "Don't Know"]

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    duration: 'lifetime',
    features: [
      'Create Profile',
      'Browse Matches',
      'Send 5 Interests',
      'Basic Search Filters',
      'Upload 3 Photos',
    ]
  },
  gold: {
    name: 'Gold',
    price: 2999,
    duration: '6 months',
    stripePriceId: 'price_gold_6m',
    features: [
      'All Free Features',
      'Unlimited Interests',
      'Advanced Search Filters',
      'Direct Messaging',
      'View Contact Details',
      'Upload 10 Photos',
      'Profile Booster',
      'Priority Support',
    ]
  },
  platinum: {
    name: 'Platinum',
    price: 4999,
    duration: '12 months',
    stripePriceId: 'price_platinum_12m',
    features: [
      'All Gold Features',
      'Unlimited Messaging',
      'View Hidden Photos',
      'Priority Listing',
      'Profile Verification Badge',
      'See Who Viewed You',
      'Relationship Manager',
      'AI Match Recommendations',
      'Horoscope Matching',
    ]
  }
}

export const COUNTRIES = ['India', 'USA', 'Canada', 'UK', 'Australia', 'UAE', 'Singapore', 'Other']

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
]

export const REPORT_REASONS = [
  'Fake Profile', 'Inappropriate Content', 'Harassment', 'Spam',
  'Wrong Information', 'Duplicate Profile', 'Fraud/Scam', 'Other'
]

export const LIFESTYLE_OPTIONS = [
  'Yoga', 'Gym/Fitness', 'Reading', 'Traveling', 'Cooking',
  'Music', 'Dancing', 'Photography', 'Sports', 'Movies',
  'Art & Painting', 'Gardening', 'Volunteering', 'Meditation'
]

export const FAMILY_VALUES = ['Orthodox', 'Traditional', 'Moderate', 'Liberal', 'Progressive']
export const FAMILY_TYPE = ['Nuclear', 'Joint', 'Extended']

export const API_ENDPOINTS = {
  USERS: '/api/users',
  PROFILES: '/api/profiles',
  MATCHES: '/api/matches',
  INTERESTS: '/api/interests',
  CHAT: '/api/chat',
  MESSAGES: '/api/messages',
  NOTIFICATIONS: '/api/notifications',
  PAYMENTS: '/api/payments',
  SUBSCRIPTIONS: '/api/subscriptions',
  REPORTS: '/api/reports',
  ADMIN: '/api/admin',
  AUTH: '/api/auth',
  UPLOAD: '/api/upload',
  BLOG: '/api/blog',
  SUCCESS_STORIES: '/api/success-stories',
}

# 💍 Shadi.com - Complete Matrimonial Platform

A production-ready matrimonial website built with React + Vite, Firebase, and Tailwind CSS. Features real-time chat, advanced matchmaking, subscription management, admin panel, and mobile-responsive design.

## 🚀 Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Framer Motion
- **Backend:** Firebase (Auth, Firestore, Storage, Functions)
- **Real-time:** Firestore real-time listeners
- **State:** React Context API + React Query
- **Payments:** Razorpay / Stripe integration
- **PWA:** Service worker + manifest for offline support
- **Deployment:** Netlify / Firebase Hosting / Docker

## 📋 Features

- User Registration (Email/Google/Phone OTP)
- Multi-step Profile Creation
- Advanced Match Filters
- Real-time Messaging
- Premium Subscriptions
- Admin Dashboard
- Moderator Panel
- Privacy Controls
- Dark/Light Mode
- PWA Support
- Mobile Responsive

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- Firebase project with Auth, Firestore, Storage enabled
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd shadi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase config values

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password, Google, Phone)
3. Create Firestore database
4. Set up Storage bucket
5. Deploy Firestore rules: `firebase deploy --only firestore:rules`
6. Deploy Storage rules: `firebase deploy --only storage:rules`

### Firebase Functions (Optional)

```bash
cd functions
npm install
npm run deploy
```

## 📁 Project Structure

```
shadi/
├── public/              # Static assets, PWA manifest
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── chat/        # Chat/messaging components
│   │   ├── common/      # Shared components (Navbar, Footer, etc.)
│   │   ├── home/        # Homepage sections
│   │   ├── matches/     # Match filters, cards
│   │   └── profile/     # Profile components
│   ├── contexts/        # React contexts (Auth, Theme, Notifications)
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   │   ├── admin/       # Admin panel pages
│   │   ├── auth/        # Login, Register, Forgot Password
│   │   ├── chat/        # Chat list, Chat room
│   │   ├── dashboard/   # User dashboard, notifications, settings
│   │   ├── home/        # Home, Success Stories, Blog, FAQ, Contact
│   │   ├── matches/     # Matches, Search, Saved, Interests
│   │   ├── profile/     # Profile setup, view, edit, privacy
│   │   └── subscription/ # Plans, payment history
│   ├── routes/          # Route guards (Protected, Admin, Moderator)
│   ├── styles/          # Global styles (Tailwind + custom)
│   ├── utils/           # Firebase config, constants, helpers
│   └── App.jsx          # Main app with routing
├── functions/           # Firebase Cloud Functions
├── firestore.rules      # Firestore security rules
├── netlify.toml         # Netlify deployment config
└── Dockerfile           # Docker deployment
```

## 🔐 Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_RAZORPAY_KEY_ID` | Razorpay payment key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## 🚢 Deployment

### Netlify (Recommended)

```bash
npm run build
netlify deploy --prod
```

### Firebase Hosting

```bash
firebase init hosting
npm run build
firebase deploy --only hosting
```

### Docker

```bash
docker build -t shadi-app .
docker run -p 80:80 shadi-app
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Browse profiles, send interests, chat, manage profile |
| **Premium** | Unlimited messaging, view contacts, priority listing |
| **Moderator** | Review reports, approve photos, moderate chats |
| **Admin** | Full access, user management, analytics, settings |

## 🔒 Security

- Firebase Authentication with email/Google/phone
- Firestore security rules with role-based access
- Encrypted passwords (Firebase handles this)
- Rate limiting on auth operations
- Profile verification system
- Anti-fake profile detection

## 📄 License

MIT

## 🤝 Support

For support, email support@shadi.com or visit our FAQ page.

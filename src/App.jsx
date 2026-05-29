import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import LoadingScreen from './components/common/LoadingScreen'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import ModeratorRoute from './routes/ModeratorRoute'

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const ProfileSetup = lazy(() => import('./pages/profile/ProfileSetup'))
const ProfileView = lazy(() => import('./pages/profile/ProfileView'))
const EditProfile = lazy(() => import('./pages/profile/EditProfile'))
const Matches = lazy(() => import('./pages/matches/Matches'))
const SearchProfiles = lazy(() => import('./pages/matches/SearchProfiles'))
const SavedProfiles = lazy(() => import('./pages/matches/SavedProfiles'))
const Interests = lazy(() => import('./pages/matches/Interests'))
const Chat = lazy(() => import('./pages/chat/Chat'))
const ChatRoom = lazy(() => import('./pages/chat/ChatRoom'))
const Subscription = lazy(() => import('./pages/subscription/Subscription'))
const PaymentHistory = lazy(() => import('./pages/subscription/PaymentHistory'))
const PrivacySettings = lazy(() => import('./pages/profile/PrivacySettings'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const ModeratorPanel = lazy(() => import('./pages/admin/ModeratorPanel'))
const SuccessStories = lazy(() => import('./pages/home/SuccessStories'))
const Blog = lazy(() => import('./pages/home/Blog'))
const Faq = lazy(() => import('./pages/home/Faq'))
const Contact = lazy(() => import('./pages/home/Contact'))
const Terms = lazy(() => import('./pages/home/Terms'))
const Privacy = lazy(() => import('./pages/home/Privacy'))
const Notifications = lazy(() => import('./pages/dashboard/Notifications'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))

export default function App() {
  const { loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="success-stories" element={<SuccessStories />} />
          <Route path="blog" element={<Blog />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile-setup" element={<ProfileSetup />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/matches" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Matches />} />
          <Route path="search" element={<SearchProfiles />} />
          <Route path="saved" element={<SavedProfiles />} />
          <Route path="interests" element={<Interests />} />
          <Route path="profile/:id" element={<ProfileView />} />
        </Route>

        <Route path="/chat" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Chat />} />
          <Route path=":roomId" element={<ChatRoom />} />
        </Route>

        <Route path="/subscription" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Subscription />} />
          <Route path="history" element={<PaymentHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Moderator Routes */}
        <Route path="/moderator" element={<ModeratorRoute><AdminLayout /></ModeratorRoute>}>
          <Route index element={<ModeratorPanel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

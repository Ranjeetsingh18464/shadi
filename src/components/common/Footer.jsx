import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { FiHeart, FiMail, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiPhone } from 'react-icons/fi'

export default function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'lakh_khushiya.com',
    logo: null,
    siteDescription: "India's Most Trusted Matrimonial Platform",
  })

  useEffect(() => {
    getDoc(doc(db, 'admin', 'settings')).then(snap => {
      if (snap.exists()) setSettings(snap.data())
    }).catch(() => {})
  }, [])
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings?.logo ? (
                <img src={settings.logo} alt="" className="h-8 w-auto" />
              ) : (
                <span className="text-2xl">💍</span>
              )}
              <span className="text-xl font-bold text-white font-display">{settings?.siteName || 'lakh_khushiya.com'}</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {settings?.siteDescription || "India's Most Trusted Matrimonial Platform"}
            </p>
            <div className="flex gap-3">
              <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors"><FiFacebook size={18} /></a>
              <a href={settings?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors"><FiTwitter size={18} /></a>
              <a href={settings?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors"><FiInstagram size={18} /></a>
              <a href={settings?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors"><FiLinkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {(settings?.quickLinks || []).map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm hover:text-rose-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2.5">
              {(settings?.supportLinks || []).map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm hover:text-rose-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiPhone className="mt-0.5 text-rose-400 flex-shrink-0" size={16} />
                <span className="text-sm">{settings?.supportPhone || '+91 8057007105'}</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="mt-0.5 text-rose-400 flex-shrink-0" size={16} />
                <span className="text-sm">{settings?.contactEmail || 'support@gmail.com'}</span>
              </li>
              <li className="flex items-start gap-3">
                <FiHeart className="mt-0.5 text-rose-400 flex-shrink-0" size={16} />
                <span className="text-sm">24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 {settings?.siteName || 'lakh_khushiya.com'}. All rights reserved. | India's Most Trusted Matrimonial Brand
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms</Link>
            <a href="#" className="hover:text-gray-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

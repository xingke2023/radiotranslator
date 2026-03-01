import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 shadow-ms z-50 border-b border-gray-200" style={{ backgroundColor: 'rgb(245, 243, 244)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="RadioTranslator Logo" className="h-16 w-auto" />
            <h1 className="logo-title text-3xl sm:text-4xl lg:text-5xl text-primary">
              RadioTranslator
            </h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-primary font-semibold transition-colors duration-150">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/features" className="text-gray-700 hover:text-primary font-semibold transition-colors duration-150">
                {t('nav.features')}
              </Link>
            </li>
            <li>
              <Link to="/stations" className="text-gray-700 hover:text-primary font-semibold transition-colors duration-150">
                {t('nav.stations')}
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-700 hover:text-primary font-semibold transition-colors duration-150">
                {t('nav.pricing')}
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary font-semibold transition-colors duration-150">
                    {t('nav.dashboard')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn-outline"
                  >
                    {t('nav.logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="btn-outline"
                  >
                    {t('nav.login')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    {t('nav.register')}
                  </Link>
                </li>
              </>
            )}
            <li>
              <LanguageSwitcher />
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary focus:outline-none transition-colors duration-150"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  to="/"
                  className="block py-2 text-gray-700 hover:text-primary font-semibold transition-colors duration-150"
                  onClick={closeMobileMenu}
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="block py-2 text-gray-700 hover:text-primary font-semibold transition-colors duration-150"
                  onClick={closeMobileMenu}
                >
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link
                  to="/stations"
                  className="block py-2 text-gray-700 hover:text-primary font-semibold transition-colors duration-150"
                  onClick={closeMobileMenu}
                >
                  {t('nav.stations')}
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="block py-2 text-gray-700 hover:text-primary font-semibold transition-colors duration-150"
                  onClick={closeMobileMenu}
                >
                  {t('nav.pricing')}
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block py-2 text-gray-700 hover:text-primary font-semibold transition-colors duration-150"
                      onClick={closeMobileMenu}
                    >
                      {t('nav.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn-outline w-full"
                    >
                      {t('nav.logout')}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="btn-outline block text-center"
                      onClick={closeMobileMenu}
                    >
                      {t('nav.login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn-primary block text-center"
                      onClick={closeMobileMenu}
                    >
                      {t('nav.register')}
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-2">
                <LanguageSwitcher />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

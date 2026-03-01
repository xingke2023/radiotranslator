import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setError(t('register.passwordTooShort'))
      return
    }

    setLoading(true)

    try {
      await register(email, password, username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || t('register.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 sm:py-14 px-4 sm:px-5 bg-ms-50">
      <div className="w-full max-w-md">
        <div className="card-elegant p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-primary">{t('register.title')}</h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-10">{t('register.subtitle')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-elegant mb-6 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('register.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t('register.usernamePlaceholder')}
                className="input-elegant"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('register.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('register.emailPlaceholder')}
                className="input-elegant"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('register.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('register.passwordPlaceholder')}
                className="input-elegant"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('register.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t('register.confirmPasswordPlaceholder')}
                className="input-elegant"
              />
            </div>

            <button
              type="submit"
              className={`btn-primary w-full text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="text-center mt-6 sm:mt-7 text-gray-600 text-sm sm:text-base">
            {t('register.hasAccount')} <Link to="/login" className="text-primary font-bold hover:text-primary-dark transition-colors duration-150">{t('register.loginLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

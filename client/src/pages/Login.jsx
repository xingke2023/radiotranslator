import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 sm:py-14 px-4 sm:px-5 bg-ms-50">
      <div className="w-full max-w-md">
        <div className="card-elegant p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-primary">{t('login.title')}</h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-10">{t('login.subtitle')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-elegant mb-6 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5 sm:mb-6">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('login.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="input-elegant"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2 font-semibold text-gray-800 text-sm sm:text-base">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-elegant"
              />
            </div>

            <button
              type="submit"
              className={`btn-primary w-full text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <p className="text-center mt-6 sm:mt-7 text-gray-600 text-sm sm:text-base">
            {t('login.noAccount')} <Link to="/register" className="text-primary font-bold hover:text-primary-dark transition-colors duration-150">{t('login.registerLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

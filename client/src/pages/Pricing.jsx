import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

function Pricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchPlans()

    // Check for payment status in URL
    const paymentStatus = searchParams.get('payment')
    if (paymentStatus === 'success') {
      alert(t('pricing.subscribeSuccess'))
      navigate('/dashboard', { replace: true })
    } else if (paymentStatus === 'cancelled') {
      alert('支付已取消')
    }
  }, [searchParams])

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/subscriptions/plans')
      setPlans(response.data.plans)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    }
  }

  const translateText = (text) => {
    // Try to translate using the plans dictionary
    const translated = t(`pricing.plans.${text}`, { defaultValue: text })
    return translated !== text ? translated : text
  }

  const handleSubscribe = (planId) => {
    if (!user) {
      navigate('/login')
      return
    }
    setSelectedPlan(planId)
    setShowPaymentModal(true)
  }

  const handlePaymentMethod = async (paymentMethod, duration = null) => {
    setLoading(true)
    setShowPaymentModal(false)

    try {
      let response

      if (paymentMethod === 'card') {
        // Card supports recurring subscription
        response = await axios.post('/api/subscriptions/create-checkout-session',
          { tier: selectedPlan },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      } else {
        // Alipay/WeChat Pay one-time payment
        const tier = duration === 'daily' ? 'daily' : selectedPlan
        response = await axios.post('/api/subscriptions/create-checkout-session-onetime',
          { tier, paymentMethod },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      }

      // Redirect to Stripe Checkout URL
      if (response.data.url) {
        window.location.href = response.data.url
      } else {
        throw new Error('未收到支付链接')
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      alert(t('pricing.subscribeFailed') + (error.response?.data?.error || error.response?.data?.details || error.message || '未知错误'))
      setLoading(false)
    }
  }

  return (
    <div className="pb-10">
      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">选择支付方式</h3>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => handlePaymentMethod('card')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>💳</span>
                  <span>信用卡 / 借记卡</span>
                  <span className="text-xs bg-blue-700 px-2 py-1 rounded">自动续费</span>
                </div>
                <div className="text-xs mt-1 opacity-90">
                  {selectedPlan === 'basic' ? '$9.99/月' : '$19.99/月'}
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethod('alipay')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>💙</span>
                  <span>支付宝</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">1个月</span>
                </div>
                <div className="text-xs mt-1 opacity-90">
                  {selectedPlan === 'basic' ? '¥69' : '¥139'}
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethod('wechat_pay')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>💚</span>
                  <span>微信支付</span>
                  <span className="text-xs bg-green-700 px-2 py-1 rounded">1个月</span>
                </div>
                <div className="text-xs mt-1 opacity-90">
                  {selectedPlan === 'basic' ? '¥69' : '¥139'}
                </div>
              </button>

              {/* Daily Plan Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">每日体验</span>
                </div>
              </div>

              {/* Daily Plan Options */}
              <button
                onClick={() => handlePaymentMethod('alipay', 'daily')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>💙</span>
                  <span>支付宝</span>
                  <span className="text-xs bg-orange-600 px-2 py-1 rounded">1天</span>
                </div>
                <div className="text-xs mt-1 opacity-90">
                  ¥10/天
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethod('wechat_pay', 'daily')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>💚</span>
                  <span>微信支付</span>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">1天</span>
                </div>
                <div className="text-xs mt-1 opacity-90">
                  ¥10/天
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={loading}
              className="w-full mt-4 sm:mt-6 border-2 border-gray-300 text-gray-600 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              取消
            </button>

            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
              💡 信用卡支持自动续费<br/>
              💙💚 支付宝/微信支付为一次性付款（需手动续费）<br/>
              ⚡ 每日体验适合短期试用，享受基础会员功能
            </p>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">{t('pricing.title')}</h1>
          <p className="text-base sm:text-lg opacity-90">{t('pricing.subtitle')}</p>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center relative transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">{t('pricing.free.name')}</h3>
              <div className="mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">¥{t('pricing.free.price')}</span>
                <span className="text-gray-500 text-sm sm:text-base">{t('pricing.perMonth')}</span>
              </div>
              <ul className="text-left space-y-2 sm:space-y-3 mb-6 sm:mb-8 border-t border-gray-200 pt-4 sm:pt-6">
                <li className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm">✓ {t('pricing.free.feature1')}</li>
                <li className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm">✓ {t('pricing.free.feature2')}</li>
                <li className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm">✓ {t('pricing.free.feature3')}</li>
                <li className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm">✗ {t('pricing.free.feature4')}</li>
                <li className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm">✗ {t('pricing.free.feature5')}</li>
                <li className="pb-2 sm:pb-3 text-xs sm:text-sm">✗ {t('pricing.free.feature6')}</li>
              </ul>
              <button className="w-full bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 sm:py-3.5 rounded-lg font-semibold cursor-not-allowed text-sm sm:text-base" disabled>
                {t('pricing.currentPlan')}
              </button>
            </div>

            {plans.map(plan => (
              <div key={plan.id} className={`bg-white p-6 sm:p-8 rounded-xl shadow-md text-center relative transition-transform duration-300 hover:-translate-y-2 ${plan.id === 'premium' ? 'border-2 border-primary shadow-xl' : ''}`}>
                {plan.id === 'premium' && (
                  <div className="absolute -top-3 right-5 bg-gradient-to-r from-primary to-secondary text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {t('pricing.recommended')}
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">{translateText(plan.name)}</h3>
                <div className="mb-6 sm:mb-8">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">¥{(plan.price * 7).toFixed(2)}</span>
                  <span className="text-gray-500 text-sm sm:text-base">{t('pricing.perMonth')}</span>
                </div>
                <ul className="text-left space-y-2 sm:space-y-3 mb-6 sm:mb-8 border-t border-gray-200 pt-4 sm:pt-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="pb-2 sm:pb-3 border-b border-gray-100 text-xs sm:text-sm last:border-b-0">✓ {translateText(feature)}</li>
                  ))}
                </ul>
                <button
                  className={`w-full px-6 py-3 sm:py-3.5 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                      : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  } ${(loading || user?.subscriptionTier === plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || user?.subscriptionTier === plan.id}
                >
                  {user?.subscriptionTier === plan.id ? t('pricing.currentPlan') : t('pricing.subscribe')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">{t('pricing.faqTitle')}</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{t('pricing.faq1.question')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('pricing.faq1.answer')}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{t('pricing.faq2.question')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('pricing.faq2.answer')}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{t('pricing.faq3.question')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('pricing.faq3.answer')}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{t('pricing.faq4.question')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('pricing.faq4.answer')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing

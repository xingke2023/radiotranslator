import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function HelpCenter() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'getting-started', icon: '🚀' },
    { id: 'account', icon: '👤' },
    { id: 'features', icon: '⚡' },
    { id: 'subscription', icon: '💳' },
    { id: 'technical', icon: '🔧' },
    { id: 'troubleshooting', icon: '🩹' }
  ]

  const getCategoryQuestions = (categoryId) => {
    return t(`help.categories.${categoryId}.questions`, { returnObjects: true })
  }

  return (
    <div className="pb-10">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('help.title')}</h1>
          <p className="text-lg opacity-90 mb-8">{t('help.subtitle')}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('help.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{t(`help.categories.${category.id}.title`)}</span>
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary text-center">
              {t(`help.categories.${activeCategory}.title`)}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {t(`help.categories.${activeCategory}.description`)}
            </p>

            <div className="space-y-4">
              {getCategoryQuestions(activeCategory).map((item, index) => (
                <details
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                >
                  <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-primary group-open:rotate-180 transition-transform duration-200">▼</span>
                  </summary>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('help.quickLinks.contact.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.quickLinks.contact.desc')}</p>
              <a href="/contact" className="text-primary font-semibold hover:underline">
                {t('help.quickLinks.contact.button')} →
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('help.quickLinks.docs.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.quickLinks.docs.desc')}</p>
              <a href="/features" className="text-primary font-semibold hover:underline">
                {t('help.quickLinks.docs.button')} →
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">{t('help.quickLinks.community.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.quickLinks.community.desc')}</p>
              <a href="#" className="text-primary font-semibold hover:underline">
                {t('help.quickLinks.community.button')} →
              </a>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="mt-16 bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">{t('help.needMore.title')}</h3>
            <p className="mb-6 opacity-90">{t('help.needMore.description')}</p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {t('help.needMore.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenter

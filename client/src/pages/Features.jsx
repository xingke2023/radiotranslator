import { useTranslation } from 'react-i18next'

function Features() {
  const { t } = useTranslation()

  return (
    <div className="pb-10">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('features.title')}</h1>
          <p className="text-lg opacity-90">{t('features.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('features.realtime.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('features.realtime.desc')}
              </p>
              <ul className="space-y-2">
                <li className="text-gray-800">✓ {t('features.realtime.feature1')}</li>
                <li className="text-gray-800">✓ {t('features.realtime.feature2')}</li>
                <li className="text-gray-800">✓ {t('features.realtime.feature3')}</li>
                <li className="text-gray-800">✓ {t('features.realtime.feature4')}</li>
              </ul>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary to-secondary rounded-3xl flex justify-center items-center text-7xl md:text-9xl">
                🎧
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-20">
            <div className="order-2 md:order-1 flex justify-center items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary to-secondary rounded-3xl flex justify-center items-center text-7xl md:text-9xl">
                📝
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('features.subtitle.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('features.subtitle.desc')}
              </p>
              <ul className="space-y-2">
                <li className="text-gray-800">✓ {t('features.subtitle.feature1')}</li>
                <li className="text-gray-800">✓ {t('features.subtitle.feature2')}</li>
                <li className="text-gray-800">✓ {t('features.subtitle.feature3')}</li>
                <li className="text-gray-800">✓ {t('features.subtitle.feature4')}</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('features.translation.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('features.translation.desc')}
              </p>
              <ul className="space-y-2">
                <li className="text-gray-800">✓ {t('features.translation.feature1')}</li>
                <li className="text-gray-800">✓ {t('features.translation.feature2')}</li>
                <li className="text-gray-800">✓ {t('features.translation.feature3')}</li>
                <li className="text-gray-800">✓ {t('features.translation.feature4')}</li>
              </ul>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary to-secondary rounded-3xl flex justify-center items-center text-7xl md:text-9xl">
                🌐
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 flex justify-center items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary to-secondary rounded-3xl flex justify-center items-center text-7xl md:text-9xl">
                ⭐
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-5">{t('features.vip.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('features.vip.desc')}
              </p>
              <ul className="space-y-2">
                <li className="text-gray-800">✓ {t('features.vip.feature1')}</li>
                <li className="text-gray-800">✓ {t('features.vip.feature2')}</li>
                <li className="text-gray-800">✓ {t('features.vip.feature3')}</li>
                <li className="text-gray-800">✓ {t('features.vip.feature4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('features.techTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary">{t('features.tech1.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.tech1.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary">{t('features.tech2.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.tech2.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary">{t('features.tech3.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.tech3.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary">{t('features.tech4.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.tech4.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features

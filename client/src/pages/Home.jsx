import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import RadioStations from './RadioStations'

function Home() {
  const { t } = useTranslation()

  useEffect(() => {
    // 动态加载 Google AdSense 脚本
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2222518687209013'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    return () => {
      // 清理脚本
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div>
      {/* Radio Stations Player */}
      <RadioStations />

      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-primary">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="card-elegant p-8 sm:p-10 text-center group ms-reveal">
              <div className="text-5xl sm:text-6xl mb-5">🎧</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{t('home.features.realtime.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('home.features.realtime.desc')}</p>
            </div>
            <div className="card-elegant p-8 sm:p-10 text-center group ms-reveal">
              <div className="text-5xl sm:text-6xl mb-5">📝</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{t('home.features.subtitle.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('home.features.subtitle.desc')}</p>
            </div>
            <div className="card-elegant p-8 sm:p-10 text-center group ms-reveal">
              <div className="text-5xl sm:text-6xl mb-5">🌐</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{t('home.features.translation.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('home.features.translation.desc')}</p>
            </div>
            <div className="card-elegant p-8 sm:p-10 text-center group ms-reveal">
              <div className="text-5xl sm:text-6xl mb-5">⭐</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">{t('home.features.vip.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('home.features.vip.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="text-center group">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">1000+</h3>
              <p className="text-base sm:text-lg md:text-xl text-elegant-600 font-medium">{t('home.stats.stations')}</p>
            </div>
            <div className="text-center group">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">50+</h3>
              <p className="text-base sm:text-lg md:text-xl text-elegant-600 font-medium">{t('home.stats.languages')}</p>
            </div>
            <div className="text-center group">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">100K+</h3>
              <p className="text-base sm:text-lg md:text-xl text-elegant-600 font-medium">{t('home.stats.users')}</p>
            </div>
            <div className="text-center group">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</h3>
              <p className="text-base sm:text-lg md:text-xl text-elegant-600 font-medium">{t('home.stats.uptime')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 md:py-28 text-center bg-ms-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary">{t('home.cta.title')}</h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-10 px-4">{t('home.cta.description')}</p>
          <Link
            to="/register"
            className="btn-primary inline-block min-w-[180px] text-lg shadow-ms-lg"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

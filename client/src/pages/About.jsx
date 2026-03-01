import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation()

  return (
    <div className="pb-10">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('about.hero.title')}</h1>
          <p className="text-lg opacity-90">{t('about.hero.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {t('about.intro')}
            </p>

            <h2 className="text-3xl font-bold mb-6 text-primary">{t('about.vision.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('about.vision.description')}
            </p>

            {/* Immediate Launch Phase */}
            <div className="bg-ms-100 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">{t('about.phases.launch.title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.launch.feature1.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.launch.feature1.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.launch.feature2.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.launch.feature2.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.launch.feature3.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.launch.feature3.desc')}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 30-Day Update */}
            <div className="bg-white border-2 border-primary/20 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">{t('about.phases.thirty.title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.thirty.feature1.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.thirty.feature1.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.thirty.feature2.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.thirty.feature2.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.thirty.feature3.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.thirty.feature3.desc')}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 90-Day Expansion */}
            <div className="bg-ms-100 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">{t('about.phases.ninety.title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.ninety.feature1.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.ninety.feature1.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.ninety.feature2.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.ninety.feature2.desc')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">•</span>
                  <div>
                    <strong className="text-gray-900">{t('about.phases.ninety.feature3.title')}</strong>
                    <p className="text-gray-600">{t('about.phases.ninety.feature3.desc')}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Why Different */}
            <h2 className="text-3xl font-bold mb-6 text-primary mt-12">{t('about.different.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('about.different.intro')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-bold mb-3 text-primary">{t('about.different.point1.title')}</h4>
                <p className="text-gray-600 text-sm">{t('about.different.point1.desc')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-bold mb-3 text-primary">{t('about.different.point2.title')}</h4>
                <p className="text-gray-600 text-sm">{t('about.different.point2.desc')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-bold mb-3 text-primary">{t('about.different.point3.title')}</h4>
                <p className="text-gray-600 text-sm">{t('about.different.point3.desc')}</p>
              </div>
            </div>

            {/* Educational Framework */}
            <h2 className="text-3xl font-bold mb-6 text-primary">{t('about.framework.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('about.framework.intro')}
            </p>
            <ul className="space-y-3 mb-12">
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">{t('about.framework.point1.title')}</strong>
                  <span className="text-gray-600"> {t('about.framework.point1.desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">{t('about.framework.point2.title')}</strong>
                  <span className="text-gray-600"> {t('about.framework.point2.desc')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">{t('about.framework.point3.title')}</strong>
                  <span className="text-gray-600"> {t('about.framework.point3.desc')}</span>
                </div>
              </li>
            </ul>

            {/* Join Us */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl text-center">
              <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
              <p className="text-lg mb-6 opacity-90">
                {t('about.cta.description')}
              </p>
              <a
                href="https://www.radiotranslator.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200"
              >
                {t('about.cta.button')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

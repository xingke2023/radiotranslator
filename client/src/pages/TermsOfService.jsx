import { useTranslation } from 'react-i18next'

function TermsOfService() {
  const { t } = useTranslation()

  return (
    <div className="pb-10">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('terms.title')}</h1>
          <p className="text-lg opacity-90">{t('terms.lastUpdated')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
            <p className="text-gray-800 leading-relaxed">
              {t('terms.intro')}
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section1.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section1.content')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('terms.section1.point1')}</li>
              <li>{t('terms.section1.point2')}</li>
              <li>{t('terms.section1.point3')}</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section2.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section2.content')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('terms.section2.point1')}</li>
              <li>{t('terms.section2.point2')}</li>
              <li>{t('terms.section2.point3')}</li>
              <li>{t('terms.section2.point4')}</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section3.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section3.content')}</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">{t('terms.section3.subtitle1')}</h3>
              <p className="text-gray-700 mb-4">{t('terms.section3.desc1')}</p>
              <h3 className="font-bold text-gray-900 mb-3">{t('terms.section3.subtitle2')}</h3>
              <p className="text-gray-700">{t('terms.section3.desc2')}</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section4.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section4.content')}</p>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section5.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section5.content')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>{t('terms.section5.point1')}</li>
              <li>{t('terms.section5.point2')}</li>
              <li>{t('terms.section5.point3')}</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section6.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section6.content')}</p>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section7.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section7.content')}</p>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section8.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('terms.section8.content')}</p>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section9.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section9.content')}</p>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{t('terms.section10.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('terms.section10.content')}</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>{t('terms.section10.email')}</strong> dev2@xingke888.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>{t('terms.section10.company')}</strong> HONGKONG MACRODATA TECHNOLOGY LIMITED
              </p>
              <p className="text-gray-700">
                <strong>{t('terms.section10.address')}</strong> UNIT 27, /F 15 STAR HSE NO.SALISBURY RD TSIM SHA TSUI, HONG KONG
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl text-center">
            <p className="text-lg">
              {t('terms.footer')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsOfService

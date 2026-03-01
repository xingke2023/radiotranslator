import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="gradient-elegant text-white mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">RadioTranslator</h3>
            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('nav.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">{t('footer.about')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base font-light">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="text-center mb-6">
            <h4 className="text-sm sm:text-base font-semibold mb-3 text-white">{t('footer.company.name')}</h4>
            <div className="space-y-2 text-white/70 text-xs sm:text-sm font-light">
              <p>Address: {t('footer.company.address')}</p>
              <p>Email: <a href="mailto:dev2@xingke888.com" className="hover:text-white transition-colors duration-200">{t('footer.company.email')}</a></p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs sm:text-sm font-light">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-sm font-medium"
      aria-label="Switch Language"
    >
      <span className="text-lg">🌐</span>
      <span>{i18n.language === 'zh' ? 'EN' : '中文'}</span>
    </button>
  )
}

export default LanguageSwitcher

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zh from './locales/zh.json';

// Detect browser language and set default
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  // If browser language starts with 'zh', use Chinese, otherwise use English
  return browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    lng: getBrowserLanguage(), // Auto-detect language based on browser
    fallbackLng: 'en', // Default to English for non-Chinese users
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      // Convert language codes to our supported languages
      convertDetectedLanguage: (lng) => {
        if (lng.toLowerCase().startsWith('zh')) {
          return 'zh';
        }
        return 'en';
      }
    }
  });

export default i18n;

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './app/locales/en/translation.json'
import ru from './app/locales/ru/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

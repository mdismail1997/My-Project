import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translation/en.json';
import de from './translation/de.json';

i18n.use(initReactI18next).init(
  {
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: en,
      de: de,
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  },
  (err, _t) => {
    console.log(err);
  }
);

export default i18n;

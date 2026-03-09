import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


import zhTW from './locales/zh-TW.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import en from './locales/en.json';

const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
  ja: { translation: ja },
  ko: { translation: ko },
};

// 言語表示名のマッピング
export const languageNames: Record<string, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
};

// 利用可能な言語リストを取得
export const availableLanguages = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-TW',
    fallbackLng: 'zh-TW',
    interpolation: {
      escapeValue: false,
      prefix: '{{',
      suffix: '}}',
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
    },
  });

export default i18n;

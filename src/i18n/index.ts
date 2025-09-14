import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  },
  'zh-TW': {
    translation: zhTW
  }
};

// 自定义语言检测函数
const detectLanguage = (): string => {
  // 首先检查localStorage中是否有保存的语言设置
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && ['en', 'zh', 'zh-TW'].includes(savedLang)) {
    return savedLang;
  }

  // 获取浏览器语言
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // 根据浏览器语言设置对应的应用语言
  if (browserLang.startsWith('zh-CN') || browserLang === 'zh') {
    return 'zh'; // 简体中文
  } else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) {
    return 'zh-TW'; // 繁体中文
  } else {
    return 'en'; // 其他语言默认英语
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(), // 使用自定义检测函数
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
import i18n, { TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getItem, setItem } from './storage';

// Типи для ресурсів перекладів
interface TranslationResources {
  translation: {
    [key: string]: string | { [key: string]: any };
  };
}

// Перевіряємо, чи виконується код на сервері
const isServer: boolean = typeof window === 'undefined';
// Визначаємо, чи виконується код у браузері
const isBrowser: boolean = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Ресурси локалізації
const resources: { [language: string]: TranslationResources } = {
  uk: {
    translation: require('../../locales/uk/translation.json')
  },
  ru: {
    translation: require('../../locales/ru/translation.json')
  }
};

// Функція для зміни мови
export const changeLanguage = async (lng: string): Promise<boolean> => {
  try {
    if (!lng) return false;
    
    // Зберігаємо вибір мови в локальне сховище
    if (isBrowser) {
      await setItem('user_language', lng);
    }
    
    await i18n.changeLanguage(lng);
    return true;
  } catch (error) {
    console.error('Помилка при зміні мови:', error);
    return false;
  }
};

// Функція для завантаження збереженої мови
export const loadSavedLanguage = async (): Promise<string> => {
  try {
    // Якщо це серверний рендеринг, повертаємо мову за замовчуванням
    if (isServer) return 'uk';
    
    // Намагаємося отримати збережену мову
    const savedLanguage = await getItem('user_language');
    
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Якщо мова не збережена, визначаємо мову пристрою
    const deviceLanguage = window.navigator.language.split('-')[0];
    return ['uk', 'ru'].includes(deviceLanguage) ? deviceLanguage : 'uk';
  } catch (error) {
    console.error('Помилка при завантаженні мови:', error);
    return 'uk';
  }
};

// Ініціалізація i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uk', // Мова за замовчуванням
    fallbackLng: 'uk', // Резервна мова
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // Не екрануємо HTML у рядках перекладу
    },
    react: {
      useSuspense: false, // Вимкнути Suspense, якщо не використовується
    },
  });

export default i18n;

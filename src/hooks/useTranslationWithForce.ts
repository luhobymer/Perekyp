import { useState, useEffect } from 'react';
import i18n, { getItem } from '../utils/i18n';
import { TFunction } from 'i18next';

// Типи для хука перекладу
export interface TranslationWithForceHook {
  t: TFunction;
  i18n: typeof i18n;
  currentLanguage: string;
}

/**
 * Хук, що розширює стандартний useTranslation, забезпечуючи
 * оновлення компонентів при зміні мови
 */
export const useTranslationWithForce = (): TranslationWithForceHook => {
  // Стан для відслідковування поточної мови
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  
  useEffect(() => {
    console.log(`[useTranslationWithForce] Ініціалізація з мовою: ${i18n.language}`);
    
    // Функція для оновлення мови в стані
    const handleLanguageChange = (lng: string): void => {
      console.log(`[useTranslationWithForce] Змінено мову на: ${lng}, поточний стан: ${currentLanguage}`);
      setCurrentLanguage(lng);
    };
    
    // Підписуємось на подію зміни мови
    i18n.on('languageChanged', handleLanguageChange);
    
    // Перевіряємо початкову мову зі сховища
    const checkInitialLanguage = async (): Promise<void> => {
      try {
        let savedLanguage: string | null = null;
        
        // Перевіряємо, чи код виконується в браузері
        const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
        
        if (isBrowser) {
          savedLanguage = window.localStorage.getItem('language');
        } else {
          savedLanguage = await getItem('language');
        }
        
        if (savedLanguage && savedLanguage !== i18n.language) {
          console.log(`[useTranslationWithForce] Знайдена збережена мова ${savedLanguage}, встановлена ${i18n.language}`);
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[useTranslationWithForce] Помилка перевірки мови: ${errorMessage}`);
      }
    };
    
    checkInitialLanguage();
    
    // Відписуємось при демонтуванні компонента
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);
  
  // Функція перекладу з i18n
  const t: TFunction = (key: string, defaultValue?: string): string => {
    const translation = i18n.t(key, defaultValue);
    return translation;
  };
  
  return { t, i18n, currentLanguage };
};

export default useTranslationWithForce;

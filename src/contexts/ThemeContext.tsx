import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';
import { ThemeContextType, ThemeMode } from '../types/theme';

// Перевіряємо, чи код виконується в браузері
const isBrowser = typeof window !== 'undefined';

// Створюємо нативний storage для збереження теми
const localStorageHelper = {
  getItem: async (key: string): Promise<string | null> => {
    if (!isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to storage:', e);
    }
  }
};

// Створюємо контекст з типом
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system'); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === 'dark');

  // Завантаження збережених налаштувань теми
  useEffect(() => {
    async function loadSavedTheme() {
      try {
        const savedTheme = await localStorageHelper.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode', error);
      }
    }
    
    loadSavedTheme();
  }, []);

  // Оновлення активної теми
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  // Зміна теми
  const toggleTheme = async (): Promise<void> => {
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    try {
      await localStorageHelper.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error saving theme mode', error);
    }
  };

  // Встановлення конкретної теми
  const setTheme = async (mode: ThemeMode): Promise<void> => {
    setThemeMode(mode);
    try {
      await localStorageHelper.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
        themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

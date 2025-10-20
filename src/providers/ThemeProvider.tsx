import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Теми
export const lightTheme = {
  colors: {
    primary: '#8B0000', // Темно-вишневий
    primaryLight: '#C41E3A', // Світло-вишневий
    primaryDark: '#560319', // Дуже темний вишневий
    secondary: '#C0C0C0', // Сріблястий
    secondaryLight: '#E6E6E6', // Світло-сріблястий
    secondaryDark: '#A9A9A9', // Темно-сріблястий
    background: '#F8F8F8',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#BDBDBD',
    notification: '#8B0000',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
    white: '#FFFFFF',
    inputBackground: '#F0F0F0',
  },
};

export const darkTheme = {
  colors: {
    primary: '#C41E3A', // Світло-вишневий
    primaryLight: '#8B0000', // Темно-вишневий
    primaryDark: '#560319', // Дуже темний вишневий
    secondary: '#A9A9A9', // Темно-сріблястий
    secondaryLight: '#C0C0C0', // Сріблястий
    secondaryDark: '#E6E6E6', // Світло-сріблястий
    background: '#333333',
    card: '#666666',
    text: '#FFFFFF',
    textSecondary: '#E6E6E6',
    border: '#666666',
    notification: '#C41E3A',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
    white: '#FFFFFF',
    inputBackground: '#444444',
  },
};

// Тип для контексту теми
interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

// Створюємо контекст
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Провайдер для теми
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(deviceColorScheme === 'dark');

  // Завантажуємо збережені налаштування теми при запуску
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Оновлюємо активну тему при зміні налаштувань або системної теми
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(deviceColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, deviceColorScheme]);

  // Завантажуємо збережені налаштування теми
  const loadThemePreference = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('themeMode');
      if (savedThemeMode) {
        setThemeMode(savedThemeMode as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.error('Failed to load theme mode preference', error);
    }
  };

  // Зберігаємо налаштування теми
  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme mode preference', error);
    }
  };

  // Функція для перемикання між світлою і темною темами
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  };

  // Функція для встановлення конкретної теми
  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
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
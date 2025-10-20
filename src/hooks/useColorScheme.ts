import { useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { getItem } from '../utils/storage';

/**
 * Хук для отримання та керування кольоровою схемою додатку
 * 
 * @returns Поточна кольорова схема ('light' | 'dark')
 */
export function useColorScheme() {
  const deviceScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState(deviceScheme);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await getItem('themeMode');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else if (savedTheme === 'system' || !savedTheme) {
          setTheme(deviceScheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setTheme(deviceScheme);
      }
    }

    loadTheme();
  }, [deviceScheme]);

  return theme;
}

export default useColorScheme;

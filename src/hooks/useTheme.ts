import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import { lightTheme } from '../providers/ThemeProvider';

export interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  isDarkMode: boolean; // Alias for isDark for compatibility
  colors: typeof lightTheme.colors;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Додаємо додаткові властивості для зручності
  const extendedContext = {
    ...context,
    isDarkMode: context.isDark,
    colors: context.theme.colors
  };
  
  return extendedContext as ThemeContextType;
}; 
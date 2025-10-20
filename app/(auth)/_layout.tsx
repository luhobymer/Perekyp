import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '../../src/hooks/useColorScheme';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

// Створюємо простий тимчасовий ThemeProvider замість імпорту
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({
  theme: { 
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
      white: '#FFFFFF',
    } 
  }
});

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: { 
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
        white: '#FFFFFF',
      } 
    } }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NavigationThemeProvider>
  );
} 
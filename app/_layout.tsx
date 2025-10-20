import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, Redirect, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '../src/providers/AuthProvider';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { useAuth } from '../src/hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import '../src/utils/i18n'; // Явний імпорт i18n
import { getItem } from '../src/utils/storage';
import i18n from 'i18next';
import GlobalBottomBar from '../components/GlobalBottomBar';
import * as Font from 'expo-font';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Основний макет додатку
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Завантажуємо шрифти та мову перед відображенням додатку
    async function prepare() {
      try {
        // Завантаження шрифтів
        await Font.loadAsync({
          // Використовуємо наявний шрифт
          'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
        
        // Завантажуємо мову при старті
        const savedLanguage = await getItem('language');
        console.log('[RootLayout] Завантажена мова:', savedLanguage);
        
        if (savedLanguage) {
          console.log('[RootLayout] Встановлюємо мову:', savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
        
        // Позначаємо, що шрифти завантажено
        setFontsLoaded(true);
      } catch (error) {
        console.error('[RootLayout] Помилка при підготовці додатку:', error);
      } finally {
        // Приховуємо splash screen після завантаження всіх ресурсів
        await SplashScreen.hideAsync();
      }
    }
    
    prepare();
  }, []);

  // Показуємо splash screen, доки не завантажаться шрифти
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </View>
        </AuthProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}

// Навігація в залежності від стану автентифікації
function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  
  // Перевіряємо, чи користувач на сторінці авторизації
  const isInAuthGroup = segments[0] === '(auth)';
  
  // Відображаємо нижнє меню тільки якщо користувач авторизований і не на сторінці авторизації
  const showBottomBar = user && !isInAuthGroup;
  
  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'SpaceMono',
        },
      }} />
      {showBottomBar && <GlobalBottomBar />}
    </>
  );
}

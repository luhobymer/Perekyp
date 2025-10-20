import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';
import { loadSavedLanguage } from './utils/i18n';
import GlobalTabBar from './components/GlobalTabBar';
import { initSentry } from './utils/sentry';

/**
 * @component App
 * @description Головний компонент додатку, який ініціалізує основні провайдери та налаштування
 */
const App: React.FC = () => {
  // Ініціалізація додатку
  useEffect(() => {
    // Завантажуємо мову при запуску
    loadSavedLanguage();
    
    // Ініціалізуємо Sentry для моніторингу помилок
    initSentry();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <View style={styles.container}>
                <AppNavigator />
                <GlobalTabBar />
              </View>
              <StatusBar />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

// Обгортаємо додаток в Sentry для відстеження помилок
const SentryApp = Sentry.wrap(App);

export default SentryApp;

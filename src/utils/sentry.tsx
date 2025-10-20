import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

/**
 * @fileoverview Утиліта для налаштування та роботи з Sentry в додатку
 * @description Містить функції для ініціалізації Sentry, відстеження помилок та подій
 */

// Визначення типу середовища
type Environment = 'development' | 'staging' | 'production';

/**
 * @interface SentryConfig
 * @description Конфігурація для ініціалізації Sentry
 */
interface SentryConfig {
  dsn: string;
  environment?: Environment;
  enableAutoSessionTracking?: boolean;
  sessionTrackingIntervalMillis?: number;
  debug?: boolean;
  enableNativeNagger?: boolean;
  tracesSampleRate?: number;
}

/**
 * @function getDefaultConfig
 * @description Повертає конфігурацію Sentry за замовчуванням
 * @returns {SentryConfig} Конфігурація Sentry
 */
const getDefaultConfig = (): SentryConfig => {
  // Отримання поточного середовища
  const environment = __DEV__ ? 'development' : 'production';
  
  return {
    dsn: Constants.expoConfig?.extra?.sentryDsn || '',
    environment,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    debug: __DEV__,
    enableNativeNagger: false,
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
  };
};

/**
 * @function initSentry
 * @description Ініціалізує Sentry з вказаною конфігурацією
 * @param {Partial<SentryConfig>} customConfig - Кастомна конфігурація, яка перезаписує значення за замовчуванням
 */
export const initSentry = (customConfig: Partial<SentryConfig> = {}): void => {
  try {
    const config = { ...getDefaultConfig(), ...customConfig };
    
    // Перевірка наявності DSN
    if (!config.dsn) {
      console.warn('Sentry DSN not provided. Sentry will not be initialized.');
      return;
    }
    
    // Ініціалізація Sentry
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      enableAutoSessionTracking: config.enableAutoSessionTracking,
      sessionTrackingIntervalMillis: config.sessionTrackingIntervalMillis,
      debug: config.debug,
      enableNativeNagger: config.enableNativeNagger,
      tracesSampleRate: config.tracesSampleRate,
      
      // Додаткові налаштування
      beforeSend: (event) => {
        // Фільтрація подій, які не потрібно відправляти
        if (event.exception?.values?.[0]?.value?.includes('Network request failed')) {
          return null;
        }
        
        return event;
      },
    });
    
    // Додавання інформації про додаток
    Sentry.setTag('platform', Platform.OS);
    Sentry.setTag('appVersion', Constants.expoConfig?.version || 'unknown');
    Sentry.setTag('appName', Constants.expoConfig?.name || 'PerekypApp');
    
    console.log(`Sentry initialized for ${config.environment} environment`);
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

/**
 * @function setUserContext
 * @description Встановлює контекст користувача для Sentry
 * @param {Object} user - Інформація про користувача
 * @param {string} user.id - ID користувача
 * @param {string} [user.email] - Email користувача
 * @param {string} [user.username] - Ім'я користувача
 */
export const setUserContext = (user: { id: string; email?: string; username?: string }): void => {
  try {
    Sentry.setUser(user);
  } catch (error) {
    console.error('Failed to set Sentry user context:', error);
  }
};

/**
 * @function clearUserContext
 * @description Очищає контекст користувача для Sentry
 */
export const clearUserContext = (): void => {
  try {
    Sentry.setUser(null);
  } catch (error) {
    console.error('Failed to clear Sentry user context:', error);
  }
};

/**
 * @function captureException
 * @description Відстежує помилку в Sentry
 * @param {Error} error - Помилка для відстеження
 * @param {Object} [extras] - Додаткова інформація про помилку
 */
export const captureException = (error: Error, extras?: Record<string, any>): void => {
  try {
    if (extras) {
      Sentry.withScope((scope) => {
        Object.entries(extras).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  } catch (e) {
    console.error('Failed to capture exception in Sentry:', e);
  }
};

/**
 * @function captureMessage
 * @description Відстежує повідомлення в Sentry
 * @param {string} message - Повідомлення для відстеження
 * @param {Sentry.Severity} [level=Sentry.Severity.Info] - Рівень важливості повідомлення
 */
export const captureMessage = (
  message: string,
  level: Sentry.Severity = Sentry.Severity.Info
): void => {
  try {
    Sentry.captureMessage(message, level);
  } catch (e) {
    console.error('Failed to capture message in Sentry:', e);
  }
};

/**
 * @function startTransaction
 * @description Починає відстеження транзакції в Sentry
 * @param {string} name - Назва транзакції
 * @param {string} [operation='navigation'] - Тип операції
 * @returns {Sentry.Transaction} Об'єкт транзакції
 */
export const startTransaction = (
  name: string,
  operation: string = 'navigation'
): Sentry.Transaction => {
  return Sentry.startTransaction({
    name,
    op: operation,
  });
};

/**
 * Інтерфейс для властивостей компонента відображення помилки
 */
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Компонент для відображення помилки
 */
const ErrorFallback = ({ error, resetError }: ErrorFallbackProps): React.ReactElement => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Щось пішло не так</Text>
      <Text style={styles.errorMessage}>Виникла помилка при відображенні цього компонента.</Text>
      <Text style={styles.errorDetails}>Технічна інформація: {error?.message || error?.toString()}</Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetError}>
        <Text style={styles.resetButtonText}>Спробувати знову</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * @function withSentryErrorBoundary
 * @description HOC для обгортання компонентів в Sentry ErrorBoundary
 * @param {React.ComponentType} Component - Компонент для обгортання
 * @returns {React.ComponentType} Компонент, обгорнутий в ErrorBoundary
 */
export const withSentryErrorBoundary = <P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> => {
  // Створюємо новий компонент, який обгортає оригінальний в ErrorBoundary
  const WrappedComponent = (props: P): React.ReactElement => (
    <Sentry.ErrorBoundary 
      fallback={({ error, resetError }: { error: Error; resetError: () => void }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      <Component {...props} />
    </Sentry.ErrorBoundary>
  );
  
  // Копіюємо статичні властивості та методи
  const componentName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `WithSentryErrorBoundary(${componentName})`;
  
  return WrappedComponent;
};

// Стилі для компонентів помилок
const styles = StyleSheet.create({
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 235, 235, 0.8)',
    borderRadius: 8,
    margin: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  errorMessage: {
    marginTop: 10,
    color: '#666',
  },
  errorDetails: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  resetButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default {
  initSentry,
  setUserContext,
  clearUserContext,
  captureException,
  captureMessage,
  startTransaction,
  withSentryErrorBoundary,
  Severity: Sentry.Severity,
};

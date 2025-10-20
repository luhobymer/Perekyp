import Constants from 'expo-constants';
import { AppEnvironment, ExpoEnvVariables } from '../types/env';

/**
 * Отримує значення змінної оточення Expo
 * 
 * @param key - Ключ змінної оточення
 * @param defaultValue - Значення за замовчуванням, якщо змінна не знайдена
 * @returns Значення змінної оточення або значення за замовчуванням
 */
export function getExpoEnvVariable<K extends keyof ExpoEnvVariables>(
  key: K,
  defaultValue?: ExpoEnvVariables[K]
): ExpoEnvVariables[K] {
  const expoKey = `EXPO_PUBLIC_${key}`;
  
  if (
    Constants.expoConfig?.extra &&
    expoKey in Constants.expoConfig.extra
  ) {
    return Constants.expoConfig.extra[expoKey] as ExpoEnvVariables[K];
  }
  
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  throw new Error(`Змінна оточення ${expoKey} не знайдена і не вказано значення за замовчуванням`);
}

/**
 * Отримує поточне середовище додатку
 * 
 * @returns Поточне середовище додатку
 */
export function getAppEnvironment(): AppEnvironment {
  try {
    return getExpoEnvVariable('APP_ENV', 'development');
  } catch (error) {
    console.warn('Не вдалося отримати середовище додатку, використовується development за замовчуванням');
    return 'development';
  }
}

/**
 * Перевіряє, чи запущено додаток у середовищі розробки
 * 
 * @returns true, якщо додаток запущено у середовищі розробки
 */
export function isDevelopment(): boolean {
  return getAppEnvironment() === 'development';
}

/**
 * Перевіряє, чи запущено додаток у тестовому середовищі
 * 
 * @returns true, якщо додаток запущено у тестовому середовищі
 */
export function isStaging(): boolean {
  return getAppEnvironment() === 'staging';
}

/**
 * Перевіряє, чи запущено додаток у продакшн середовищі
 * 
 * @returns true, якщо додаток запущено у продакшн середовищі
 */
export function isProduction(): boolean {
  return getAppEnvironment() === 'production';
}

/**
 * Отримує версію додатку
 * 
 * @returns Версія додатку
 */
export function getAppVersion(): string {
  return getExpoEnvVariable('APP_VERSION', '1.0.0');
}

/**
 * Отримує URL API
 * 
 * @returns URL API
 */
export function getApiUrl(): string {
  return getExpoEnvVariable('API_URL', 'https://api.perekyp.com');
}

/**
 * Отримує таймаут для API запитів
 * 
 * @returns Таймаут для API запитів у мілісекундах
 */
export function getApiTimeout(): number {
  const timeout = getExpoEnvVariable('API_TIMEOUT', 30000);
  return typeof timeout === 'string' ? parseInt(timeout, 10) : timeout;
}

/**
 * Отримує час життя кешу
 * 
 * @returns Час життя кешу у мілісекундах
 */
export function getCacheTtl(): number {
  const ttl = getExpoEnvVariable('CACHE_TTL', 3600000);
  return typeof ttl === 'string' ? parseInt(ttl, 10) : ttl;
}

/**
 * Перевіряє, чи увімкнена аналітика
 * 
 * @returns true, якщо аналітика увімкнена
 */
export function isAnalyticsEnabled(): boolean {
  const enabled = getExpoEnvVariable('ANALYTICS_ENABLED', true);
  return enabled === true || enabled === 'true';
}

/**
 * Отримує мову за замовчуванням
 * 
 * @returns Мова за замовчуванням
 */
export function getDefaultLocale(): string {
  return getExpoEnvVariable('DEFAULT_LOCALE', 'uk');
}

/**
 * Отримує запасну мову
 * 
 * @returns Запасна мова
 */
export function getFallbackLocale(): string {
  return getExpoEnvVariable('FALLBACK_LOCALE', 'ru');
}

export default {
  getExpoEnvVariable,
  getAppEnvironment,
  isDevelopment,
  isStaging,
  isProduction,
  getAppVersion,
  getApiUrl,
  getApiTimeout,
  getCacheTtl,
  isAnalyticsEnabled,
  getDefaultLocale,
  getFallbackLocale,
};

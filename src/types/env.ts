/**
 * Типи для змінних оточення
 * 
 * Цей файл містить типи для змінних оточення, які використовуються в додатку.
 * Всі змінні оточення повинні бути оголошені тут для забезпечення типобезпеки.
 */

/**
 * Тип для середовища додатку
 */
export type AppEnvironment = 'development' | 'staging' | 'production';

/**
 * Інтерфейс для змінних оточення Expo
 */
export interface ExpoEnvVariables {
  // Загальні налаштування
  APP_ENV: AppEnvironment;
  APP_VERSION: string;
  
  // Локалізація
  DEFAULT_LOCALE: string;
  FALLBACK_LOCALE: string;
  
  // API
  API_URL: string;
  API_TIMEOUT: number;
  
  // Кешування
  CACHE_TTL: number;
  
  // Аналітика
  ANALYTICS_ENABLED: boolean;
}

/**
 * Інтерфейс для змінних оточення Node
 */
export interface NodeEnvVariables {
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  
  // Sentry
  SENTRY_DSN: string;
  SENTRY_AUTH_TOKEN: string;
}

/**
 * Об'єднаний інтерфейс для всіх змінних оточення
 */
export interface EnvVariables extends ExpoEnvVariables, NodeEnvVariables {}

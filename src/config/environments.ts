/**
 * @fileoverview Конфігурація середовищ для додатку
 * @description Містить налаштування для різних середовищ (розробка, тестування, продакшн)
 */

import { AppEnvironment } from '../types/env';
import {
  getAppEnvironment,
  getApiUrl,
  getCacheTtl,
  isAnalyticsEnabled,
  getDefaultLocale,
  getFallbackLocale,
} from '../utils/env';

// Типи середовищ
export type Environment = AppEnvironment;

// Базові URL для API
const API_URLS = {
  development: 'http://localhost:54321',
  staging: 'https://staging.perekyp-api.com',
  production: 'https://api.perekyp.com',
};

// Налаштування Supabase
const SUPABASE_CONFIG = {
  development: {
    url: process.env.SUPABASE_URL || 'http://localhost:54321',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
  staging: {
    url: process.env.SUPABASE_STAGING_URL || '',
    anonKey: process.env.SUPABASE_STAGING_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_STAGING_SERVICE_KEY || '',
  },
  production: {
    url: process.env.SUPABASE_PROD_URL || '',
    anonKey: process.env.SUPABASE_PROD_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_PROD_SERVICE_KEY || '',
  },
};

// Налаштування Sentry
const SENTRY_CONFIG = {
  development: {
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 1.0,
    debug: true,
  },
  staging: {
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 0.5,
    debug: true,
  },
  production: {
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 0.2,
    debug: false,
  },
};

// Налаштування для кешування
const CACHE_CONFIG = {
  development: {
    defaultTTL: getCacheTtl() || 5 * 60 * 1000, // 5 хвилин за замовчуванням
    maxEntries: 100,
  },
  staging: {
    defaultTTL: getCacheTtl() || 30 * 60 * 1000, // 30 хвилин за замовчуванням
    maxEntries: 200,
  },
  production: {
    defaultTTL: getCacheTtl() || 60 * 60 * 1000, // 1 година за замовчуванням
    maxEntries: 500,
  },
};

// Налаштування для логування
const LOGGING_CONFIG = {
  development: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false,
  },
  staging: {
    level: 'info',
    enableConsole: true,
    enableRemote: true,
  },
  production: {
    level: 'warn',
    enableConsole: false,
    enableRemote: true,
  },
};

// Визначення поточного середовища
export const getCurrentEnvironment = (): Environment => {
  return getAppEnvironment();
};

/**
 * Інтерфейс для конфігурації середовища
 */
export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
  };
  sentry: {
    dsn: string;
    tracesSampleRate: number;
    debug: boolean;
  };
  cache: {
    defaultTTL: number;
    maxEntries: number;
  };
  logging: {
    level: string;
    enableConsole: boolean;
    enableRemote: boolean;
  };
  i18n: {
    defaultLocale: string;
    fallbackLocale: string;
  };
  analytics: {
    enabled: boolean;
  };
}

// Отримання конфігурації для поточного середовища
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = getCurrentEnvironment();
  
  return {
    environment: env,
    apiUrl: getApiUrl() || API_URLS[env],
    supabase: SUPABASE_CONFIG[env],
    sentry: SENTRY_CONFIG[env],
    cache: CACHE_CONFIG[env],
    logging: LOGGING_CONFIG[env],
    i18n: {
      defaultLocale: getDefaultLocale(),
      fallbackLocale: getFallbackLocale(),
    },
    analytics: {
      enabled: isAnalyticsEnabled(),
    },
  };
};

export default getEnvironmentConfig;

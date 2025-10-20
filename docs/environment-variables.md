# Змінні оточення в PerekypApp

Цей документ описує систему змінних оточення, яка використовується в додатку PerekypApp.

## Загальна інформація

PerekypApp використовує змінні оточення для конфігурації різних аспектів додатку в різних середовищах (розробка, тестування, продакшн). Це дозволяє гнучко налаштовувати додаток без зміни коду.

## Структура змінних оточення

Змінні оточення розділені на дві категорії:

1. **Expo змінні** - доступні в коді через `Constants.expoConfig.extra` або через утиліту `getExpoEnvVariable`
2. **Node змінні** - доступні через `process.env`

## Файли конфігурації

- `.env` - основний файл з змінними оточення (не зберігається в репозиторії)
- `.env.example` - приклад файлу з змінними оточення (зберігається в репозиторії)
- `.env.development` - змінні для середовища розробки
- `.env.staging` - змінні для тестового середовища
- `.env.production` - змінні для продакшн середовища

## Доступні змінні оточення

### Загальні налаштування

| Змінна | Опис | Приклад |
|--------|------|---------|
| `EXPO_PUBLIC_APP_ENV` | Середовище додатку | `development`, `staging`, `production` |
| `EXPO_PUBLIC_APP_VERSION` | Версія додатку | `1.0.0` |

### Налаштування Supabase

| Змінна | Опис | Приклад |
|--------|------|---------|
| `SUPABASE_URL` | URL Supabase для розробки | `http://localhost:54321` |
| `SUPABASE_ANON_KEY` | Анонімний ключ Supabase для розробки | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_KEY` | Сервісний ключ Supabase для розробки | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_STAGING_URL` | URL Supabase для тестування | `https://your-staging-project.supabase.co` |
| `SUPABASE_STAGING_ANON_KEY` | Анонімний ключ Supabase для тестування | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_STAGING_SERVICE_KEY` | Сервісний ключ Supabase для тестування | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_PROD_URL` | URL Supabase для продакшн | `https://your-production-project.supabase.co` |
| `SUPABASE_PROD_ANON_KEY` | Анонімний ключ Supabase для продакшн | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_PROD_SERVICE_KEY` | Сервісний ключ Supabase для продакшн | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Налаштування Sentry

| Змінна | Опис | Приклад |
|--------|------|---------|
| `SENTRY_DSN` | DSN для Sentry | `https://your-sentry-dsn` |
| `SENTRY_AUTH_TOKEN` | Токен авторизації Sentry | `your-sentry-auth-token` |

### Налаштування для i18n

| Змінна | Опис | Приклад |
|--------|------|---------|
| `EXPO_PUBLIC_DEFAULT_LOCALE` | Мова за замовчуванням | `uk` |
| `EXPO_PUBLIC_FALLBACK_LOCALE` | Запасна мова | `ru` |

### Налаштування для API

| Змінна | Опис | Приклад |
|--------|------|---------|
| `EXPO_PUBLIC_API_URL` | URL API | `https://api.perekyp.com` |
| `EXPO_PUBLIC_API_TIMEOUT` | Таймаут для API запитів у мілісекундах | `30000` |

### Налаштування для кешування

| Змінна | Опис | Приклад |
|--------|------|---------|
| `EXPO_PUBLIC_CACHE_TTL` | Час життя кешу у мілісекундах | `3600000` |

### Налаштування для аналітики

| Змінна | Опис | Приклад |
|--------|------|---------|
| `EXPO_PUBLIC_ANALYTICS_ENABLED` | Чи увімкнена аналітика | `true` |

## Використання в коді

### Типізований доступ до змінних оточення

```typescript
import { getApiUrl, getCacheTtl, isAnalyticsEnabled } from '../utils/env';

// Отримання URL API
const apiUrl = getApiUrl();

// Отримання часу життя кешу
const cacheTtl = getCacheTtl();

// Перевірка, чи увімкнена аналітика
if (isAnalyticsEnabled()) {
  // Логіка аналітики
}
```

### Доступ до конфігурації середовища

```typescript
import { getEnvironmentConfig } from '../config/environments';

// Отримання конфігурації для поточного середовища
const config = getEnvironmentConfig();

// Використання конфігурації
const { apiUrl, supabase, sentry, cache, logging } = config;
```

## Додавання нових змінних оточення

1. Додайте нову змінну до файлу `.env.example`
2. Оновіть типи в `src/types/env.ts`
3. Додайте функцію для отримання змінної в `src/utils/env.ts`
4. Оновіть конфігурацію середовища в `src/config/environments.ts` (якщо потрібно)

## Безпека

Ніколи не зберігайте секретні ключі в репозиторії. Використовуйте файл `.env` для локальної розробки та CI/CD секрети для деплою.

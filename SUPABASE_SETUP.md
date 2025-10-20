# 🔧 Налаштування Supabase для PerekypApp

## Крок 1: Отримати API ключ

1. Відкрийте Supabase Dashboard:
   ```
   https://kjnbhiyrxtdaohxsynx.supabase.co/project/_/settings/api
   ```

2. Знайдіть розділ **"Project API keys"**

3. Скопіюйте **"anon public"** ключ (довгий рядок, що починається з `eyJ...`)

## Крок 2: Оновити .env файл

1. Відкрийте файл `.env` в корені проекту

2. Замініть placeholder на справжній ключ:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://kjnbhiyrxtdaohxsynx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Збережіть файл

## Крок 3: Перевірити підключення

Запустіть детальну перевірку:

```bash
node scripts/checkDatabaseDetailed.js
```

Цей скрипт покаже:
- ✅ Які таблиці існують
- 📊 Скільки записів в кожній таблиці
- 🔍 Структуру критичних таблиць
- ⚠️ Проблеми та рекомендації

## Очікувані таблиці

### 🚗 Основні таблиці додатку:
- ✅ `cars` - автомобілі
- ✅ `car_expenses` - витрати
- ✅ `car_documents` - документи
- ✅ `car_images` - зображення
- ✅ `mileage_history` - історія пробігу
- ✅ `buyers` - покупці
- ✅ `service_history` - обслуговування
- ✅ `ownership_history` - історія володіння

### 🏢 Системні таблиці:
- ✅ `profiles` - профілі користувачів

### ⚠️ Непотрібні таблиці (можна видалити):
- ❌ `categories` - для e-commerce
- ❌ `products` - для e-commerce
- ❌ `orders` - для e-commerce
- ❌ `order_items` - для e-commerce

## Можливі проблеми

### Помилка: "Invalid API key"
**Рішення:** Переконайтеся, що скопіювали **anon public** ключ, а не service_role

### Помилка: "Table does not exist"
**Рішення:** Виконайте міграцію `database/schema.sql` через Supabase Dashboard

### Помилка: "Row Level Security"
**Рішення:** Потрібно увійти в додаток або вимкнути RLS для тестування

## Додаткові скрипти

### Простий огляд:
```bash
node scripts/checkDatabase.js
```

### SQL запит:
Виконайте в Supabase SQL Editor:
```bash
scripts/check-database.sql
```

### TypeScript версія:
```bash
npx ts-node scripts/checkDatabase.ts
```

## Корисні посилання

- 📊 Table Editor: https://kjnbhiyrxtdaohxsynx.supabase.co/project/_/editor
- 🔑 API Settings: https://kjnbhiyrxtdaohxsynx.supabase.co/project/_/settings/api
- 💾 SQL Editor: https://kjnbhiyrxtdaohxsynx.supabase.co/project/_/sql
- 📈 Database: https://kjnbhiyrxtdaohxsynx.supabase.co/project/_/database/tables

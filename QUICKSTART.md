# 🚀 Швидкий старт PerekypApp

## ⚡ За 5 хвилин до запуску

### 1️⃣ Встановлення (2 хв)
```bash
npm install
```

### 2️⃣ Налаштування Supabase (2 хв)

Відкрийте `.env` файл і додайте ваші ключі:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Де взяти ключі?**
1. Відкрийте [Supabase Dashboard](https://app.supabase.com)
2. Виберіть ваш проект
3. Settings → API
4. Скопіюйте `Project URL` та `anon public key`

### 3️⃣ Запуск (1 хв)
```bash
npm start
```

Натисніть:
- `a` - для Android
- `i` - для iOS
- `w` - для Web

---

## ✅ Перевірка бази даних

```bash
node scripts/checkDatabaseDetailed.js
```

Має показати: ✅ База даних готова до роботи (100%)!

---

## 📖 Корисні команди

```bash
# Розробка
npm start              # Запуск Dev Server
npm run android        # Запуск на Android
npm run ios            # Запуск на iOS
npm run web            # Запуск Web версії

# Перевірка коду
npm run lint           # ESLint перевірка
npx tsc --noEmit       # TypeScript перевірка

# База даних
node scripts/checkDatabaseAdmin.js  # Адмін перевірка БД
```

---

## 🗄️ Налаштування бази даних

### Автоматично (рекомендовано):
База даних вже налаштована! Просто використовуйте ваші ключі.

### Вручну (якщо потрібно):
1. Відкрийте [Supabase SQL Editor](https://app.supabase.com)
2. Виконайте `database/schema.sql`
3. Виконайте `scripts/setup-rls-final.sql` (для безпеки)

---

## 🎨 Особливості

- ✅ React Native + Expo
- ✅ TypeScript
- ✅ Supabase Backend
- ✅ Offline режим
- ✅ Мультимовність (UA/RU)
- ✅ Темна/світла тема

---

## 📚 Додаткова інформація

- [README.md](README.md) - повна документація
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - детальне налаштування Supabase
- [TODO.md](TODO.md) - план розробки

---

## 🆘 Проблеми?

### База даних не доступна
```bash
node scripts/checkDatabaseDetailed.js
```
Перевірте URL та API ключ в `.env`

### TypeScript помилки
```bash
npx tsc --noEmit
```
Виправте помилки типізації

### Expo не запускається
```bash
npm install --force
npx expo start --clear
```

---

**Готово! 🎉 Тепер можна розробляти!**

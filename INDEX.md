# 📚 Документація PerekypApp

Швидка навігація по всій документації проекту.

---

## 🚀 Початок роботи

### **[QUICKSTART.md](QUICKSTART.md)** ⚡
**За 5 хвилин до запуску**
- Швидке встановлення
- Налаштування Supabase
- Перші команди

→ **Почніть звідси!**

---

## 📖 Основна документація

### **[README.md](README.md)** 📱
**Повна документація додатку**
- Огляд функцій
- Технічний стек
- Детальна інструкція
- Команди розробки

### **[TODO.md](TODO.md)** ✅
**План розробки**
- Поточні завдання
- Майбутні фічі
- Пріоритети

### **[typescript-migration-plan.md](typescript-migration-plan.md)** 🔷
**TypeScript міграція**
- Етапи міграції
- Прогрес
- Типізація

---

## 🗄️ База даних

### **[database/README.md](database/README.md)** 
**Структура бази даних**
- Схема таблиць
- Поля та типи
- SQL запити
- Налаштування RLS

### **[database/schema.sql](database/schema.sql)**
**SQL схема для створення БД**

### **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** 🔧
**Налаштування Supabase**
- Отримання API ключів
- Підключення
- Перевірка

---

## 🔧 Скрипти

### **[scripts/README.md](scripts/README.md)**
**Документація всіх скриптів**
- Перевірка БД
- Утиліти
- SQL скрипти
- Приклади використання

### Основні скрипти:
- `scripts/checkDatabaseDetailed.js` - Детальна перевірка БД
- `scripts/checkDatabaseAdmin.js` - Адмін перевірка
- `scripts/setup-rls-final.sql` - Налаштування безпеки

---

## 📂 Структура проекту

```
PerekypApp/
├── 📱 app/                    # Екрани Expo Router
│   ├── (auth)/               # Автентифікація
│   ├── (tabs)/               # Головні екрани
│   └── ...                   # Інші маршрути
│
├── 🎨 components/            # React компоненти
├── 🔧 src/                   # Вихідний код
│   ├── hooks/               # Custom хуки
│   ├── services/            # API сервіси
│   ├── utils/               # Утиліти
│   ├── types/               # TypeScript типи
│   └── store/               # Zustand стор
│
├── 🗄️ database/              # Схема БД
├── 🔧 scripts/               # Утиліти
├── 🌍 locales/               # Переклади (UA/RU)
├── 🖼️ assets/                # Зображення, шрифти
└── 📚 docs/                  # Додаткова документація
```

---

## 🎯 Швидкі посилання

### Розробка:
```bash
npm start                # Запуск Dev Server
npm run android          # Android
npm run ios              # iOS
npm run web              # Web
```

### Перевірка:
```bash
npm run lint                          # ESLint
npx tsc --noEmit                      # TypeScript
node scripts/checkDatabaseDetailed.js # База даних
```

### Корисні посилання:
- 🌐 [Supabase Dashboard](https://app.supabase.com)
- 📊 [Expo Dashboard](https://expo.dev)
- 📖 [React Native Docs](https://reactnative.dev)
- 🔷 [TypeScript Docs](https://www.typescriptlang.org)

---

## 🆘 Потрібна допомога?

### За темою:
- 🚀 **Початок роботи** → [QUICKSTART.md](QUICKSTART.md)
- 🗄️ **База даних** → [database/README.md](database/README.md)
- 🔧 **Скрипти** → [scripts/README.md](scripts/README.md)
- 📱 **Функціонал** → [README.md](README.md)
- 🔑 **Supabase** → [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### Часті проблеми:
1. **База даних недоступна** → Перевірте `.env` та API ключі
2. **TypeScript помилки** → Запустіть `npx tsc --noEmit`
3. **Expo не запускається** → Виконайте `npm install --force`
4. **RLS блокує доступ** → Виконайте `scripts/setup-rls-final.sql`

---

## 📝 Зміст всіх документів

| Файл | Опис | Коли читати |
|------|------|-------------|
| **QUICKSTART.md** | Швидкий старт за 5 хвилин | Перше знайомство |
| **README.md** | Повна документація | Детальне вивчення |
| **INDEX.md** | Цей файл - навігація | Для пошуку інфо |
| **TODO.md** | План розробки | Перед додаванням фіч |
| **SUPABASE_SETUP.md** | Налаштування БД | При першому запуску |
| **database/README.md** | Структура БД | Робота з даними |
| **scripts/README.md** | Документація скриптів | Використання утиліт |
| **typescript-migration-plan.md** | Міграція на TS | Історичний контекст |

---

**Готові почати? → [QUICKSTART.md](QUICKSTART.md)** 🚀

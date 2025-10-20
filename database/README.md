# 🗄️ База даних PerekypApp

PostgreSQL база даних через Supabase

---

## 📋 Структура

### Основні таблиці додатку:

#### 🚗 `cars` - Автомобілі
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- brand (TEXT) - Марка
- model (TEXT) - Модель
- year (INT) - Рік випуску
- vin (TEXT) - VIN номер
- registration_number (TEXT) - Держ. номер
- engine_type (TEXT) - Тип двигуна
- engine_volume (NUMERIC) - Об'єм двигуна
- color (TEXT) - Колір
- mileage (INT) - Пробіг
- status (TEXT) - Статус (checking/active/sold/reserved)
- purchase_price (DECIMAL) - Ціна покупки
- sale_price (DECIMAL) - Ціна продажу
- purchase_date (TIMESTAMP) - Дата покупки
- sale_date (TIMESTAMP) - Дата продажу
- notes (TEXT) - Нотатки
- created_at, updated_at
```

#### 💰 `car_expenses` - Витрати на авто
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- expense_type (TEXT) - Тип витрат (purchase/repair/service/parts/insurance/tax/other)
- amount (DECIMAL) - Сума
- date (TIMESTAMP) - Дата
- description (TEXT) - Опис
- receipt_url (TEXT) - Посилання на чек
- created_at, updated_at
```

#### 📊 `mileage_history` - Історія пробігу
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- mileage (INT) - Пробіг
- date (TIMESTAMP) - Дата
- notes (TEXT) - Нотатки
- created_at
```

#### 📄 `car_documents` - Документи авто
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- document_type (TEXT) - Тип документу
- file_name (TEXT) - Назва файлу
- file_url (TEXT) - URL файлу
- expiry_date (TIMESTAMP) - Термін дії
- created_at
```

#### 🖼️ `car_images` - Зображення авто
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- image_url (TEXT) - URL зображення
- is_primary (BOOLEAN) - Головне фото
- order (INT) - Порядок відображення
- created_at
```

#### 👤 `buyers` - Потенційні покупці
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- name (TEXT) - Ім'я
- phone (TEXT) - Телефон
- email (TEXT) - Email
- notes (TEXT) - Нотатки
- created_at, updated_at
```

#### 🔧 `service_history` - Історія обслуговування
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- service_type (TEXT) - Тип роботи
- description (TEXT) - Опис
- cost (DECIMAL) - Вартість
- service_date (TIMESTAMP) - Дата
- created_at
```

#### 📋 `ownership_history` - Історія володіння
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- owner_name (TEXT) - Власник
- start_date (TIMESTAMP) - Початок
- end_date (TIMESTAMP) - Кінець
- notes (TEXT) - Нотатки
- created_at
```

#### 💬 `status_comments` - Коментарі до статусів
```sql
- id (UUID, PK)
- car_id (UUID, FK → cars)
- comment (TEXT) - Коментар
- created_at
```

---

### Системні таблиці:

#### 👥 `profiles` - Профілі користувачів
```sql
- id (UUID, PK, FK → auth.users)
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- avatar_url (TEXT)
- created_at, updated_at
```

---

## 🔐 Row Level Security (RLS)

Всі таблиці захищені RLS політиками:

### Політики доступу:
- **SELECT** (читання) - дозволено всім ✅
- **INSERT** (додавання) - тільки авторизованим користувачам 🔒
- **UPDATE** (оновлення) - тільки власникам авто 🔒
- **DELETE** (видалення) - тільки власникам авто 🔒

### Налаштування RLS:
Виконайте SQL скрипт:
```bash
scripts/setup-rls-final.sql
```

---

## 🚀 Встановлення

### 1. Створіть проект в Supabase
1. Зайдіть на [app.supabase.com](https://app.supabase.com)
2. Створіть новий проект
3. Дочекайтесь завершення ініціалізації

### 2. Виконайте схему БД
1. Відкрийте SQL Editor в Supabase Dashboard
2. Скопіюйте вміст `database/schema.sql`
3. Вставте і натисніть RUN
4. Дочекайтесь виконання (20-30 сек)

### 3. Налаштуйте RLS політики
1. Відкрийте SQL Editor
2. Скопіюйте вміст `scripts/setup-rls-final.sql`
3. Вставте і натисніть RUN

### 4. Перевірте підключення
```bash
node scripts/checkDatabaseDetailed.js
```

Маєте побачити: ✅ База даних готова до роботи (100%)!

---

## 🔧 Корисні SQL запити

### Підрахунок записів у всіх таблицях:
```sql
SELECT 
  'cars' as table_name, COUNT(*) as count FROM cars
UNION ALL
SELECT 'car_expenses', COUNT(*) FROM car_expenses
UNION ALL
SELECT 'mileage_history', COUNT(*) FROM mileage_history;
```

### Топ-5 авто з найбільшими витратами:
```sql
SELECT 
  c.brand,
  c.model,
  SUM(e.amount) as total_expenses
FROM cars c
LEFT JOIN car_expenses e ON c.id = e.car_id
GROUP BY c.id, c.brand, c.model
ORDER BY total_expenses DESC
LIMIT 5;
```

### Автомобілі без документів:
```sql
SELECT c.* 
FROM cars c
LEFT JOIN car_documents d ON c.id = d.car_id
WHERE d.id IS NULL;
```

---

## 📊 Міграції

Міграції знаходяться в `supabase/migrations/`:

- `20240320000000_initial_schema.sql` - Початкова схема (застаріла, не використовуйте)
- `20240320000003_notifications.sql` - Сповіщення

**Рекомендація:** Використовуйте `database/schema.sql` для нових проектів.

---

## 🆘 Вирішення проблем

### База даних недоступна
1. Перевірте URL та API ключ в `.env`
2. Перевірте статус проекту в Supabase Dashboard
3. Запустіть `node scripts/checkDatabaseDetailed.js`

### RLS блокує доступ
1. Виконайте `scripts/setup-rls-final.sql`
2. Або тимчасово відключіть RLS в Supabase Dashboard

### Таблиці не створені
1. Виконайте `database/schema.sql` в SQL Editor
2. Дочекайтесь завершення
3. Перевірте через Table Editor

---

**Більше інформації:** [SUPABASE_SETUP.md](../SUPABASE_SETUP.md)

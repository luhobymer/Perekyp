# 🗄️ Supabase Міграції

## 📋 Поточний стан

### ✅ Таблиці в БД (що використовуються):
- `cars` - Автомобілі
- `car_expenses` - Витрати
- `car_documents` - Документи
- `car_images` - Зображення авто
- `mileage_history` - Історія пробігу
- `buyers` - Покупці
- `service_history` - Історія обслуговування
- `ownership_history` - Історія володіння
- `status_comments` - Коментарі
- `profiles` - Профілі користувачів

### ❌ Непотрібні таблиці (можна видалити):
- `categories` (e-commerce, не використовується)
- `products` (e-commerce, не використовується)
- `orders` (e-commerce, не використовується)
- `order_items` (e-commerce, не використовується)

---

## 🔧 Видалення непотрібних таблиць

Якщо хочете видалити e-commerce таблиці:

1. Відкрийте [Supabase SQL Editor](https://app.supabase.com)
2. Виконайте скрипт: `scripts/cleanup-ecommerce-tables.sql`

---

## 📝 Файли міграцій

### `20240320000000_initial_schema.sql`
**Статус:** Застаріла міграція (містить e-commerce схему)

Ця міграція створює:
- profiles (потрібна) ✅
- categories, products, orders, order_items (не потрібні) ❌

**Рекомендація:** Не використовувати для нових проектів

### `20240320000003_notifications.sql`
**Статус:** Активна

Створює таблицю сповіщень для додатку.

---

## 🚀 Для нових проектів

Замість старих міграцій використовуйте:

### `database/schema.sql`
Містить правильну схему для додатку автоперекупу:
- cars
- expenses
- mileage_history
- sales
- car_documents
- user_settings

**Як використати:**
1. Створіть новий проект в Supabase
2. Відкрийте SQL Editor
3. Виконайте `database/schema.sql`
4. Виконайте `scripts/setup-rls-final.sql`

---

## ⚠️ Важливо

**Міграції в `supabase/migrations/` застарілі!**

Для нових проектів використовуйте `database/schema.sql`.

Для поточного проекту - БД вже налаштована і працює ✅

---

## 🆘 Якщо щось не так

### Перевірити стан БД:
```bash
node scripts/checkDatabaseDetailed.js
```

### Видалити непотрібне:
```sql
-- Виконайте в SQL Editor
scripts/cleanup-ecommerce-tables.sql
```

---

**Більше інфо:** [database/README.md](../database/README.md)

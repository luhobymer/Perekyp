# 🚀 ШВИДКИЙ СТАРТ: Додавання тестових даних

## Крок 1: Відкрийте Supabase Dashboard

1. Перейдіть на: https://supabase.com/dashboard
2. Увійдіть в акаунт
3. Оберіть проект **PerekypApp**

---

## Крок 2: Відкрийте SQL Editor

1. В лівому меню натисніть **SQL Editor**
2. Або: **Database** → **SQL Editor**
3. Натисніть **New Query**

---

## Крок 3: Виконайте SQL скрипт

### Варіант А: Через файл

1. Відкрийте файл: `scripts/add-test-data.sql`
2. Скопіюйте **весь** вміст (Ctrl+A, Ctrl+C)
3. Вставте в SQL Editor (Ctrl+V)
4. Натисніть **Run** (або Ctrl+Enter)

### Варіант Б: Швидкий скрипт (Copy-Paste)

```sql
-- ШВИДКЕ ДОДАВАННЯ ТЕСТОВИХ ДАНИХ
-- Для користувача: luhobymer@gmail.com

-- 1. Автомобілі
INSERT INTO cars (user_id, brand, model, year, vin, reg_number, body_type, engine_type, engine_volume, transmission, color, mileage, purchase_price, status, notes)
VALUES 
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), 'Toyota', 'Camry', 2019, 'JTNBF46K803123456', 'AA1234BB', 'sedan', 'petrol', 2.5, 'automatic', 'silver', 85000, 15000, 'active', 'Куплено на аукціоні'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), 'BMW', 'X5', 2018, 'WBAJB8C55JG876543', 'BC5678DE', 'suv', 'diesel', 3.0, 'automatic', 'black', 120000, 25000, 'repairing', 'На ремонті'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), 'Volkswagen', 'Golf', 2020, 'WVWZZZ1KZLW234567', 'EF9012GH', 'hatchback', 'petrol', 1.4, 'manual', 'white', 45000, 12000, 'sold', 'Продано');

-- 2. Витрати
INSERT INTO car_expenses (user_id, car_id, category, amount, description, date)
VALUES
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1), 'purchase', 15000, 'Купівля Toyota Camry', NOW() - INTERVAL '3 months'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1), 'repair', 450, 'Гальмівні колодки', NOW() - INTERVAL '2 months'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1), 'purchase', 25000, 'Купівля BMW X5', NOW() - INTERVAL '2 months'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1), 'parts', 1200, 'Запчастини підвіски', NOW() - INTERVAL '1 month'),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), (SELECT id FROM cars WHERE reg_number = 'EF9012GH' LIMIT 1), 'purchase', 12000, 'Купівля VW Golf', NOW() - INTERVAL '4 months');

-- 3. Сповіщення
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), 'Вітаємо!', 'Тестові дані успішно додано', 'success', false),
((SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'), 'Нагадування', 'Перевірте страховку на Camry', 'warning', false);

-- ПЕРЕВІРКА
SELECT 'Cars' as table_name, COUNT(*) as count FROM cars WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')
UNION ALL
SELECT 'Expenses', COUNT(*) FROM car_expenses WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
```

---

## Крок 4: Перевірте результат

Після виконання побачите:

```
table_name       | count
-----------------|------
Cars             | 3
Expenses         | 5
Notifications    | 2
```

✅ Якщо бачите числа - дані додано!

---

## Крок 5: Перевірте в додатку

### 5.1 Оновіть Metro Bundler

```bash
# У терміналі де запущено Metro, натисніть:
r  # reload
```

### 5.2 Оновіть браузер

```
Ctrl + Shift + R  # hard reload
```

### 5.3 Увійдіть в додаток

- Email: `luhobymer@gmail.com`
- Пароль: *(ваш пароль)*

---

## Крок 6: Перевірте екрани

Має відобразитись:

### ✅ Головна сторінка
- [ ] 3 автомобілі
  - Toyota Camry (активний)
  - BMW X5 (на ремонті)
  - VW Golf (продано)

### ✅ Витрати
- [ ] 5 витрат
- [ ] Загальна сума: $52,650

### ✅ Сповіщення
- [ ] 2 сповіщення
- [ ] "Вітаємо!" та "Нагадування"

---

## 🔍 Перевірка через Node.js

```bash
# Автоматична перевірка
node scripts/check-test-data.js
```

Має показати:
```
✅ Автомобілі: 3
✅ Витрати: 5
✅ Сповіщення: 2
```

---

## ⚠️ Якщо дані не відображаються

### Проблема 1: Користувач не знайдений

```
❌ Error: No rows returned
```

**Рішення:** Зареєструйтесь через додаток:
1. Відкрийте http://localhost:8081
2. Натисніть "Register"
3. Email: `luhobymer@gmail.com`
4. Створіть пароль
5. Підтвердіть email (якщо потрібно)

### Проблема 2: Дублювання даних

```
❌ Error: duplicate key value violates unique constraint
```

**Рішення:** Видаліть старі дані:
```sql
DELETE FROM car_expenses WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM cars WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM notifications WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
```

Потім запустіть скрипт знову.

### Проблема 3: RLS Policy

```
❌ Error: new row violates row-level security policy
```

**Рішення:** Перевірте RLS політики:
```sql
-- Тимчасово вимкніть RLS для тестування
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE car_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Додайте дані

-- Увімкніть назад
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Що входить в тестові дані

### Автомобілі
```
🚗 Toyota Camry 2019
   Status: Active
   Пробіг: 85,000 км
   Ціна: $15,000

🚙 BMW X5 2018
   Status: Repairing
   Пробіг: 120,000 км
   Ціна: $25,000

🚗 VW Golf 2020
   Status: Sold
   Пробіг: 45,000 км
   Ціна: $12,000
```

### Витрати
```
💰 Загалом: $52,650
   - Купівлі: $52,000
   - Ремонти: $450
   - Запчастини: $1,200
```

---

## ✅ Готово!

Тепер у вас є повний набір тестових даних для перевірки всіх функцій додатку!

**Наступні кроки:**
1. ✅ Перевірте всі екрани
2. ✅ Спробуйте додати нову витрату
3. ✅ Оновіть пробіг
4. ✅ Перевірте фільтри та сортування

**Гарного тестування!** 🚀

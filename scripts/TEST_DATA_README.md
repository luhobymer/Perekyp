# ІНСТРУКЦІЯ: Додавання тестових даних

## Що буде додано

### 📊 Тестові дані для користувача `luhobymer@gmail.com`:

1. **3 автомобілі:**
   - Toyota Camry 2019 (статус: активний)
   - BMW X5 2018 (статус: на ремонті)
   - Volkswagen Golf 2020 (статус: продано)

2. **8 витрат:**
   - Купівля автомобілів
   - Ремонти
   - Запчастини
   - Паливо

3. **5 записів історії пробігу:**
   - Для Toyota Camry (3 записи)
   - Для BMW X5 (2 записи)

4. **3 документи:**
   - Техпаспорти
   - Страховки
   - Договори

5. **3 покупці:**
   - З контактною інформацією
   - З примітками

6. **3 сповіщення:**
   - Різних типів (info, warning, success)

---

## 🚀 Як виконати

### Варіант 1: Через Supabase Dashboard (рекомендується)

1. **Відкрийте Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Оберіть проект:**
   - Знайдіть проект `PerekypApp`
   - Або використайте URL: `https://kjnbhiyrxtdaohxssynx.supabase.co`

3. **Перейдіть до SQL Editor:**
   - В лівому меню натисніть **SQL Editor**
   - Або перейдіть: `Database` → `SQL Editor`

4. **Створіть новий запит:**
   - Натисніть **New Query**

5. **Скопіюйте вміст файлу:**
   ```
   Відкрийте: scripts/add-test-data.sql
   Скопіюйте весь вміст
   Вставте в SQL Editor
   ```

6. **Виконайте запит:**
   - Натисніть **Run** (або Ctrl+Enter)
   - Зачекайте ~5-10 секунд

7. **Перевірте результат:**
   - Внизу з'явиться таблиця з кількістю доданих записів
   - Має бути:
     ```
     Cars: 3
     Expenses: 8
     Mileage History: 5
     Documents: 3
     Buyers: 3
     Notifications: 3
     ```

---

### Варіант 2: Через Node.js скрипт

```bash
# Створимо скрипт для автоматичного додавання
node scripts/add-test-data-auto.js
```

---

## ✅ Перевірка

### 1. Через Supabase Dashboard

**Таблиця cars:**
```sql
SELECT * FROM cars 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
```

**Таблиця car_expenses:**
```sql
SELECT * FROM car_expenses 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
```

### 2. Через додаток

1. **Запустіть додаток:**
   ```bash
   npm run web
   ```

2. **Увійдіть як:**
   - Email: `luhobymer@gmail.com`
   - Пароль: (ваш пароль)

3. **Перевірте екрани:**
   - ✅ Головна → має показати 3 автомобілі
   - ✅ Витрати → має показати 8 витрат
   - ✅ Документи → має показати 3 документи
   - ✅ Сповіщення → має показати 3 сповіщення

---

## 🗑️ Видалення тестових даних

Якщо потрібно видалити тестові дані:

```sql
-- Видалити все для користувача
DELETE FROM notifications WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM buyers WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM car_documents WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM mileage_history WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM car_expenses WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
DELETE FROM cars WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');
```

---

## ⚠️ Важливо

1. **Користувач має бути зареєстрований:**
   - Email: `luhobymer@gmail.com`
   - Якщо немає - зареєструйтесь через додаток

2. **Row Level Security (RLS):**
   - Переконайтесь що RLS політики налаштовані
   - Користувач має бачити тільки свої дані

3. **Резервна копія:**
   - Перед виконанням зробіть backup БД
   - Або виконайте на тестовій БД

---

## 📊 Структура даних

### Cars
```
Toyota Camry 2019   → Active    → 85,000 км → $15,000
BMW X5 2018         → Repairing → 120,000 км → $25,000
VW Golf 2020        → Sold      → 45,000 км → $12,000
```

### Expenses
```
Total: $54,830
- Purchases: $52,000
- Repairs: $1,550
- Parts: $1,200
- Fuel: $80
```

### Timeline
```
4 місяці тому  → Купівля VW Golf
3 місяці тому  → Купівля Toyota Camry
2 місяці тому  → Купівля BMW X5
1 місяць тому  → Ремонт BMW
1 тиждень тому → Оновлення пробігу
```

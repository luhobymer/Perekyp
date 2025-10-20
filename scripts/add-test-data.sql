-- ДОДАВАННЯ ТЕСТОВИХ ДАНИХ ДЛЯ КОРИСТУВАЧА luhobymer@gmail.com
-- Виконайте цей скрипт в Supabase SQL Editor

-- 1. Спочатку знайдемо user_id
-- Якщо користувач ще не зареєстрований, створіть його через додаток

-- 2. Створюємо тестові автомобілі
INSERT INTO cars (
  user_id,
  brand,
  model,
  year,
  vin,
  reg_number,
  body_type,
  engine_type,
  engine_volume,
  transmission,
  color,
  mileage,
  purchase_price,
  status,
  notes
) VALUES 
-- Авто 1: Toyota Camry
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Toyota',
  'Camry',
  2019,
  'JTNBF46K803123456',
  'AA1234BB',
  'sedan',
  'petrol',
  2.5,
  'automatic',
  'silver',
  85000,
  15000,
  'active',
  'Куплено на аукціоні, в хорошому стані'
),
-- Авто 2: BMW X5
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'BMW',
  'X5',
  2018,
  'WBAJB8C55JG876543',
  'BC5678DE',
  'suv',
  'diesel',
  3.0,
  'automatic',
  'black',
  120000,
  25000,
  'repairing',
  'Потребує ремонту підвіски'
),
-- Авто 3: Volkswagen Golf
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Volkswagen',
  'Golf',
  2020,
  'WVWZZZ1KZLW234567',
  'EF9012GH',
  'hatchback',
  'petrol',
  1.4,
  'manual',
  'white',
  45000,
  12000,
  'sold',
  'Продано через 2 місяці'
);

-- 3. Додаємо витрати для автомобілів
INSERT INTO car_expenses (
  user_id,
  car_id,
  category,
  amount,
  description,
  date
) VALUES
-- Витрати для Toyota Camry
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  'purchase',
  15000,
  'Купівля автомобіля на аукціоні',
  NOW() - INTERVAL '3 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  'repair',
  450,
  'Заміна гальмівних колодок',
  NOW() - INTERVAL '2 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  'fuel',
  80,
  'Заправка 40л',
  NOW() - INTERVAL '1 week'
),
-- Витрати для BMW X5
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  'purchase',
  25000,
  'Купівля BMW X5 з пробігом',
  NOW() - INTERVAL '2 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  'parts',
  1200,
  'Запчастини для підвіски',
  NOW() - INTERVAL '1 month'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  'repair',
  800,
  'Ремонт підвіски',
  NOW() - INTERVAL '3 weeks'
),
-- Витрати для VW Golf
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'EF9012GH' LIMIT 1),
  'purchase',
  12000,
  'Купівля Volkswagen Golf',
  NOW() - INTERVAL '4 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'EF9012GH' LIMIT 1),
  'repair',
  300,
  'Заміна масла та фільтрів',
  NOW() - INTERVAL '3 months'
);

-- 4. Додаємо історію пробігу
INSERT INTO mileage_history (
  user_id,
  car_id,
  mileage,
  date
) VALUES
-- Для Toyota Camry
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  82000,
  NOW() - INTERVAL '3 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  84000,
  NOW() - INTERVAL '1 month'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  85000,
  NOW() - INTERVAL '1 week'
),
-- Для BMW X5
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  118000,
  NOW() - INTERVAL '2 months'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  120000,
  NOW() - INTERVAL '1 week'
);

-- 5. Додаємо документи
INSERT INTO car_documents (
  user_id,
  car_id,
  title,
  type,
  date,
  expiry_date,
  notes
) VALUES
-- Документи для Toyota Camry
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  'Техпаспорт',
  'registration',
  NOW() - INTERVAL '3 months',
  NOW() + INTERVAL '2 years',
  'Оригінал техпаспорту'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'AA1234BB' LIMIT 1),
  'Страховка ОСЦПВ',
  'insurance',
  NOW() - INTERVAL '2 months',
  NOW() + INTERVAL '10 months',
  'Повна страховка'
),
-- Документи для BMW X5
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  (SELECT id FROM cars WHERE reg_number = 'BC5678DE' LIMIT 1),
  'Договір купівлі-продажу',
  'purchase',
  NOW() - INTERVAL '2 months',
  NULL,
  'Купівля у приватної особи'
);

-- 6. Додаємо покупців (buyers)
INSERT INTO buyers (
  user_id,
  name,
  phone,
  email,
  notes
) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Іванов Іван Іванович',
  '+380501234567',
  'ivanov@example.com',
  'Зацікавлений в Toyota Camry'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Петренко Петро',
  '+380671234567',
  'petrenko@example.com',
  'Купив VW Golf'
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Сидорова Олена',
  '+380931234567',
  NULL,
  'Питала про BMW X5'
);

-- 7. Додаємо сповіщення
INSERT INTO notifications (
  user_id,
  title,
  message,
  type,
  is_read
) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Нове повідомлення',
  'Іванов Іван цікавиться вашим Toyota Camry',
  'info',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Нагадування',
  'Через місяць закінчується страховка на Toyota Camry',
  'warning',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com'),
  'Успішно',
  'Автомобіль VW Golf продано',
  'success',
  true
);

-- ПЕРЕВІРКА ДАНИХ
SELECT 
  'Cars' as table_name,
  COUNT(*) as count
FROM cars 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')

UNION ALL

SELECT 
  'Expenses' as table_name,
  COUNT(*) as count
FROM car_expenses 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')

UNION ALL

SELECT 
  'Mileage History' as table_name,
  COUNT(*) as count
FROM mileage_history 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')

UNION ALL

SELECT 
  'Documents' as table_name,
  COUNT(*) as count
FROM car_documents 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')

UNION ALL

SELECT 
  'Buyers' as table_name,
  COUNT(*) as count
FROM buyers 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com')

UNION ALL

SELECT 
  'Notifications' as table_name,
  COUNT(*) as count
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luhobymer@gmail.com');

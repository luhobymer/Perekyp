-- ========================================
-- ВИДАЛЕННЯ НЕПОТРІБНИХ E-COMMERCE ТАБЛИЦЬ
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- УВАГА: Це видалить таблиці назавжди!
-- Переконайтеся, що вони дійсно не потрібні

-- Видалення таблиць e-commerce
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Перевірка результату
SELECT 
    tablename,
    schemaname
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
    AND tablename IN ('categories', 'products', 'orders', 'order_items');

-- Показати що залишилось
SELECT 
    tablename,
    schemaname
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- Повідомлення
DO $$
BEGIN
    RAISE NOTICE '✅ E-commerce таблиці видалено';
    RAISE NOTICE 'Залишились тільки таблиці для автоперекупу';
END $$;

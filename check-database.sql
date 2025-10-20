-- ========================================
-- СКРИПТ ПЕРЕВІРКИ БАЗИ ДАНИХ PEREKYPAPP
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- 1. ПЕРЕВІРКА ВСІХ ТАБЛИЦЬ У ПРОЕКТІ
SELECT
    'СПИСОК ВСІХ ТАБЛИЦЬ' as check_type,
    schemaname,
    tablename,
    (
        SELECT count(*)
        FROM information_schema.columns
        WHERE table_name = pg_tables.tablename
        AND table_schema = pg_tables.schemaname
    ) as column_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. ДЕТАЛЬНА ПЕРЕВІРКА КОНКРЕТНИХ ТАБЛИЦЬ

-- Перевірка таблиці profiles
SELECT
    'ТАБЛИЦЯ PROFILES' as table_check,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Перевірка таблиці cars
SELECT
    'ТАБЛИЦЯ CARS' as table_check,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cars'
ORDER BY ordinal_position;

-- Перевірка таблиці expenses
SELECT
    'ТАБЛИЦЯ EXPENSES' as table_check,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
ORDER BY ordinal_position;

-- Перевірка таблиці documents
SELECT
    'ТАБЛИЦЯ DOCUMENTS' as table_check,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;

-- Перевірка таблиці notifications
SELECT
    'ТАБЛИЦЯ NOTIFICATIONS' as table_check,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- 3. ПЕРЕВІРКА ІНДЕКСІВ
SELECT
    'ІНДЕКСИ' as check_type,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 4. ПЕРЕВІРКА ФУНКЦІЙ
SELECT
    'ФУНКЦІЇ' as check_type,
    proname as function_name,
    pg_get_function_identity_arguments(oid) as arguments,
    prokind as kind
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- 5. ПЕРЕВІРКА ПОЛІТИК БЕЗПЕКИ (RLS)
SELECT
    'RLS ПОЛІТИКИ' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. ПЕРЕВІРКА ТРИГЕРІВ
SELECT
    'ТРИГЕРИ' as check_type,
    event_object_schema,
    event_object_table,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. ПЕРЕВІРКА СТАТУСУ ТАБЛИЦЬ
SELECT
    'СТАТУС ТАБЛИЦЬ' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    (
        SELECT count(*)
        FROM information_schema.table_constraints
        WHERE table_name = pg_tables.tablename
        AND table_schema = pg_tables.schemaname
        AND constraint_type = 'PRIMARY KEY'
    ) as has_primary_key,
    (
        SELECT count(*)
        FROM information_schema.table_constraints
        WHERE table_name = pg_tables.tablename
        AND table_schema = pg_tables.schemaname
        AND constraint_type = 'FOREIGN KEY'
    ) as has_foreign_keys
FROM pg_tables
LEFT JOIN pg_class ON pg_tables.tablename = pg_class.relname
LEFT JOIN pg_namespace ON pg_tables.schemaname = pg_namespace.nspname
WHERE pg_tables.schemaname = 'public'
ORDER BY tablename;

-- 8. ПІДРАХУНОК РЯДКІВ У ТАБЛИЦЯХ
SELECT
    'КІЛЬКІСТЬ РЯДКІВ' as check_type,
    schemaname,
    tablename,
    n_tup_ins as approximate_row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. ПЕРЕВІРКА НЕОБХІДНИХ ФУНКЦІЙ
SELECT
    'СПЕЦІАЛЬНІ ФУНКЦІЇ' as check_type,
    proname,
    pg_get_function_identity_arguments(oid) as args
FROM pg_proc
WHERE proname IN ('create_car', 'create_expense', 'create_document', 'create_notification')
ORDER BY proname;

-- 10. ЗАГАЛЬНА ІНФОРМАЦІЯ ПРО БАЗУ ДАНИХ
SELECT
    'ІНФОРМАЦІЯ ПРО БД' as info_type,
    version() as postgresql_version,
    current_database() as database_name,
    current_user as current_user,
    current_setting('timezone') as timezone,
    now() as current_time;

-- ЗВІТ ПРО СТАТУС
DO $$
DECLARE
    profiles_exists boolean;
    cars_exists boolean;
    expenses_exists boolean;
    documents_exists boolean;
    notifications_exists boolean;
BEGIN
    -- Перевіряємо існування таблиць
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') INTO profiles_exists;
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'cars') INTO cars_exists;
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'expenses') INTO expenses_exists;
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') INTO documents_exists;
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') INTO notifications_exists;

    RAISE NOTICE '========================================';
    RAISE NOTICE '📊 ЗВІТ ПРО СТАТУС БАЗИ ДАНИХ';
    RAISE NOTICE '========================================';

    IF profiles_exists THEN
        RAISE NOTICE '✅ profiles - Готова';
    ELSE
        RAISE NOTICE '❌ profiles - Потрібна міграція';
    END IF;

    IF cars_exists THEN
        RAISE NOTICE '✅ cars - Готова';
    ELSE
        RAISE NOTICE '❌ cars - Потрібна міграція';
    END IF;

    IF expenses_exists THEN
        RAISE NOTICE '✅ expenses - Готова';
    ELSE
        RAISE NOTICE '❌ expenses - Потрібна міграція';
    END IF;

    IF documents_exists THEN
        RAISE NOTICE '✅ documents - Готова';
    ELSE
        RAISE NOTICE '❌ documents - Потрібна міграція';
    END IF;

    IF notifications_exists THEN
        RAISE NOTICE '✅ notifications - Готова';
    ELSE
        RAISE NOTICE '❌ notifications - Потрібна міграція';
    END IF;

    RAISE NOTICE '========================================';

    IF profiles_exists AND cars_exists AND expenses_exists AND documents_exists AND notifications_exists THEN
        RAISE NOTICE '🎉 БАЗА ДАНИХ ГОТОВА ДО РОБОТИ!';
    ELSE
        RAISE NOTICE '⚠️ ПОТРІБНІ ДОДАТКОВІ МІГРАЦІЇ';
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- ФІНАЛЬНЕ НАЛАШТУВАННЯ RLS ПОЛІТИК
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- ВАЖЛИВО: Ці політики дозволяють читання всім,
-- але зміни тільки власникам даних

-- ========================================
-- 1. CARS
-- ========================================

-- Видалити всі старі політики
DROP POLICY IF EXISTS "Enable read access for all users" ON cars;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON cars;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON cars;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON cars;
DROP POLICY IF EXISTS "Users can view all cars" ON cars;
DROP POLICY IF EXISTS "Users can insert their cars" ON cars;
DROP POLICY IF EXISTS "Users can update their cars" ON cars;
DROP POLICY IF EXISTS "Users can delete their cars" ON cars;

-- Нові політики для cars
CREATE POLICY "cars_select_all"
    ON cars FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "cars_insert_authenticated"
    ON cars FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "cars_update_owner"
    ON cars FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "cars_delete_owner"
    ON cars FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);

-- ========================================
-- 2. CAR_EXPENSES
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON car_expenses;
DROP POLICY IF EXISTS "Enable insert for car owners" ON car_expenses;
DROP POLICY IF EXISTS "Enable update for car owners" ON car_expenses;
DROP POLICY IF EXISTS "Enable delete for car owners" ON car_expenses;
DROP POLICY IF EXISTS "Users can view all expenses" ON car_expenses;
DROP POLICY IF EXISTS "Users can insert expenses" ON car_expenses;
DROP POLICY IF EXISTS "Users can update their expenses" ON car_expenses;
DROP POLICY IF EXISTS "Users can delete their expenses" ON car_expenses;

CREATE POLICY "car_expenses_select_all"
    ON car_expenses FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "car_expenses_insert_car_owner"
    ON car_expenses FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_expenses.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_expenses_update_car_owner"
    ON car_expenses FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_expenses.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_expenses_delete_car_owner"
    ON car_expenses FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_expenses.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 3. CAR_DOCUMENTS
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON car_documents;
DROP POLICY IF EXISTS "Enable insert for car owners" ON car_documents;
DROP POLICY IF EXISTS "Enable update for car owners" ON car_documents;
DROP POLICY IF EXISTS "Enable delete for car owners" ON car_documents;
DROP POLICY IF EXISTS "Users can view all documents" ON car_documents;
DROP POLICY IF EXISTS "Users can insert documents" ON car_documents;
DROP POLICY IF EXISTS "Users can update their documents" ON car_documents;
DROP POLICY IF EXISTS "Users can delete their documents" ON car_documents;

CREATE POLICY "car_documents_select_all"
    ON car_documents FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "car_documents_insert_car_owner"
    ON car_documents FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_documents.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_documents_update_car_owner"
    ON car_documents FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_documents.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_documents_delete_car_owner"
    ON car_documents FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_documents.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 4. CAR_IMAGES
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON car_images;
DROP POLICY IF EXISTS "Enable insert for car owners" ON car_images;
DROP POLICY IF EXISTS "Enable update for car owners" ON car_images;
DROP POLICY IF EXISTS "Enable delete for car owners" ON car_images;
DROP POLICY IF EXISTS "Users can view all images" ON car_images;
DROP POLICY IF EXISTS "Users can insert images" ON car_images;
DROP POLICY IF EXISTS "Users can update their images" ON car_images;
DROP POLICY IF EXISTS "Users can delete their images" ON car_images;

CREATE POLICY "car_images_select_all"
    ON car_images FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "car_images_insert_car_owner"
    ON car_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_images.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_images_update_car_owner"
    ON car_images FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_images.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "car_images_delete_car_owner"
    ON car_images FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_images.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 5. MILEAGE_HISTORY
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON mileage_history;
DROP POLICY IF EXISTS "Enable insert for car owners" ON mileage_history;
DROP POLICY IF EXISTS "Enable update for car owners" ON mileage_history;
DROP POLICY IF EXISTS "Enable delete for car owners" ON mileage_history;
DROP POLICY IF EXISTS "Users can view all mileage" ON mileage_history;
DROP POLICY IF EXISTS "Users can insert mileage" ON mileage_history;
DROP POLICY IF EXISTS "Users can update their mileage" ON mileage_history;
DROP POLICY IF EXISTS "Users can delete their mileage" ON mileage_history;

CREATE POLICY "mileage_history_select_all"
    ON mileage_history FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "mileage_history_insert_car_owner"
    ON mileage_history FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = mileage_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "mileage_history_update_car_owner"
    ON mileage_history FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = mileage_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "mileage_history_delete_car_owner"
    ON mileage_history FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = mileage_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 6. BUYERS
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON buyers;
DROP POLICY IF EXISTS "Enable insert for car owners" ON buyers;
DROP POLICY IF EXISTS "Enable update for car owners" ON buyers;
DROP POLICY IF EXISTS "Enable delete for car owners" ON buyers;
DROP POLICY IF EXISTS "Users can view all buyers" ON buyers;
DROP POLICY IF EXISTS "Users can insert buyers" ON buyers;
DROP POLICY IF EXISTS "Users can update their buyers" ON buyers;
DROP POLICY IF EXISTS "Users can delete their buyers" ON buyers;

CREATE POLICY "buyers_select_all"
    ON buyers FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "buyers_insert_car_owner"
    ON buyers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = buyers.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "buyers_update_car_owner"
    ON buyers FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = buyers.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "buyers_delete_car_owner"
    ON buyers FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = buyers.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 7. SERVICE_HISTORY
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON service_history;
DROP POLICY IF EXISTS "Enable insert for car owners" ON service_history;
DROP POLICY IF EXISTS "Enable update for car owners" ON service_history;
DROP POLICY IF EXISTS "Enable delete for car owners" ON service_history;
DROP POLICY IF EXISTS "Users can view all services" ON service_history;
DROP POLICY IF EXISTS "Users can insert services" ON service_history;
DROP POLICY IF EXISTS "Users can update their services" ON service_history;
DROP POLICY IF EXISTS "Users can delete their services" ON service_history;

CREATE POLICY "service_history_select_all"
    ON service_history FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "service_history_insert_car_owner"
    ON service_history FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = service_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "service_history_update_car_owner"
    ON service_history FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = service_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "service_history_delete_car_owner"
    ON service_history FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = service_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 8. OWNERSHIP_HISTORY
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON ownership_history;
DROP POLICY IF EXISTS "Enable insert for car owners" ON ownership_history;
DROP POLICY IF EXISTS "Enable update for car owners" ON ownership_history;
DROP POLICY IF EXISTS "Enable delete for car owners" ON ownership_history;
DROP POLICY IF EXISTS "Users can view all ownership" ON ownership_history;
DROP POLICY IF EXISTS "Users can insert ownership" ON ownership_history;
DROP POLICY IF EXISTS "Users can update their ownership" ON ownership_history;
DROP POLICY IF EXISTS "Users can delete their ownership" ON ownership_history;

CREATE POLICY "ownership_history_select_all"
    ON ownership_history FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "ownership_history_insert_car_owner"
    ON ownership_history FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = ownership_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "ownership_history_update_car_owner"
    ON ownership_history FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = ownership_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "ownership_history_delete_car_owner"
    ON ownership_history FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = ownership_history.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 9. STATUS_COMMENTS
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON status_comments;
DROP POLICY IF EXISTS "Enable insert for car owners" ON status_comments;
DROP POLICY IF EXISTS "Enable update for car owners" ON status_comments;
DROP POLICY IF EXISTS "Enable delete for car owners" ON status_comments;
DROP POLICY IF EXISTS "Users can view all comments" ON status_comments;
DROP POLICY IF EXISTS "Users can insert comments" ON status_comments;
DROP POLICY IF EXISTS "Users can update their comments" ON status_comments;
DROP POLICY IF EXISTS "Users can delete their comments" ON status_comments;

CREATE POLICY "status_comments_select_all"
    ON status_comments FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "status_comments_insert_car_owner"
    ON status_comments FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = status_comments.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "status_comments_update_car_owner"
    ON status_comments FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = status_comments.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

CREATE POLICY "status_comments_delete_car_owner"
    ON status_comments FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = status_comments.car_id 
            AND (cars.user_id = auth.uid() OR cars.user_id IS NULL)
        )
    );

-- ========================================
-- 10. PROFILES
-- ========================================

DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "profiles_select_all"
    ON profiles FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "profiles_insert_own"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ========================================
-- ПЕРЕВІРКА
-- ========================================

-- Показати всі створені політики
SELECT
    schemaname,
    tablename,
    policyname,
    cmd
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND tablename IN (
        'cars', 'car_expenses', 'car_documents', 'car_images',
        'mileage_history', 'buyers', 'service_history',
        'ownership_history', 'status_comments', 'profiles'
    )
ORDER BY
    tablename, cmd, policyname;

-- Повідомлення
DO $$
BEGIN
    RAISE NOTICE '✅ RLS політики успішно налаштовані!';
    RAISE NOTICE '';
    RAISE NOTICE 'Тепер перевірте доступ через anon ключ:';
    RAISE NOTICE 'node scripts/checkDatabaseDetailed.js';
END $$;

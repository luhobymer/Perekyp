-- ========================================
-- СТВОРЕННЯ ТАБЛИЦІ АВТОМОБІЛІВ
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- Створення таблиці автомобілів
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    body_type TEXT,
    vin TEXT,
    reg_number TEXT,
    engine_type TEXT,
    engine_volume DECIMAL,
    transmission TEXT,
    color TEXT,
    mileage INTEGER,
    status TEXT DEFAULT 'active',
    purchase_date DATE,
    price DECIMAL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Додаткові поля для сумісності
    specifications JSONB,
    images TEXT[],
    documents JSONB,
    expenses JSONB
);

-- Увімкнення RLS (Row Level Security)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Створення політик безпеки
CREATE POLICY "Users can view their own cars"
    ON public.cars FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cars"
    ON public.cars FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cars"
    ON public.cars FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars"
    ON public.cars FOR DELETE
    USING (auth.uid() = user_id);

-- Створення функції для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Створення тригера для автоматичного оновлення updated_at
CREATE TRIGGER handle_cars_updated_at
    BEFORE UPDATE ON public.cars
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Створення індексів для швидких запитів
CREATE INDEX cars_user_id_idx ON public.cars(user_id);
CREATE INDEX cars_brand_model_idx ON public.cars(brand, model);
CREATE INDEX cars_status_idx ON public.cars(status);
CREATE INDEX cars_created_at_idx ON public.cars(created_at DESC);

-- Створення функції для створення автомобіля з автоматичним призначенням користувача
CREATE OR REPLACE FUNCTION public.create_car(
    p_brand TEXT,
    p_model TEXT,
    p_year INTEGER,
    p_body_type TEXT DEFAULT NULL,
    p_vin TEXT DEFAULT NULL,
    p_reg_number TEXT DEFAULT NULL,
    p_engine_type TEXT DEFAULT NULL,
    p_engine_volume DECIMAL DEFAULT NULL,
    p_transmission TEXT DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_mileage INTEGER DEFAULT NULL,
    p_status TEXT DEFAULT 'active',
    p_purchase_date DATE DEFAULT NULL,
    p_price DECIMAL DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_specifications JSONB DEFAULT NULL,
    p_images TEXT[] DEFAULT NULL,
    p_documents JSONB DEFAULT NULL,
    p_expenses JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_car_id UUID;
BEGIN
    INSERT INTO public.cars (
        user_id,
        brand,
        model,
        year,
        body_type,
        vin,
        reg_number,
        engine_type,
        engine_volume,
        transmission,
        color,
        mileage,
        status,
        purchase_date,
        price,
        description,
        specifications,
        images,
        documents,
        expenses
    ) VALUES (
        auth.uid(),
        p_brand,
        p_model,
        p_year,
        p_body_type,
        p_vin,
        p_reg_number,
        p_engine_type,
        p_engine_volume,
        p_transmission,
        p_color,
        p_mileage,
        p_status,
        p_purchase_date,
        p_price,
        p_description,
        p_specifications,
        p_images,
        p_documents,
        p_expenses
    ) RETURNING id INTO v_car_id;

    RETURN v_car_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Повідомлення про успішне створення
DO $$
BEGIN
    RAISE NOTICE '✅ Таблицю автомобілів створено успішно!';
    RAISE NOTICE '📋 Структура включає всі необхідні поля для автоперекупу';
    RAISE NOTICE '🔒 RLS політики налаштовано для безпеки даних';
    RAISE NOTICE '⚡ Індекси створено для оптимальної продуктивності';
END $$;

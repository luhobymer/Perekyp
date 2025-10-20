-- ========================================
-- СТВОРЕННЯ ТАБЛИЦІ ВИТРАТ
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- Створення таблиці витрат
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    mileage_at_time INTEGER,
    vendor TEXT,
    receipt_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_interval TEXT, -- 'weekly', 'monthly', 'yearly'
    next_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Увімкнення RLS (Row Level Security)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Створення політик безпеки
CREATE POLICY "Users can view their own expenses"
    ON public.expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
    ON public.expenses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
    ON public.expenses FOR DELETE
    USING (auth.uid() = user_id);

-- Створення тригера для автоматичного оновлення updated_at
CREATE TRIGGER handle_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Створення індексів для швидких запитів
CREATE INDEX expenses_user_id_idx ON public.expenses(user_id);
CREATE INDEX expenses_car_id_idx ON public.expenses(car_id);
CREATE INDEX expenses_date_idx ON public.expenses(date DESC);
CREATE INDEX expenses_category_idx ON public.expenses(category);

-- Створення функції для створення витрати
CREATE OR REPLACE FUNCTION public.create_expense(
    p_car_id UUID,
    p_category TEXT,
    p_amount DECIMAL(10,2),
    p_description TEXT DEFAULT NULL,
    p_date DATE DEFAULT CURRENT_DATE,
    p_mileage_at_time INTEGER DEFAULT NULL,
    p_vendor TEXT DEFAULT NULL,
    p_receipt_url TEXT DEFAULT NULL,
    p_is_recurring BOOLEAN DEFAULT FALSE,
    p_recurring_interval TEXT DEFAULT NULL,
    p_next_due_date DATE DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_expense_id UUID;
BEGIN
    INSERT INTO public.expenses (
        user_id,
        car_id,
        category,
        amount,
        description,
        date,
        mileage_at_time,
        vendor,
        receipt_url,
        is_recurring,
        recurring_interval,
        next_due_date
    ) VALUES (
        auth.uid(),
        p_car_id,
        p_category,
        p_amount,
        p_description,
        p_date,
        p_mileage_at_time,
        p_vendor,
        p_receipt_url,
        p_is_recurring,
        p_recurring_interval,
        p_next_due_date
    ) RETURNING id INTO v_expense_id;

    RETURN v_expense_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Створення функції для створення автоматичних нагадувань про регулярні витрати
CREATE OR REPLACE FUNCTION public.create_expense_reminders()
RETURNS void AS $$
DECLARE
    expense_record RECORD;
BEGIN
    -- Знайти всі регулярні витрати, термін яких настав
    FOR expense_record IN
        SELECT * FROM public.expenses
        WHERE is_recurring = TRUE
        AND next_due_date <= CURRENT_DATE
        AND user_id = auth.uid()
    LOOP
        -- Створити нову витрату
        PERFORM create_expense(
            expense_record.car_id,
            expense_record.category,
            expense_record.amount,
            'Автоматично створена витрата: ' || expense_record.description,
            CURRENT_DATE,
            NULL,
            expense_record.vendor,
            expense_record.receipt_url,
            TRUE,
            expense_record.recurring_interval,
            CASE
                WHEN expense_record.recurring_interval = 'weekly' THEN CURRENT_DATE + INTERVAL '1 week'
                WHEN expense_record.recurring_interval = 'monthly' THEN CURRENT_DATE + INTERVAL '1 month'
                WHEN expense_record.recurring_interval = 'yearly' THEN CURRENT_DATE + INTERVAL '1 year'
                ELSE NULL
            END
        );

        -- Оновити дату наступного платежу для оригінальної витрати
        UPDATE public.expenses
        SET next_due_date = CASE
            WHEN recurring_interval = 'weekly' THEN next_due_date + INTERVAL '1 week'
            WHEN recurring_interval = 'monthly' THEN next_due_date + INTERVAL '1 month'
            WHEN recurring_interval = 'yearly' THEN next_due_date + INTERVAL '1 year'
            ELSE NULL
        END
        WHERE id = expense_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Повідомлення про успішне створення
DO $$
BEGIN
    RAISE NOTICE '✅ Таблицю витрат створено успішно!';
    RAISE NOTICE '📋 Структура включає всі необхідні поля для відстеження витрат';
    RAISE NOTICE '🔒 RLS політики налаштовано для безпеки даних';
    RAISE NOTICE '⚡ Індекси створено для оптимальної продуктивності';
    RAISE NOTICE '🔄 Автоматичні нагадування для регулярних витрат налаштовано';
END $$;

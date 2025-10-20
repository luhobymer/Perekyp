-- ========================================
-- СТВОРЕННЯ ТАБЛИЦІ NOTIFICATIONS
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- Створення таблиці сповіщень
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('expense', 'service', 'document', 'mileage', 'status')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Увімкнення RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Створення політик безпеки
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Створення індексів для швидких запитів
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_car_id_idx ON public.notifications(car_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications(type);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);

-- Створення функції для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Створення тригера для автоматичного оновлення
DROP TRIGGER IF EXISTS handle_notifications_updated_at ON public.notifications;
CREATE TRIGGER handle_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Створення функції для створення сповіщень
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_car_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        car_id
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_car_id
    ) RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Створення функції для отримання кількості непрочитаних сповіщень
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.notifications
        WHERE user_id = auth.uid()
        AND read = FALSE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Створення функції для позначення всіх сповіщень як прочитаних
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS void AS $$
BEGIN
    UPDATE public.notifications
    SET read = TRUE
    WHERE user_id = auth.uid()
    AND read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Повідомлення про успішне створення
DO $$
BEGIN
    RAISE NOTICE '✅ Таблицю notifications створено успішно!';
    RAISE NOTICE '📋 Створено:';
    RAISE NOTICE '   ✓ Таблиця notifications';
    RAISE NOTICE '   ✓ RLS політики безпеки';
    RAISE NOTICE '   ✓ Індекси для продуктивності';
    RAISE NOTICE '   ✓ Функція create_notification()';
    RAISE NOTICE '   ✓ Функція get_unread_notifications_count()';
    RAISE NOTICE '   ✓ Функція mark_all_notifications_read()';
    RAISE NOTICE '   ✓ Тригер для автоматичного оновлення updated_at';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 БАЗА ДАНИХ ПОВНІСТЮ ГОТОВА!';
    RAISE NOTICE '🚀 Тепер можна запускати додаток: npm run start';
END $$;

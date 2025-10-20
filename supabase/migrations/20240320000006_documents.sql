-- ========================================
-- СТВОРЕННЯ ТАБЛИЦІ ДОКУМЕНТІВ
-- Виконайте в Supabase Dashboard -> SQL Editor
-- ========================================

-- Створення таблиці документів
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'insurance', 'registration', 'service', 'receipt', 'other'
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    expiry_date DATE,
    description TEXT,
    is_scanned BOOLEAN DEFAULT FALSE,
    ocr_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Увімкнення RLS (Row Level Security)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Створення політик безпеки
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- Створення тригера для автоматичного оновлення updated_at
CREATE TRIGGER handle_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Створення індексів для швидких запитів
CREATE INDEX documents_user_id_idx ON public.documents(user_id);
CREATE INDEX documents_car_id_idx ON public.documents(car_id);
CREATE INDEX documents_type_idx ON public.documents(type);
CREATE INDEX documents_expiry_date_idx ON public.documents(expiry_date);

-- Створення функції для створення документа
CREATE OR REPLACE FUNCTION public.create_document(
    p_car_id UUID,
    p_name TEXT,
    p_type TEXT,
    p_file_url TEXT,
    p_file_size INTEGER DEFAULT NULL,
    p_mime_type TEXT DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_is_scanned BOOLEAN DEFAULT FALSE,
    p_ocr_text TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_document_id UUID;
BEGIN
    INSERT INTO public.documents (
        user_id,
        car_id,
        name,
        type,
        file_url,
        file_size,
        mime_type,
        expiry_date,
        description,
        is_scanned,
        ocr_text
    ) VALUES (
        auth.uid(),
        p_car_id,
        p_name,
        p_type,
        p_file_url,
        p_file_size,
        p_mime_type,
        p_expiry_date,
        p_description,
        p_is_scanned,
        p_ocr_text
    ) RETURNING id INTO v_document_id;

    RETURN v_document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Створення функції для перевірки документів, термін дії яких закінчується
CREATE OR REPLACE FUNCTION public.check_expiring_documents()
RETURNS TABLE (
    document_id UUID,
    car_id UUID,
    document_name TEXT,
    expiry_date DATE,
    days_until_expiry INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.car_id,
        d.name,
        d.expiry_date,
        EXTRACT(DAY FROM d.expiry_date - CURRENT_DATE)::INTEGER as days_until_expiry
    FROM public.documents d
    WHERE d.user_id = auth.uid()
    AND d.expiry_date IS NOT NULL
    AND d.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    ORDER BY d.expiry_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Створення функції для автоматичного створення нагадувань про документи, термін дії яких закінчується
CREATE OR REPLACE FUNCTION public.create_document_expiry_notifications()
RETURNS void AS $$
DECLARE
    expiring_doc RECORD;
BEGIN
    -- Перевіряємо документи, термін дії яких закінчується протягом 7 днів
    FOR expiring_doc IN
        SELECT * FROM public.check_expiring_documents()
        WHERE days_until_expiry <= 7
    LOOP
        -- Створюємо сповіщення про документ, термін дії якого закінчується
        PERFORM public.create_notification(
            auth.uid(),
            'document',
            'Документ закінчується: ' || expiring_doc.document_name,
            'Термін дії документа спливає через ' || expiring_doc.days_until_expiry || ' днів',
            expiring_doc.car_id
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Повідомлення про успішне створення
DO $$
BEGIN
    RAISE NOTICE '✅ Таблицю документів створено успішно!';
    RAISE NOTICE '📋 Структура включає всі необхідні поля для зберігання документів';
    RAISE NOTICE '🔒 RLS політики налаштовано для безпеки даних';
    RAISE NOTICE '⚡ Індекси створено для оптимальної продуктивності';
    RAISE NOTICE '📅 Автоматичні нагадування про документи, термін дії яких закінчується';
END $$;

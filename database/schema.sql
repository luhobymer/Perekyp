-- Це SQL скрипт для створення таблиць у Supabase
-- Його можна виконати в SQL редакторі Supabase

-- Створення таблиці для автомобілів
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  brand VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INT NOT NULL,
  body_type VARCHAR,
  vin VARCHAR,
  reg_number VARCHAR,
  engine_type VARCHAR,
  engine_volume VARCHAR,
  color VARCHAR,
  mileage INT,
  status VARCHAR NOT NULL DEFAULT 'checking',
  purchase_price DECIMAL(10, 2),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sell_price DECIMAL(10, 2),
  sell_date TIMESTAMP WITH TIME ZONE,
  image_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці cars
CREATE POLICY "Users can CRUD their own cars" ON cars
  FOR ALL USING (auth.uid() = user_id);

-- Включення RLS для таблиці cars
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Створення таблиці для витрат
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description VARCHAR NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  receipt_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці expenses
CREATE POLICY "Users can CRUD their own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);

-- Включення RLS для таблиці expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Створення таблиці для історії пробігу
CREATE TABLE mileage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  mileage INT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці mileage_history
CREATE POLICY "Users can CRUD mileage history for their cars" ON mileage_history
  FOR ALL USING (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = mileage_history.car_id AND cars.user_id = auth.uid()
  ));

-- Включення RLS для таблиці mileage_history
ALTER TABLE mileage_history ENABLE ROW LEVEL SECURITY;

-- Створення таблиці для продажів
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sell_price DECIMAL(10, 2) NOT NULL,
  sell_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  buyer_name VARCHAR,
  buyer_phone VARCHAR,
  notes TEXT,
  profit DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці sales
CREATE POLICY "Users can CRUD their own sales" ON sales
  FOR ALL USING (auth.uid() = user_id);

-- Включення RLS для таблиці sales
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Створення таблиці для документів
CREATE TABLE car_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  document_type VARCHAR NOT NULL,
  file_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці car_documents
CREATE POLICY "Users can CRUD documents for their cars" ON car_documents
  FOR ALL USING (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = car_documents.car_id AND cars.user_id = auth.uid()
  ));

-- Включення RLS для таблиці car_documents
ALTER TABLE car_documents ENABLE ROW LEVEL SECURITY;

-- Створення таблиці для налаштувань користувачів
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  language VARCHAR NOT NULL DEFAULT 'uk',
  theme VARCHAR NOT NULL DEFAULT 'system',
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Політика безпеки для таблиці user_settings
CREATE POLICY "Users can CRUD their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Включення RLS для таблиці user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Створення тригера для оновлення поля updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Застосування тригера до всіх таблиць з полем updated_at
CREATE TRIGGER update_cars_modified
BEFORE UPDATE ON cars
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_expenses_modified
BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_settings_modified
BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Створення функції для автоматичного встановлення user_id в expenses
CREATE OR REPLACE FUNCTION set_user_id_for_expenses()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := (SELECT user_id FROM cars WHERE id = NEW.car_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Додавання тригера до таблиці expenses
CREATE TRIGGER set_expenses_user_id
BEFORE INSERT ON expenses
FOR EACH ROW EXECUTE PROCEDURE set_user_id_for_expenses();

-- Створення функції для автоматичного встановлення user_id в sales
CREATE OR REPLACE FUNCTION set_user_id_for_sales()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := (SELECT user_id FROM cars WHERE id = NEW.car_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Додавання тригера до таблиці sales
CREATE TRIGGER set_sales_user_id
BEFORE INSERT ON sales
FOR EACH ROW EXECUTE PROCEDURE set_user_id_for_sales(); 
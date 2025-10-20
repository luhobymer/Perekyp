# 🔐 ЯК ПРАЦЮЄ АВТОРИЗАЦІЯ ТА ДОСТУП ДО БД

## ❓ Питання: Якщо скрипт не може додати дані, то як додаток зможе?

**Відповідь:** Скрипт використовував неправильний підхід. Додаток працює інакше!

---

## 🔑 ДВА ТИПИ КЛЮЧІВ SUPABASE:

### 1️⃣ **ANON KEY** (публічний ключ)
```javascript
// Цей ключ є в .env файлі
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

// ✅ Може: читати/писати з авторизацією
// ❌ НЕ може: admin операції, обходити RLS
```

### 2️⃣ **SERVICE ROLE KEY** (приватний ключ)
```javascript
// Цей ключ НІКОЛИ не додається в додаток!
// Тільки для backend серверів

// ✅ Може: все (admin доступ)
// ⚠️ НЕБЕЗПЕЧНО в клієнтському коді!
```

---

## ❌ ЧОМУ МІЙ ПЕРШИЙ СКРИПТ НЕ СПРАЦЮВАВ:

```javascript
// ❌ НЕПРАВИЛЬНО
const supabase = createClient(supabaseUrl, ANON_KEY);

// Намагався викликати admin API
const users = await supabase.auth.admin.listUsers();
// Error: "User not allowed" ❌
```

**Проблема:** `admin.listUsers()` потребує SERVICE ROLE KEY

---

## ✅ ЯК ПРАЦЮЄ ДОДАТОК:

### Крок 1: Авторизація
```javascript
// Користувач вводить email + password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'luhobymer@gmail.com',
  password: 'my_secret_password'
});

// Supabase повертає:
// - Access Token (JWT)
// - Refresh Token
// - User object
```

### Крок 2: Автоматичний JWT Token
```javascript
// Після авторизації, SDK АВТОМАТИЧНО додає JWT до всіх запитів
const { data, error } = await supabase
  .from('cars')
  .insert({ brand: 'Toyota', model: 'Camry' });

// За кулісами:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Крок 3: RLS перевіряє JWT
```sql
-- В БД є політика:
CREATE POLICY "Users can insert own cars"
ON cars FOR INSERT
WITH CHECK (
  auth.uid() = user_id  -- ✅ auth.uid() береться з JWT token
);
```

### Крок 4: Автоматичне додавання user_id
```javascript
// В додатку можна навіть не вказувати user_id
const { data, error } = await supabase
  .from('cars')
  .insert({
    brand: 'Toyota',
    model: 'Camry'
    // user_id додається автоматично через trigger або default
  });
```

---

## 🔄 ПОРІВНЯННЯ:

| Аспект | Скрипт БЕЗ auth | Скрипт З auth | Додаток |
|--------|-----------------|---------------|---------|
| **Ключ** | ANON KEY | ANON KEY | ANON KEY |
| **Авторизація** | ❌ Немає | ✅ Є | ✅ Є |
| **JWT Token** | ❌ Немає | ✅ Є | ✅ Є |
| **auth.uid()** | ❌ NULL | ✅ user_id | ✅ user_id |
| **RLS** | ❌ Блокує | ✅ Дозволяє | ✅ Дозволяє |
| **Доступ до даних** | ❌ | ✅ | ✅ |

---

## 💻 ВИПРАВЛЕНИЙ СКРИПТ:

### Використання:
```bash
# З авторизацією
node scripts/add-test-data-with-auth.js YOUR_PASSWORD
```

### Що робить:
1. ✅ Логіниться як користувач
2. ✅ Отримує JWT token
3. ✅ Додає дані (RLS дозволяє)
4. ✅ Виходить з системи

---

## 🛡️ RLS (ROW LEVEL SECURITY)

### Що це?
RLS - це політики безпеки на рівні рядків таблиці.

### Приклад політики:
```sql
-- Користувач може читати тільки СВОЇ автомобілі
CREATE POLICY "Users can view own cars"
ON cars FOR SELECT
USING (auth.uid() = user_id);

-- Користувач може додавати тільки ДЛЯ СЕБЕ
CREATE POLICY "Users can insert own cars"
ON cars FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Користувач може оновлювати тільки СВОЇ
CREATE POLICY "Users can update own cars"
ON cars FOR UPDATE
USING (auth.uid() = user_id);
```

### Як це працює:
```javascript
// Користувач A (id: aaa-111)
await supabase.from('cars').select();
// Повертає тільки автомобілі де user_id = 'aaa-111'

// Користувач B (id: bbb-222) 
await supabase.from('cars').select();
// Повертає тільки автомобілі де user_id = 'bbb-222'

// ✅ Користувач A НЕ бачить дані користувача B
```

---

## 🔒 БЕЗПЕКА:

### ✅ ПРАВИЛЬНО:
```javascript
// В додатку
const supabase = createClient(
  SUPABASE_URL,
  ANON_KEY  // ✅ Публічний ключ
);

// Користувач авторизується
await supabase.auth.signInWithPassword({...});

// Працює з даними
await supabase.from('cars').select();
```

### ❌ НЕПРАВИЛЬНО:
```javascript
// ❌ НІКОЛИ не робіть так!
const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY  // ❌ Приватний ключ в клієнті!
);

// ❌ Обходить всі RLS політики
// ❌ Будь-хто може витягти ключ з коду
// ❌ Має повний доступ до БД
```

---

## 🎯 ВИСНОВОК:

### Чому скрипт не працював:
- ❌ Не було авторизації
- ❌ Не було JWT token
- ❌ RLS блокував доступ

### Чому додаток працюватиме:
- ✅ Є авторизація
- ✅ Є JWT token
- ✅ RLS дозволяє доступ
- ✅ Кожен користувач бачить тільки свої дані

### Як додати дані ПРАВИЛЬНО:
1. **Варіант A:** SQL в Supabase Dashboard (обходить RLS)
2. **Варіант B:** Скрипт з авторизацією (`add-test-data-with-auth.js`)
3. **Варіант C:** Через сам додаток (найправильніше)

---

## 📚 ДОДАТКОВІ РЕСУРСИ:

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Tokens](https://jwt.io/)

---

## 🚀 ШВИДКИЙ СТАРТ:

```bash
# 1. Додайте дані через скрипт з авторизацією
node scripts/add-test-data-with-auth.js YOUR_PASSWORD

# 2. Або виконайте SQL в Supabase Dashboard
# (див. scripts/add-test-data.sql)

# 3. Перевірте в додатку
npm run web
# Оновіть браузер (Ctrl+R)
```

**Тепер все має працювати!** ✅

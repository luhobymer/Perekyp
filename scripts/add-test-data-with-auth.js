const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 ДОДАВАННЯ ТЕСТОВИХ ДАНИХ З АВТОРИЗАЦІЄЮ\n');

async function addTestDataWithAuth() {
  try {
    // КРОК 1: АВТОРИЗАЦІЯ
    console.log('1️⃣ Авторизація користувача...');
    console.log('📧 Email: luhobymer@gmail.com');
    console.log('🔑 Введіть пароль нижче:\n');

    // Для безпеки - пароль НЕ зберігаємо в коді
    const password = process.argv[2];
    
    if (!password) {
      console.error('❌ Помилка: Не вказано пароль');
      console.log('\n💡 Використання:');
      console.log('   node scripts/add-test-data-with-auth.js YOUR_PASSWORD\n');
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'luhobymer@gmail.com',
      password: password
    });

    if (authError) {
      console.error('❌ Помилка авторизації:', authError.message);
      console.log('\n💡 Переконайтесь що:');
      console.log('   1. Email правильний: luhobymer@gmail.com');
      console.log('   2. Пароль правильний');
      console.log('   3. Користувач зареєстрований в Supabase\n');
      return;
    }

    console.log('✅ Авторизація успішна!');
    console.log('👤 User ID:', authData.user.id, '\n');

    // КРОК 2: ДОДАЄМО АВТОМОБІЛІ
    console.log('2️⃣ Додавання автомобілів...');
    const cars = [
      {
        brand: 'Toyota',
        model: 'Camry',
        year: 2019,
        vin: 'JTNBF46K803123456',
        reg_number: 'AA1234BB',
        body_type: 'sedan',
        engine_type: 'petrol',
        engine_volume: '2.5',
        transmission: 'automatic',
        color: 'silver',
        mileage: 85000,
        purchase_price: 15000,
        status: 'active',
        notes: 'Куплено на аукціоні, в хорошому стані'
      },
      {
        brand: 'BMW',
        model: 'X5',
        year: 2018,
        vin: 'WBAJB8C55JG876543',
        reg_number: 'BC5678DE',
        body_type: 'suv',
        engine_type: 'diesel',
        engine_volume: '3.0',
        transmission: 'automatic',
        color: 'black',
        mileage: 120000,
        purchase_price: 25000,
        status: 'repairing',
        notes: 'Потребує ремонту підвіски'
      },
      {
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        vin: 'WVWZZZ1KZLW234567',
        reg_number: 'EF9012GH',
        body_type: 'hatchback',
        engine_type: 'petrol',
        engine_volume: '1.4',
        transmission: 'manual',
        color: 'white',
        mileage: 45000,
        purchase_price: 12000,
        status: 'sold',
        notes: 'Продано через 2 місяці'
      }
    ];

    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .insert(cars)
      .select();

    if (carsError) {
      console.error('❌ Помилка додавання автомобілів:', carsError.message);
      console.log('\n💡 Можливі причини:');
      console.log('   - RLS політика блокує INSERT');
      console.log('   - Дублювання даних (VIN або reg_number)');
      console.log('   - Відсутні обов\'язкові поля\n');
      return;
    }

    console.log(`✅ Додано ${carsData.length} автомобілі:`);
    carsData.forEach(car => {
      console.log(`   🚗 ${car.brand} ${car.model} ${car.year}`);
    });
    console.log('');

    // КРОК 3: ДОДАЄМО ВИТРАТИ
    console.log('3️⃣ Додавання витрат...');
    const expenses = [
      {
        car_id: carsData[0].id,
        category: 'purchase',
        amount: 15000,
        description: 'Купівля автомобіля на аукціоні',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        car_id: carsData[0].id,
        category: 'repair',
        amount: 450,
        description: 'Заміна гальмівних колодок',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        car_id: carsData[1].id,
        category: 'purchase',
        amount: 25000,
        description: 'Купівля BMW X5 з пробігом',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        car_id: carsData[1].id,
        category: 'parts',
        amount: 1200,
        description: 'Запчастини для підвіски',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        car_id: carsData[2].id,
        category: 'purchase',
        amount: 12000,
        description: 'Купівля Volkswagen Golf',
        date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: expensesData, error: expensesError } = await supabase
      .from('car_expenses')
      .insert(expenses)
      .select();

    if (expensesError) {
      console.error('❌ Помилка додавання витрат:', expensesError.message);
    } else {
      const total = expensesData.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      console.log(`✅ Додано ${expensesData.length} витрат (Загалом: $${total})\n`);
    }

    // КРОК 4: ДОДАЄМО СПОВІЩЕННЯ
    console.log('4️⃣ Додавання сповіщень...');
    const notifications = [
      {
        title: 'Вітаємо!',
        message: 'Тестові дані успішно додано до вашого акаунту',
        type: 'success',
        is_read: false
      },
      {
        title: 'Нагадування',
        message: 'Перевірте страховку на Toyota Camry - скоро закінчується',
        type: 'warning',
        is_read: false
      }
    ];

    const { data: notifData, error: notifError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (notifError) {
      console.error('❌ Помилка додавання сповіщень:', notifError.message);
    } else {
      console.log(`✅ Додано ${notifData.length} сповіщення\n`);
    }

    // ПІДСУМОК
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ТЕСТОВІ ДАНІ УСПІШНО ДОДАНО!\n');
    console.log('📊 Підсумок:');
    console.log(`   🚗 Автомобілі: ${carsData.length}`);
    console.log(`   💰 Витрати: ${expensesData?.length || 0}`);
    console.log(`   🔔 Сповіщення: ${notifData?.length || 0}\n`);
    console.log('🎯 Оновіть додаток (Ctrl+R) щоб побачити дані!');

    // Вихід
    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Критична помилка:', error.message);
  }
}

addTestDataWithAuth();

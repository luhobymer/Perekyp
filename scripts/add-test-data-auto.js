const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 ДОДАВАННЯ ТЕСТОВИХ ДАНИХ\n');
console.log('Користувач: luhobymer@gmail.com\n');

async function addTestData() {
  try {
    // 1. Отримуємо user_id
    console.log('1️⃣ Пошук користувача...');
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Помилка:', userError.message);
      console.log('\n⚠️  Використайте SQL скрипт через Supabase Dashboard');
      return;
    }

    const user = userData.users.find(u => u.email === 'luhobymer@gmail.com');
    
    if (!user) {
      console.error('❌ Користувач luhobymer@gmail.com не знайдений');
      console.log('💡 Спочатку зареєструйтесь через додаток');
      return;
    }

    const userId = user.id;
    console.log('✅ Користувач знайдений:', userId, '\n');

    // 2. Додаємо автомобілі
    console.log('2️⃣ Додавання автомобілів...');
    const cars = [
      {
        user_id: userId,
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
        user_id: userId,
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
        user_id: userId,
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
      return;
    }

    console.log(`✅ Додано ${carsData.length} автомобілі\n`);

    // 3. Додаємо витрати
    console.log('3️⃣ Додавання витрат...');
    const expenses = [
      {
        user_id: userId,
        car_id: carsData[0].id,
        category: 'purchase',
        amount: 15000,
        description: 'Купівля автомобіля на аукціоні',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[0].id,
        category: 'repair',
        amount: 450,
        description: 'Заміна гальмівних колодок',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[0].id,
        category: 'fuel',
        amount: 80,
        description: 'Заправка 40л',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[1].id,
        category: 'purchase',
        amount: 25000,
        description: 'Купівля BMW X5 з пробігом',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[1].id,
        category: 'parts',
        amount: 1200,
        description: 'Запчастини для підвіски',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[1].id,
        category: 'repair',
        amount: 800,
        description: 'Ремонт підвіски',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[2].id,
        category: 'purchase',
        amount: 12000,
        description: 'Купівля Volkswagen Golf',
        date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[2].id,
        category: 'repair',
        amount: 300,
        description: 'Заміна масла та фільтрів',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: expensesData, error: expensesError } = await supabase
      .from('car_expenses')
      .insert(expenses)
      .select();

    if (expensesError) {
      console.error('❌ Помилка додавання витрат:', expensesError.message);
    } else {
      console.log(`✅ Додано ${expensesData.length} витрат\n`);
    }

    // 4. Додаємо історію пробігу
    console.log('4️⃣ Додавання історії пробігу...');
    const mileageHistory = [
      {
        user_id: userId,
        car_id: carsData[0].id,
        mileage: 82000,
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[0].id,
        mileage: 84000,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[0].id,
        mileage: 85000,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[1].id,
        mileage: 118000,
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        car_id: carsData[1].id,
        mileage: 120000,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: mileageData, error: mileageError } = await supabase
      .from('mileage_history')
      .insert(mileageHistory)
      .select();

    if (mileageError) {
      console.error('❌ Помилка додавання пробігу:', mileageError.message);
    } else {
      console.log(`✅ Додано ${mileageData.length} записів пробігу\n`);
    }

    // 5. Додаємо покупців
    console.log('5️⃣ Додавання покупців...');
    const buyers = [
      {
        user_id: userId,
        name: 'Іванов Іван Іванович',
        phone: '+380501234567',
        email: 'ivanov@example.com',
        notes: 'Зацікавлений в Toyota Camry'
      },
      {
        user_id: userId,
        name: 'Петренко Петро',
        phone: '+380671234567',
        email: 'petrenko@example.com',
        notes: 'Купив VW Golf'
      },
      {
        user_id: userId,
        name: 'Сидорова Олена',
        phone: '+380931234567',
        notes: 'Питала про BMW X5'
      }
    ];

    const { data: buyersData, error: buyersError } = await supabase
      .from('buyers')
      .insert(buyers)
      .select();

    if (buyersError) {
      console.error('❌ Помилка додавання покупців:', buyersError.message);
    } else {
      console.log(`✅ Додано ${buyersData.length} покупців\n`);
    }

    // 6. Додаємо сповіщення
    console.log('6️⃣ Додавання сповіщень...');
    const notifications = [
      {
        user_id: userId,
        title: 'Нове повідомлення',
        message: 'Іванов Іван цікавиться вашим Toyota Camry',
        type: 'info',
        is_read: false
      },
      {
        user_id: userId,
        title: 'Нагадування',
        message: 'Через місяць закінчується страховка на Toyota Camry',
        type: 'warning',
        is_read: false
      },
      {
        user_id: userId,
        title: 'Успішно',
        message: 'Автомобіль VW Golf продано',
        type: 'success',
        is_read: true
      }
    ];

    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (notificationsError) {
      console.error('❌ Помилка додавання сповіщень:', notificationsError.message);
    } else {
      console.log(`✅ Додано ${notificationsData.length} сповіщень\n`);
    }

    // Підсумок
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ТЕСТОВІ ДАНІ УСПІШНО ДОДАНО!\n');
    console.log('📊 Підсумок:');
    console.log(`   🚗 Автомобілі: ${carsData.length}`);
    console.log(`   💰 Витрати: ${expensesData?.length || 0}`);
    console.log(`   📏 Пробіг: ${mileageData?.length || 0}`);
    console.log(`   👥 Покупці: ${buyersData?.length || 0}`);
    console.log(`   🔔 Сповіщення: ${notificationsData?.length || 0}\n`);
    console.log('🎯 Тепер увійдіть в додаток та перевірте дані!');

  } catch (error) {
    console.error('❌ Критична помилка:', error.message);
  }
}

addTestData();

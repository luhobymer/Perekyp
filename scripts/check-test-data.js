const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 ПЕРЕВІРКА ТЕСТОВИХ ДАНИХ\n');

async function checkData() {
  try {
    // Перевіряємо автомобілі
    console.log('1️⃣ Перевірка автомобілів...');
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*');

    if (carsError) {
      console.error('❌ Помилка:', carsError.message);
    } else {
      console.log(`✅ Знайдено автомобілів: ${cars.length}`);
      if (cars.length > 0) {
        cars.forEach(car => {
          console.log(`   - ${car.brand} ${car.model} ${car.year} (${car.status})`);
        });
      }
    }
    console.log('');

    // Перевіряємо витрати
    console.log('2️⃣ Перевірка витрат...');
    const { data: expenses, error: expensesError } = await supabase
      .from('car_expenses')
      .select('*');

    if (expensesError) {
      console.error('❌ Помилка:', expensesError.message);
    } else {
      console.log(`✅ Знайдено витрат: ${expenses.length}`);
      if (expenses.length > 0) {
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        console.log(`   💰 Загальна сума: $${total.toFixed(2)}`);
        
        const byCategory = expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
          return acc;
        }, {});
        
        Object.entries(byCategory).forEach(([category, amount]) => {
          console.log(`   - ${category}: $${amount.toFixed(2)}`);
        });
      }
    }
    console.log('');

    // Перевіряємо пробіг
    console.log('3️⃣ Перевірка історії пробігу...');
    const { data: mileage, error: mileageError } = await supabase
      .from('mileage_history')
      .select('*')
      .order('date', { ascending: false });

    if (mileageError) {
      console.error('❌ Помилка:', mileageError.message);
    } else {
      console.log(`✅ Знайдено записів: ${mileage.length}`);
    }
    console.log('');

    // Перевіряємо документи
    console.log('4️⃣ Перевірка документів...');
    const { data: documents, error: docsError } = await supabase
      .from('car_documents')
      .select('*');

    if (docsError) {
      console.error('❌ Помилка:', docsError.message);
    } else {
      console.log(`✅ Знайдено документів: ${documents.length}`);
    }
    console.log('');

    // Перевіряємо покупців
    console.log('5️⃣ Перевірка покупців...');
    const { data: buyers, error: buyersError } = await supabase
      .from('buyers')
      .select('*');

    if (buyersError) {
      console.error('❌ Помилка:', buyersError.message);
    } else {
      console.log(`✅ Знайдено покупців: ${buyers.length}`);
      if (buyers.length > 0) {
        buyers.forEach(buyer => {
          console.log(`   - ${buyer.name} (${buyer.phone})`);
        });
      }
    }
    console.log('');

    // Перевіряємо сповіщення
    console.log('6️⃣ Перевірка сповіщень...');
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*');

    if (notifError) {
      console.error('❌ Помилка:', notifError.message);
    } else {
      console.log(`✅ Знайдено сповіщень: ${notifications.length}`);
      const unread = notifications.filter(n => !n.is_read).length;
      console.log(`   📬 Непрочитаних: ${unread}`);
    }
    console.log('');

    // Підсумок
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ПІДСУМОК:');
    console.log(`   🚗 Автомобілі: ${cars?.length || 0}`);
    console.log(`   💰 Витрати: ${expenses?.length || 0}`);
    console.log(`   📏 Історія пробігу: ${mileage?.length || 0}`);
    console.log(`   📄 Документи: ${documents?.length || 0}`);
    console.log(`   👥 Покупці: ${buyers?.length || 0}`);
    console.log(`   🔔 Сповіщення: ${notifications?.length || 0}\n`);

    if (cars?.length > 0) {
      console.log('✅ ДАНІ УСПІШНО ЗАВАНТАЖЕНО З БД!');
      console.log('🎯 Тепер перевірте їх в додатку');
    } else {
      console.log('⚠️  ДАНИХ НЕ ЗНАЙДЕНО');
      console.log('💡 Додайте тестові дані через Supabase Dashboard');
      console.log('📝 Інструкція: scripts/TEST_DATA_README.md');
    }

  } catch (error) {
    console.error('❌ Помилка:', error.message);
  }
}

checkData();

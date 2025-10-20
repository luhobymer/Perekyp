/**
 * АДМІНІСТРАТИВНА ПЕРЕВІРКА БАЗИ ДАНИХ (з service_role)
 * Запуск: node scripts/checkDatabaseAdmin.js
 * 
 * УВАГА: Використовує service_role ключ для повного доступу
 */

const { createClient } = require('@supabase/supabase-js');

// Конфігурація з service_role ключем
const supabaseUrl = 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM4MDYxNSwiZXhwIjoyMDU5OTU2NjE1fQ.U4gWBL73FqvQ2E9GERgkHbq1XrbGr-iJ_b4ylSuDN98';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║    🔐 АДМІНІСТРАТИВНА ПЕРЕВІРКА БАЗИ ДАНИХ (SERVICE_ROLE)                 ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

console.log(`📡 URL: ${supabaseUrl}`);
console.log(`🔑 Service Role Key: ${serviceRoleKey.substring(0, 30)}...\n`);

// Всі таблиці з бази даних (з скріншота)
const allTables = [
  'buyers',
  'car_documents',
  'car_expenses',
  'car_images',
  'cars',
  'categories',
  'mileage_history',
  'order_items',
  'orders',
  'ownership_history',
  'products',
  'profiles',
  'service_history',
  'status_comments',
  'team_members',
  'teams'
];

async function checkTable(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { 
        exists: false, 
        error: error.message,
        count: 0,
        columns: []
      };
    }

    // Отримуємо структуру
    const { data, error: dataError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    let columns = [];
    if (data && data.length > 0) {
      columns = Object.keys(data[0]);
    }

    return {
      exists: true,
      count: count || 0,
      columns: columns,
      error: null
    };
  } catch (err) {
    return {
      exists: false,
      error: err.message,
      count: 0,
      columns: []
    };
  }
}

async function main() {
  console.log('═'.repeat(100));
  console.log('📊 ПЕРЕВІРКА ВСІХ ТАБЛИЦЬ\n');
  
  const results = {};
  let totalRecords = 0;
  let existingTables = 0;

  console.log('─'.repeat(100));
  console.log('Таблиця'.padEnd(25) + 'Статус'.padEnd(15) + 'Записів'.padEnd(15) + 'Колонок'.padEnd(15));
  console.log('─'.repeat(100));

  for (const tableName of allTables) {
    const result = await checkTable(tableName);
    results[tableName] = result;

    const statusIcon = result.exists ? '✅' : '❌';
    const status = result.exists ? 'Доступна' : 'Недоступна';
    const count = result.exists ? result.count.toString() : '-';
    const colCount = result.exists ? result.columns.length.toString() : '-';

    console.log(
      tableName.padEnd(25) +
      `${statusIcon} ${status}`.padEnd(15) +
      count.padEnd(15) +
      colCount.padEnd(15)
    );

    if (result.exists) {
      totalRecords += result.count;
      existingTables++;
    }
  }

  console.log('─'.repeat(100));

  // Статистика
  console.log(`\n📈 ЗАГАЛЬНА СТАТИСТИКА\n`);
  console.log(`✅ Доступних таблиць: ${existingTables} з ${allTables.length}`);
  console.log(`📝 Загальна кількість записів: ${totalRecords}`);
  console.log(`🎯 Відсоток доступності: ${Math.round((existingTables / allTables.length) * 100)}%\n`);

  // Детальна інформація про важливі таблиці
  console.log('═'.repeat(100));
  console.log('🔍 ДЕТАЛЬНА СТРУКТУРА КРИТИЧНИХ ТАБЛИЦЬ\n');

  const criticalTables = ['cars', 'car_expenses', 'car_documents', 'mileage_history', 'buyers'];
  
  for (const tableName of criticalTables) {
    if (results[tableName]?.exists) {
      console.log(`\n📋 Таблиця: ${tableName.toUpperCase()}`);
      console.log(`   Записів: ${results[tableName].count}`);
      console.log(`   Колонки (${results[tableName].columns.length}):`);
      
      if (results[tableName].columns.length > 0) {
        const cols = results[tableName].columns;
        for (let i = 0; i < cols.length; i += 5) {
          const chunk = cols.slice(i, i + 5);
          console.log(`      ${chunk.join(', ')}`);
        }
      }

      // Показати перший запис як приклад (якщо є)
      if (results[tableName].count > 0) {
        const { data } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (data && data.length > 0) {
          console.log(`   Приклад запису:`);
          console.log(`      ${JSON.stringify(data[0], null, 2).split('\n').join('\n      ')}`);
        }
      }
    } else {
      console.log(`\n❌ Таблиця: ${tableName.toUpperCase()} - НЕДОСТУПНА`);
      if (results[tableName]?.error) {
        console.log(`   Помилка: ${results[tableName].error}`);
      }
    }
  }

  // Аналіз непотрібних таблиць
  console.log('\n' + '═'.repeat(100));
  console.log('⚠️  НЕПОТРІБНІ E-COMMERCE ТАБЛИЦІ\n');

  const ecommerceTables = ['categories', 'products', 'orders', 'order_items'];
  const existingEcommerce = ecommerceTables.filter(t => results[t]?.exists);

  if (existingEcommerce.length > 0) {
    console.log('Знайдено непотрібні таблиці для додатку автоперекупу:');
    existingEcommerce.forEach(table => {
      console.log(`   - ${table} (${results[table].count} записів)`);
    });
    console.log('\n💡 Рекомендація: Видалити ці таблиці, якщо вони не використовуються');
  } else {
    console.log('✅ Непотрібних таблиць не знайдено');
  }

  // Перевірка зв'язків
  if (results.cars?.exists && results.cars.count > 0) {
    console.log('\n' + '═'.repeat(100));
    console.log('🔗 ПЕРЕВІРКА ЗВ\'ЯЗКІВ МІЖ ТАБЛИЦЯМИ\n');

    // Перевіряємо, чи є дані в пов'язаних таблицях
    const checks = [
      { from: 'cars', to: 'car_expenses', desc: 'Авто → Витрати' },
      { from: 'cars', to: 'car_documents', desc: 'Авто → Документи' },
      { from: 'cars', to: 'car_images', desc: 'Авто → Зображення' },
      { from: 'cars', to: 'mileage_history', desc: 'Авто → Пробіг' },
      { from: 'cars', to: 'buyers', desc: 'Авто → Покупці' }
    ];

    for (const check of checks) {
      if (results[check.to]?.exists) {
        const ratio = results[check.to].count / results[check.from].count;
        const status = results[check.to].count > 0 ? '✅' : '⚠️';
        console.log(`${status} ${check.desc.padEnd(25)} - ${results[check.to].count} записів (${ratio.toFixed(2)} на авто)`);
      }
    }
  }

  // Висновок
  console.log('\n' + '═'.repeat(100));
  console.log('📝 ВИСНОВОК\n');

  const missingCritical = criticalTables.filter(t => !results[t]?.exists);
  
  if (missingCritical.length > 0) {
    console.log('❌ КРИТИЧНІ ПРОБЛЕМИ:');
    console.log(`   Відсутні важливі таблиці: ${missingCritical.join(', ')}`);
  } else if (existingTables === allTables.length) {
    console.log('✅ Всі таблиці доступні!');
    console.log('✅ База даних повністю готова до роботи!');
    
    if (totalRecords === 0) {
      console.log('\nℹ️  База даних порожня. Готова до створення тестових даних.');
    } else {
      console.log(`\n✅ В базі є дані (${totalRecords} записів)`);
    }
  }

  console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                        ✅ ПЕРЕВІРКА ЗАВЕРШЕНА                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

  return results;
}

main()
  .then(() => {
    console.log('💡 НАСТУПНИЙ КРОК: Налаштувати RLS політики для anon ключа\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ КРИТИЧНА ПОМИЛКА:', error.message);
    process.exit(1);
  });

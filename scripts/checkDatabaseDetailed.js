/**
 * ДЕТАЛЬНА ПЕРЕВІРКА СТРУКТУРИ БАЗИ ДАНИХ SUPABASE
 * Запуск: node scripts/checkDatabaseDetailed.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey.includes('your_supabase')) {
  console.error('❌ ПОМИЛКА: API ключ не налаштований!\n');
  console.error('Відкрийте Supabase Dashboard і скопіюйте "anon public" ключ:');
  console.error(`${supabaseUrl}/project/_/settings/api\n`);
  console.error('Потім вставте його в .env файл:\n');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║         🔍 ДЕТАЛЬНА ПЕРЕВІРКА БАЗИ ДАНИХ SUPABASE                         ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

console.log(`📡 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 5)}\n`);

// Всі таблиці, що є в Supabase (з скріншота)
const allTables = [
  // Основні таблиці додатку автоперекупу
  { name: 'cars', category: 'app', priority: 'critical', description: '🚗 Автомобілі' },
  { name: 'car_expenses', category: 'app', priority: 'critical', description: '💰 Витрати на авто' },
  { name: 'car_documents', category: 'app', priority: 'high', description: '📄 Документи авто' },
  { name: 'car_images', category: 'app', priority: 'high', description: '🖼️  Зображення авто' },
  { name: 'mileage_history', category: 'app', priority: 'high', description: '📊 Історія пробігу' },
  { name: 'buyers', category: 'app', priority: 'high', description: '👤 Покупці' },
  { name: 'service_history', category: 'app', priority: 'medium', description: '🔧 Історія обслуговування' },
  { name: 'ownership_history', category: 'app', priority: 'medium', description: '📋 Історія володіння' },
  { name: 'status_comments', category: 'app', priority: 'low', description: '💬 Коментарі статусу' },
  
  // Системні таблиці
  { name: 'profiles', category: 'system', priority: 'medium', description: '👥 Профілі користувачів' },
  { name: 'teams', category: 'system', priority: 'low', description: '🏢 Команди' },
  { name: 'team_members', category: 'system', priority: 'low', description: '👨‍💼 Члени команд' },
  
  // E-commerce таблиці (не потрібні для автоперекупу)
  { name: 'categories', category: 'ecommerce', priority: 'unused', description: '📦 Категорії (e-commerce)' },
  { name: 'products', category: 'ecommerce', priority: 'unused', description: '🛍️  Товари (e-commerce)' },
  { name: 'orders', category: 'ecommerce', priority: 'unused', description: '🛒 Замовлення (e-commerce)' },
  { name: 'order_items', category: 'ecommerce', priority: 'unused', description: '📦 Елементи замовлень (e-commerce)' },
];

async function getTableInfo(tableName) {
  try {
    // Отримуємо кількість записів
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return { 
        exists: false, 
        error: countError.message,
        count: 0,
        columns: []
      };
    }

    // Отримуємо структуру (перший запис)
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

function getPriorityIcon(priority) {
  const icons = {
    'critical': '🔴',
    'high': '🟠',
    'medium': '🟡',
    'low': '🟢',
    'unused': '⚪'
  };
  return icons[priority] || '⚪';
}

async function checkAllTables() {
  console.log('═'.repeat(100));
  console.log('📊 ОГЛЯД ВСІХ ТАБЛИЦЬ\n');
  
  const results = {};
  const categories = {
    app: [],
    system: [],
    ecommerce: []
  };

  // Перевірка всіх таблиць
  for (const table of allTables) {
    process.stdout.write(`Перевірка ${table.name}...`);
    
    const info = await getTableInfo(table.name);
    results[table.name] = { ...table, ...info };
    categories[table.category].push(results[table.name]);
    
    process.stdout.write(info.exists ? ' ✅\n' : ' ❌\n');
  }

  console.log('\n' + '═'.repeat(100));
  
  // Виведення результатів по категоріях
  console.log('\n🚗 ТАБЛИЦІ ДОДАТКУ АВТОПЕРЕКУПУ\n');
  console.log('─'.repeat(100));
  console.log('Назва таблиці'.padEnd(25) + 'Статус'.padEnd(15) + 'Записів'.padEnd(12) + 'Пріоритет'.padEnd(15) + 'Опис');
  console.log('─'.repeat(100));
  
  categories.app.forEach(table => {
    const status = table.exists ? '✅ Існує' : '❌ Відсутня';
    const count = table.exists ? table.count.toString() : '-';
    const priority = `${getPriorityIcon(table.priority)} ${table.priority}`;
    
    console.log(
      table.name.padEnd(25) +
      status.padEnd(15) +
      count.padEnd(12) +
      priority.padEnd(15) +
      table.description
    );
    
    // Показуємо колонки для важливих таблиць
    if (table.exists && table.columns.length > 0 && ['critical', 'high'].includes(table.priority)) {
      console.log(`   └─ Колонки (${table.columns.length}): ${table.columns.join(', ')}`);
    }
  });

  console.log('\n' + '─'.repeat(100));
  console.log('\n🏢 СИСТЕМНІ ТАБЛИЦІ\n');
  console.log('─'.repeat(100));
  
  categories.system.forEach(table => {
    const status = table.exists ? '✅ Існує' : '❌ Відсутня';
    const count = table.exists ? table.count.toString() : '-';
    
    console.log(
      table.name.padEnd(25) +
      status.padEnd(15) +
      count.padEnd(12) +
      table.description
    );
  });

  console.log('\n' + '─'.repeat(100));
  console.log('\n📦 E-COMMERCE ТАБЛИЦІ (не використовуються додатком)\n');
  console.log('─'.repeat(100));
  
  categories.ecommerce.forEach(table => {
    const status = table.exists ? '⚠️  Існує' : '✅ Відсутня';
    const count = table.exists ? table.count.toString() : '-';
    
    console.log(
      table.name.padEnd(25) +
      status.padEnd(15) +
      count.padEnd(12) +
      table.description
    );
  });

  return { results, categories };
}

async function analyzeDatabase(results, categories) {
  console.log('\n' + '═'.repeat(100));
  console.log('📈 АНАЛІЗ СТАНУ БАЗИ ДАНИХ\n');

  // Статистика
  const appTables = categories.app;
  const existingAppTables = appTables.filter(t => t.exists).length;
  const criticalTables = appTables.filter(t => t.priority === 'critical');
  const missingCritical = criticalTables.filter(t => !t.exists);
  const totalRecords = Object.values(results).reduce((sum, t) => sum + (t.count || 0), 0);

  console.log(`📊 Всього таблиць додатку: ${appTables.length}`);
  console.log(`✅ Існуючих: ${existingAppTables}`);
  console.log(`❌ Відсутніх: ${appTables.length - existingAppTables}`);
  console.log(`📝 Загальна кількість записів: ${totalRecords}`);
  console.log(`🎯 Готовність БД: ${Math.round((existingAppTables / appTables.length) * 100)}%\n`);

  // Критичні проблеми
  const issues = [];
  const warnings = [];
  const recommendations = [];

  if (missingCritical.length > 0) {
    issues.push('🔴 КРИТИЧНО: Відсутні критичні таблиці:');
    missingCritical.forEach(t => {
      issues.push(`   - ${t.name}: ${t.description}`);
    });
  }

  // Перевірка структури cars
  if (results.cars?.exists) {
    const requiredColumns = ['id', 'user_id', 'brand', 'model', 'year', 'status', 'mileage'];
    const missingColumns = requiredColumns.filter(col => !results.cars.columns.includes(col));
    
    if (missingColumns.length > 0) {
      warnings.push(`⚠️ Таблиця CARS: відсутні важливі колонки: ${missingColumns.join(', ')}`);
    } else {
      console.log('✅ Таблиця CARS має всі необхідні поля');
    }
  }

  // Перевірка структури car_expenses
  if (results.car_expenses?.exists) {
    const requiredColumns = ['id', 'car_id', 'amount', 'expense_type', 'date'];
    const missingColumns = requiredColumns.filter(col => !results.car_expenses.columns.includes(col));
    
    if (missingColumns.length > 0) {
      warnings.push(`⚠️ Таблиця CAR_EXPENSES: відсутні важливі колонки: ${missingColumns.join(', ')}`);
    } else {
      console.log('✅ Таблиця CAR_EXPENSES має всі необхідні поля');
    }
  }

  // E-commerce таблиці
  const unusedTables = categories.ecommerce.filter(t => t.exists);
  if (unusedTables.length > 0) {
    recommendations.push(`💡 Рекомендація: Видалити непотрібні e-commerce таблиці: ${unusedTables.map(t => t.name).join(', ')}`);
    recommendations.push('   Ці таблиці не використовуються додатком і займають місце.');
  }

  // Відсутні таблиці
  const missingHigh = appTables.filter(t => !t.exists && t.priority === 'high');
  if (missingHigh.length > 0) {
    warnings.push(`⚠️ Відсутні важливі таблиці: ${missingHigh.map(t => t.name).join(', ')}`);
  }

  // Виведення проблем
  console.log('\n' + '═'.repeat(100));
  
  if (issues.length > 0) {
    console.log('\n🚨 КРИТИЧНІ ПРОБЛЕМИ:\n');
    issues.forEach(issue => console.log(issue));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  ПОПЕРЕДЖЕННЯ:\n');
    warnings.forEach(warning => console.log(warning));
  }

  if (recommendations.length > 0) {
    console.log('\n💡 РЕКОМЕНДАЦІЇ:\n');
    recommendations.forEach(rec => console.log(rec));
  }

  if (issues.length === 0 && warnings.length === 0) {
    console.log('\n✅ База даних в чудовому стані!');
  }

  return {
    hasIssues: issues.length > 0,
    hasWarnings: warnings.length > 0,
    readiness: Math.round((existingAppTables / appTables.length) * 100)
  };
}

async function checkDataConsistency(results) {
  console.log('\n' + '═'.repeat(100));
  console.log('🔗 ПЕРЕВІРКА ЗВ\'ЯЗКІВ МІЖ ТАБЛИЦЯМИ\n');

  if (!results.cars?.exists) {
    console.log('⚠️ Неможливо перевірити зв\'язки - таблиця CARS відсутня\n');
    return;
  }

  // Перевіряємо зв'язки
  const checks = [];

  // cars -> car_expenses
  if (results.car_expenses?.exists && results.cars.count > 0) {
    const { count } = await supabase
      .from('car_expenses')
      .select('*', { count: 'exact', head: true });
    
    checks.push({
      name: 'Cars → Expenses',
      status: count > 0 ? '✅' : '⚠️',
      info: `${results.cars.count} авто, ${count} витрат`
    });
  }

  // cars -> mileage_history
  if (results.mileage_history?.exists && results.cars.count > 0) {
    const { count } = await supabase
      .from('mileage_history')
      .select('*', { count: 'exact', head: true });
    
    checks.push({
      name: 'Cars → Mileage',
      status: count > 0 ? '✅' : '⚠️',
      info: `${results.cars.count} авто, ${count} записів пробігу`
    });
  }

  // cars -> car_documents
  if (results.car_documents?.exists && results.cars.count > 0) {
    const { count } = await supabase
      .from('car_documents')
      .select('*', { count: 'exact', head: true });
    
    checks.push({
      name: 'Cars → Documents',
      status: count > 0 ? '✅' : '⚠️',
      info: `${results.cars.count} авто, ${count} документів`
    });
  }

  checks.forEach(check => {
    console.log(`${check.status} ${check.name.padEnd(25)} - ${check.info}`);
  });
}

// Головна функція
async function main() {
  try {
    const { results, categories } = await checkAllTables();
    const analysis = await analyzeDatabase(results, categories);
    await checkDataConsistency(results);

    console.log('\n' + '═'.repeat(100));
    console.log('\n📝 ДЕТАЛЬНА ІНФОРМАЦІЯ В SUPABASE DASHBOARD:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/_/editor\n`);

    console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        ✅ ПЕРЕВІРКА ЗАВЕРШЕНА                              ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

    // Висновок
    if (analysis.hasIssues) {
      console.log('❌ Є критичні проблеми! Додаток не працюватиме коректно.\n');
      process.exit(1);
    } else if (analysis.readiness < 80) {
      console.log(`⚠️  База даних неповна (${analysis.readiness}%). Деякий функціонал може не працювати.\n`);
      process.exit(0);
    } else {
      console.log(`✅ База даних готова до роботи (${analysis.readiness}%)!\n`);
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ КРИТИЧНА ПОМИЛКА:', error.message);
    console.error('\nМожливі причини:');
    console.error('1. Неправильний EXPO_PUBLIC_SUPABASE_URL');
    console.error('2. Неправильний EXPO_PUBLIC_SUPABASE_ANON_KEY');
    console.error('3. Проект Supabase не активний');
    console.error('4. Немає інтернет-з\'єднання\n');
    process.exit(1);
  }
}

main();

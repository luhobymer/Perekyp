const https = require('https');

const SUPABASE_URL = 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';

console.log('🔍 ПЕРЕВІРЯЮ ВСІ ТАБЛИЦІ В БАЗІ ДАНИХ...\n');

// Таблиці які я бачу на скріншоті
const existingTables = [
  'buyers',
  'car_documents', 
  'car_expenses',
  'car_images',
  'cars',
  'mileage_history',
  'ownership_history',
  'profiles',
  'service_history',
  'status_comments',
  'team_members',
  'teams'
];

// Таблиці які потрібні для додатку
const requiredTables = [
  'profiles',
  'cars',
  'expenses',
  'documents',
  'notifications'
];

let checkedCount = 0;
const results = {
  existing: [],
  missing: [],
  extra: []
};

console.log('📋 ТАБЛИЦІ З СКРІНШОТУ:');
existingTables.forEach(table => console.log(`   • ${table}`));
console.log('');

console.log('🔍 Перевіряю які таблиці потрібні для додатку...\n');

requiredTables.forEach((table, index) => {
  setTimeout(() => {
    const options = {
      hostname: 'kjnbhiyrxtdaohxssynx.supabase.co',
      port: 443,
      path: '/rest/v1/' + table + '?select=id&limit=1',
      method: 'GET',
      headers: {
        'apikey': API_KEY,
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        checkedCount++;
        
        if (res.statusCode === 200) {
          console.log(`✅ ${table} - ІСНУЄ`);
          results.existing.push(table);
        } else {
          console.log(`❌ ${table} - НЕ ІСНУЄ`);
          results.missing.push(table);
        }

        if (checkedCount === requiredTables.length) {
          console.log('\n📊 АНАЛІЗ БАЗИ ДАНИХ:');
          console.log('═══════════════════════════════════════');
          
          console.log('\n✅ ГОТОВІ ТАБЛИЦІ ДЛЯ ДОДАТКУ:');
          if (results.existing.includes('profiles')) console.log('   ✓ profiles (користувачі)');
          if (results.existing.includes('cars')) console.log('   ✓ cars (автомобілі)');
          if (results.existing.includes('expenses')) console.log('   ✓ expenses (витрати)');
          if (results.existing.includes('documents')) console.log('   ✓ documents (документи)');
          if (results.existing.includes('notifications')) console.log('   ✓ notifications (сповіщення)');
          
          console.log('\n📋 ДОДАТКОВІ ТАБЛИЦІ (вже є):');
          console.log('   • car_documents - документи автомобілів');
          console.log('   • car_expenses - витрати автомобілів');
          console.log('   • car_images - зображення автомобілів');
          console.log('   • mileage_history - історія пробігу');
          console.log('   • ownership_history - історія власності');
          console.log('   • service_history - історія обслуговування');
          console.log('   • buyers - покупці');
          console.log('   • teams - команди');
          console.log('   • team_members - члени команд');
          console.log('   • status_comments - коментарі статусу');
          
          if (results.missing.length > 0) {
            console.log('\n❌ ВІДСУТНІ ТАБЛИЦІ:');
            results.missing.forEach(table => {
              if (table === 'expenses') console.log('   ✗ expenses - МОЖНА ВИКОРИСТАТИ car_expenses');
              else if (table === 'documents') console.log('   ✗ documents - МОЖНА ВИКОРИСТАТИ car_documents');
              else console.log(`   ✗ ${table}`);
            });
          }
          
          console.log('\n💡 ВИСНОВОК:');
          if (results.missing.includes('expenses') && existingTables.includes('car_expenses')) {
            console.log('   ℹ️  Таблиця car_expenses може замінити expenses');
          }
          if (results.missing.includes('documents') && existingTables.includes('car_documents')) {
            console.log('   ℹ️  Таблиця car_documents може замінити documents');
          }
          if (results.missing.includes('notifications')) {
            console.log('   ⚠️  Потрібно створити таблицю notifications');
          }
          
          if (results.missing.length === 0) {
            console.log('   🎉 Всі необхідні таблиці існують!');
            console.log('   🚀 Можна запускати додаток: npm run start');
          } else {
            console.log('\n🔧 РЕКОМЕНДАЦІЇ:');
            console.log('   1. Перевірити чи car_expenses та car_documents мають правильну структуру');
            console.log('   2. Створити таблицю notifications якщо потрібна');
            console.log('   3. Оновити код додатку для використання існуючих таблиць');
          }
        }
      });
    });

    req.on('error', (err) => {
      checkedCount++;
      console.log(`❌ ${table} - ПОМИЛКА: ${err.message}`);
    });

    req.end();
  }, index * 200);
});

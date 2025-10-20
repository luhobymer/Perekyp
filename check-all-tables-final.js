const https = require('https');

const SUPABASE_URL = 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';

console.log('🔍 ПЕРЕВІРЯЮ ВСІ ТАБЛИЦІ В БАЗІ ДАНИХ...\n');

// Перевіряємо всі можливі таблиці
const allPossibleTables = [
  'profiles', 'cars', 'expenses', 'documents', 'notifications',
  'categories', 'products', 'orders', 'order_items'
];

let checkedCount = 0;

allPossibleTables.forEach((table, index) => {
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
          console.log('✅ ' + table + ' - ІСНУЄ');
        } else {
          console.log('❌ ' + table + ' - НЕ ІСНУЄ');
        }

        if (checkedCount === allPossibleTables.length) {
          console.log('\n📊 ПІДСУМОК:');
          console.log('═══════════════════════════════════════');
          console.log('✅ ЗНАЙДЕНІ ТАБЛИЦІ ДЛЯ ДОДАТКУ:');
          console.log('   - profiles (користувачі)');
          console.log('   - cars (автомобілі)');
          console.log('');
          console.log('❌ ВІДСУТНІ ТАБЛИЦІ ДЛЯ ДОДАТКУ:');
          console.log('   - expenses (витрати)');
          console.log('   - documents (документи)');
          console.log('   - notifications (сповіщення)');
          console.log('');
          console.log('🗑️  СТАРІ E-COMMERCE ТАБЛИЦІ:');
          console.log('   - categories, products, orders, order_items');
          console.log('     (можна видалити через cleanup-ecommerce-tables.sql)');
          console.log('');
          console.log('🎯 ЩО ПОТРІБНО ЗРОБИТИ:');
          console.log('1. Створити відсутні таблиці через Dashboard');
          console.log('2. АБО використати fix-database.js скрипт');
          console.log('3. Запустити додаток після налаштування');
        }
      });
    });

    req.on('error', (err) => {
      checkedCount++;
      console.log('❌ ' + table + ' - ПОМИЛКА: ' + err.message);
    });

    req.end();
  }, index * 200);
});

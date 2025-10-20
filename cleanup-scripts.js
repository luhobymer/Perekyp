const fs = require('fs');
const path = require('path');

console.log('🧹 ОЧИЩЕННЯ ЗАЙВИХ СКРИПТІВ ТА ФАЙЛІВ\n');

// Список файлів для видалення
const filesToDelete = [
  // Тестові скрипти
  'test-curl.txt',
  'test-supabase.js',
  'check-supabase.bat',
  
  // Дублюючі скрипти перевірки БД
  'check-database.bat',
  'check-database.ps1',
  'check-database.sh',
  'check-database.js',
  'check-tables.js',
  'check-all-tables.js',
  
  // Скрипти налаштування БД (дублюються)
  'fix-database.js',
  'fix-database.ps1',
  'fix-database.sh',
  'setup-database.js',
  'setup-complete-database.js',
  'setup-complete-database.ps1',
  'setup-complete-database.sh',
  'add-notifications-table.js',
  
  // Тимчасові звіти
  'database-setup-report.json',
  
  // Зайві перевірочні скрипти
  'check-project-config.js'
];

// Файли які залишаємо
const filesToKeep = [
  'analyze-existing-database.js',       // Корисний для аналізу БД
  'check-all-tables-final.js',          // Фінальна перевірка
  'CREATE_NOTIFICATIONS_TABLE.sql',     // SQL для створення notifications
  'check-database.sql',                 // Корисний SQL для перевірки
  'DATABASE_CHECK_README.md',           // Документація
  'DATABASE_FIX_README.md',             // Документація
  'LAUNCH_READINESS_REPORT.md',         // Фінальний звіт
  'PROJECT_STATUS_REPORT.md'            // Статус проекту
];

let deletedCount = 0;
let skippedCount = 0;

console.log('📋 Файли які будуть видалені:\n');

filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`   ✅ Видалено: ${file}`);
      deletedCount++;
    } catch (error) {
      console.log(`   ❌ Помилка видалення ${file}: ${error.message}`);
      skippedCount++;
    }
  } else {
    console.log(`   ⚠️  Не знайдено: ${file}`);
    skippedCount++;
  }
});

console.log('\n📋 Файли які залишаємо:\n');
filesToKeep.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${file}`);
  }
});

console.log('\n📊 РЕЗУЛЬТАТИ:');
console.log(`   Видалено: ${deletedCount} файлів`);
console.log(`   Пропущено: ${skippedCount} файлів`);
console.log(`   Залишено корисних: ${filesToKeep.length} файлів`);

console.log('\n✅ Очищення завершено!');
console.log('\n📁 ЗАЛИШИЛИСЬ ТІЛЬКИ КОРИСНІ ФАЙЛИ:');
console.log('   • analyze-existing-database.js - аналіз БД');
console.log('   • check-all-tables-final.js - фінальна перевірка таблиць');
console.log('   • CREATE_NOTIFICATIONS_TABLE.sql - SQL для notifications');
console.log('   • check-database.sql - детальна перевірка БД');
console.log('   • DATABASE_CHECK_README.md - інструкції по БД');
console.log('   • DATABASE_FIX_README.md - інструкції по виправленню');
console.log('   • LAUNCH_READINESS_REPORT.md - звіт про готовність');
console.log('   • PROJECT_STATUS_REPORT.md - статус проекту');
console.log('\n🎯 Міграції в supabase/migrations/ залишені без змін');

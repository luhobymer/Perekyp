const fs = require('fs');
const path = require('path');

console.log('🔍 ПЕРЕВІРКА ПЕРЕКЛАДІВ У ПРОЕКТІ\n');

// Завантажуємо файли перекладів
const ukTranslations = require('./locales/uk/translation.json');
const ruTranslations = require('./locales/ru/translation.json');

// Функція для отримання всіх ключів з об'єкта
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Отримуємо всі ключі з файлів перекладів
const ukKeys = getAllKeys(ukTranslations);
const ruKeys = getAllKeys(ruTranslations);

console.log('📊 СТАТИСТИКА ПЕРЕКЛАДІВ:');
console.log(`   🇺🇦 Українська: ${ukKeys.length} ключів`);
console.log(`   🇷🇺 Російська: ${ruKeys.length} ключів\n`);

// Перевіряємо, чи всі ключі є в обох мовах
const missingInRu = ukKeys.filter(key => !ruKeys.includes(key));
const missingInUk = ruKeys.filter(key => !ukKeys.includes(key));

if (missingInRu.length > 0) {
  console.log('❌ ВІДСУТНІ В РОСІЙСЬКІЙ:');
  missingInRu.forEach(key => console.log(`   - ${key}`));
  console.log('');
}

if (missingInUk.length > 0) {
  console.log('❌ ВІДСУТНІ В УКРАЇНСЬКІЙ:');
  missingInUk.forEach(key => console.log(`   - ${key}`));
  console.log('');
}

// Функція для пошуку використання t() у коді
function findTranslationKeys(dir, keys = new Set()) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
        findTranslationKeys(filePath, keys);
      }
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Шукаємо всі виклики t('key')
      const regex = /t\(['"`]([^'"`]+)['"`]\)/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
      }
    }
  });
  
  return keys;
}

console.log('🔍 ШУКАЮ ВИКОРИСТАННЯ ПЕРЕКЛАДІВ У КОДІ...\n');

const usedKeys = findTranslationKeys('./');
const usedKeysArray = Array.from(usedKeys);

console.log(`📝 ЗНАЙДЕНО ${usedKeysArray.length} унікальних ключів у коді\n`);

// Перевіряємо, чи всі використані ключі є в перекладах
const missingKeys = usedKeysArray.filter(key => !ukKeys.includes(key));

if (missingKeys.length > 0) {
  console.log('❌ КЛЮЧІ ВИКОРИСТАНІ В КОДІ, АЛЕ ВІДСУТНІ В ПЕРЕКЛАДАХ:');
  console.log('   (Ці ключі потрібно додати в translation.json)\n');
  
  // Групуємо за категоріями
  const grouped = {};
  missingKeys.forEach(key => {
    const category = key.split('.')[0];
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(key);
  });
  
  Object.entries(grouped).sort().forEach(([category, keys]) => {
    console.log(`   📁 ${category}:`);
    keys.forEach(key => console.log(`      - ${key}`));
    console.log('');
  });
} else {
  console.log('✅ ВСІ ВИКОРИСТАНІ КЛЮЧІ ПРИСУТНІ В ПЕРЕКЛАДАХ!\n');
}

// Перевіряємо невикористані ключі
const unusedKeys = ukKeys.filter(key => !usedKeysArray.includes(key));

if (unusedKeys.length > 0) {
  console.log(`ℹ️  НЕВИКОРИСТАНІ КЛЮЧІ В ПЕРЕКЛАДАХ (${unusedKeys.length}):`);
  console.log('   (Можна видалити для очищення)\n');
  
  const grouped = {};
  unusedKeys.forEach(key => {
    const category = key.split('.')[0];
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(key);
  });
  
  Object.entries(grouped).sort().forEach(([category, keys]) => {
    console.log(`   📁 ${category}: ${keys.length} ключів`);
  });
  console.log('');
}

// Підсумок
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📋 ПІДСУМОК:');
console.log(`   ✅ Всього ключів в UK: ${ukKeys.length}`);
console.log(`   ✅ Всього ключів в RU: ${ruKeys.length}`);
console.log(`   📝 Використано в коді: ${usedKeysArray.length}`);
console.log(`   ❌ Відсутні переклади: ${missingKeys.length}`);
console.log(`   ⚠️  Невикористані: ${unusedKeys.length}`);
console.log(`   ${missingInRu.length > 0 ? '❌' : '✅'} Несинхронізовані RU: ${missingInRu.length}`);
console.log(`   ${missingInUk.length > 0 ? '❌' : '✅'} Несинхронізовані UK: ${missingInUk.length}\n`);

if (missingKeys.length === 0 && missingInRu.length === 0 && missingInUk.length === 0) {
  console.log('🎉 ПЕРЕКЛАДИ В ІДЕАЛЬНОМУ СТАНІ!\n');
} else {
  console.log('⚠️  ПОТРІБНО ВИПРАВИТИ ПЕРЕКЛАДИ\n');
}

/**
 * Скрипт для автоматичного виправлення імпортів з аліасами @/ у проекті
 * 
 * Цей скрипт знаходить всі файли TypeScript/JavaScript у проекті,
 * які використовують аліаси @/ для імпортів, і замінює їх на відносні шляхи.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Функція для визначення відносного шляху між двома файлами
function getRelativePath(fromFile, toModule) {
  // Отримуємо абсолютний шлях до модуля
  let modulePath = '';
  
  if (toModule.startsWith('@/src/')) {
    modulePath = path.join(process.cwd(), 'src', toModule.substring(6));
  } else if (toModule.startsWith('@/')) {
    modulePath = path.join(process.cwd(), toModule.substring(2));
  } else {
    return toModule; // Не змінюємо шлях, якщо це не аліас
  }
  
  // Отримуємо директорію файлу, з якого імпортуємо
  const fromDir = path.dirname(fromFile);
  
  // Створюємо відносний шлях
  let relativePath = path.relative(fromDir, modulePath);
  
  // Якщо шлях не починається з './' або '../', додаємо './'
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Замінюємо зворотні слеші на прямі (для Windows)
  relativePath = relativePath.replace(/\\/g, '/');
  
  return relativePath;
}

// Функція для виправлення імпортів у файлі
function fixImportsInFile(filePath) {
  console.log(`Обробка файлу: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Знаходимо всі імпорти з аліасами @/
    const importRegex = /import\s+(?:(?:{[^}]*})|(?:[\w*]+))\s+from\s+['"](@\/[^'"]+)['"]/g;
    const requireRegex = /(?:const|let|var)\s+(?:(?:{[^}]*})|(?:[\w*]+))\s+=\s+require\s*\(\s*['"](@\/[^'"]+)['"]\s*\)/g;
    
    // Замінюємо імпорти з аліасами @/ на відносні шляхи
    content = content.replace(importRegex, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      modified = true;
      return match.replace(importPath, relativePath);
    });
    
    // Замінюємо require з аліасами @/ на відносні шляхи
    content = content.replace(requireRegex, (match, importPath) => {
      const relativePath = getRelativePath(filePath, importPath);
      modified = true;
      return match.replace(importPath, relativePath);
    });
    
    // Зберігаємо зміни, якщо файл був модифікований
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Виправлено імпорти у файлі: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Помилка при обробці файлу ${filePath}:`, error);
  }
}

// Головна функція
function main() {
  console.log('🔍 Пошук файлів з аліасами імпортів...');
  
  // Знаходимо всі TypeScript/JavaScript файли у проекті
  const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', 'scripts/**', 'build/**', 'dist/**'],
    cwd: process.cwd(),
    absolute: true,
  });
  
  console.log(`Знайдено ${files.length} файлів для перевірки.`);
  
  // Обробляємо кожен файл
  let fixedCount = 0;
  for (const file of files) {
    try {
      // Перевіряємо, чи файл містить аліаси @/
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('@/')) {
        fixImportsInFile(file);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Помилка при перевірці файлу ${file}:`, error);
    }
  }
  
  console.log(`\n✨ Готово! Виправлено імпорти у ${fixedCount} файлах.`);
}

// Запускаємо головну функцію
main();

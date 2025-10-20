/**
 * @fileoverview Скрипт для автоматичної оптимізації зображень у проєкті PerekypApp
 * @description Цей скрипт сканує визначені директорії з зображеннями та оптимізує їх розмір без суттєвої втрати якості.
 * Використовує бібліотеку sharp для обробки зображень та зменшення їх розміру.
 * 
 * Підтримувані формати: JPEG, PNG, WebP, GIF.
 * 
 * @requires sharp - Бібліотека для обробки зображень (npm install sharp)
 * @requires fs - Вбудований модуль Node.js для роботи з файловою системою
 * @requires path - Вбудований модуль Node.js для роботи з шляхами
 * @requires child_process - Вбудований модуль Node.js для запуску зовнішніх процесів
 * 
 * @example
 * // Запуск скрипту з командного рядка
 * node scripts/optimizeImages.js
 * 
 * // Або через npm-скрипт
 * npm run optimize-images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Скрипт для оптимізації зображень у проекті
 * Вимагає встановлення sharp: npm install sharp
 */

/**
 * @constant {string[]} IMAGE_DIRS - Масив шляхів до директорій з зображеннями для оптимізації
 */
const IMAGE_DIRS = [
  path.join(__dirname, '../assets/images'),
  path.join(__dirname, '../assets/icons'),
];

/**
 * @constant {string[]} IMAGE_EXTENSIONS - Масив підтримуваних розширень файлів зображень
 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * @function findFiles
 * @description Рекурсивно шукає файли з вказаними розширеннями у директорії та її піддиректоріях
 * 
 * @param {string} dir - Шлях до директорії для пошуку
 * @param {string[]} extensions - Масив розширень файлів для пошуку
 * @returns {string[]} Масив повних шляхів до знайдених файлів
 */
function findFiles(dir, extensions) {
  let results = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`Директорія ${dir} не існує. Пропускаємо.`);
    return results;
  }
  
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Рекурсивний пошук у піддиректоріях
      results = results.concat(findFiles(filePath, extensions));
    } else {
      // Перевірка розширення файлу
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * @function optimizeImages
 * @description Головна функція для оптимізації зображень. Знаходить всі зображення у вказаних директоріях,
 * оптимізує їх за допомогою sharp і зберігає оптимізовані версії, якщо вони менші за розміром.
 * 
 * @async
 * @returns {Promise<void>} Promise, який резолвиться після завершення оптимізації всіх зображень
 */
async function optimizeImages() {
  try {
    // Встановлення sharp, якщо він не встановлений
    try {
      require.resolve('sharp');
      console.log('Sharp вже встановлено.');
    } catch (e) {
      console.log('Встановлення sharp...');
      execSync('npm install sharp --save-dev');
    }
    
    const sharp = require('sharp');
    
    // Знаходження всіх зображень
    let imagesToOptimize = [];
    
    IMAGE_DIRS.forEach(dir => {
      const images = findFiles(dir, IMAGE_EXTENSIONS);
      imagesToOptimize = imagesToOptimize.concat(images);
    });
    
    console.log(`Знайдено ${imagesToOptimize.length} зображень для оптимізації.`);
    
    // Оптимізація кожного зображення
    for (const imagePath of imagesToOptimize) {
      const ext = path.extname(imagePath).toLowerCase();
      const optimizedPath = imagePath.replace(ext, `.opt${ext}`);
      
      console.log(`Оптимізація: ${imagePath}`);
      
      try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        
        // Різні налаштування в залежності від формату
        if (ext === '.jpg' || ext === '.jpeg') {
          await image
            .jpeg({ quality: 80, progressive: true })
            .toFile(optimizedPath);
        } else if (ext === '.png') {
          await image
            .png({ compressionLevel: 9, progressive: true })
            .toFile(optimizedPath);
        } else if (ext === '.webp') {
          await image
            .webp({ quality: 80 })
            .toFile(optimizedPath);
        } else if (ext === '.gif') {
          // GIF просто копіюємо, оскільки sharp не оптимізує GIF належним чином
          fs.copyFileSync(imagePath, optimizedPath);
        }
        
        // Порівняння розмірів
        const originalSize = fs.statSync(imagePath).size;
        const optimizedSize = fs.statSync(optimizedPath).size;
        const savings = originalSize - optimizedSize;
        const savingsPercent = (savings / originalSize) * 100;
        
        console.log(`  Оригінальний розмір: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  Оптимізований розмір: ${(optimizedSize / 1024).toFixed(2)} KB`);
        console.log(`  Економія: ${(savings / 1024).toFixed(2)} KB (${savingsPercent.toFixed(2)}%)`);
        
        // Якщо оптимізоване зображення менше, замінюємо оригінал
        if (optimizedSize < originalSize) {
          fs.renameSync(optimizedPath, imagePath);
          console.log(`  Замінено оригінал оптимізованою версією.`);
        } else {
          fs.unlinkSync(optimizedPath);
          console.log(`  Оптимізація не дала переваг, залишено оригінал.`);
        }
      } catch (err) {
        console.error(`  Помилка при оптимізації ${imagePath}:`, err);
        
        // Видаляємо невдалий файл, якщо він був створений
        if (fs.existsSync(optimizedPath)) {
          fs.unlinkSync(optimizedPath);
        }
      }
    }
    
    console.log('Оптимізацію завершено!');
  } catch (error) {
    console.error('Помилка при оптимізації зображень:', error);
  }
}

// Запуск оптимізації
optimizeImages();

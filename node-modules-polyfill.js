// node-modules-polyfill.js
// Цей файл містить поліфіли для Node.js модулів, які не доступні в React Native

// Перевизначаємо модуль 'net' для запобігання помилок
if (typeof global.process === 'undefined') {
  global.process = require('process');
}

// Поліфіл для 'net' модуля
global.net = {
  Socket: function() {
    throw new Error('Модуль net не підтримується в React Native');
  },
  connect: function() {
    throw new Error('Модуль net не підтримується в React Native');
  },
  createServer: function() {
    throw new Error('Модуль net не підтримується в React Native');
  }
};

// Поліфіл для 'tls' модуля, який часто використовується разом з 'net'
global.tls = {
  connect: function() {
    throw new Error('Модуль tls не підтримується в React Native');
  },
  createServer: function() {
    throw new Error('Модуль tls не підтримується в React Native');
  }
};

// Інші поліфіли можна додати за потреби

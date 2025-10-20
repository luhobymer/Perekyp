// Поліфіли для модулів Node.js
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = global.process || require('process');

// Заглушки для модулів Node.js, які не використовуються безпосередньо
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
global.process.version = 'v14.17.0';

// Заглушка для модуля stream
if (typeof global.stream === 'undefined') {
  global.stream = {};
}

// Заглушка для інших модулів Node.js
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = setTimeout;
}
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = clearTimeout;
}

// Поліфіл для 'net' модуля, який використовується ws
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

// Поліфіл для 'tls' модуля
global.tls = {
  connect: function() {
    throw new Error('Модуль tls не підтримується в React Native');
  },
  createServer: function() {
    throw new Error('Модуль tls не підтримується в React Native');
  }
};

// Додаткові поліфіли для інших модулів Node.js
global.http = false;
global.https = false;
global.fs = false;
global.path = false;
global.url = false;

// Використовуємо нативний WebSocket
global.WebSocket = global.WebSocket || global.originalWebSocket;

// Вимикаємо використання ws в додатку
try {
  // Перевизначаємо require для пакету ws
  const originalRequire = global.require;
  if (originalRequire) {
    global.require = function(moduleName) {
      if (moduleName === 'ws' || moduleName.includes('ws/')) {
        console.warn('Спроба завантажити модуль ws була заблокована');
        return {};
      }
      return originalRequire(moduleName);
    };
  }
} catch (e) {
  console.warn('Помилка при налаштуванні перевизначення require:', e);
}

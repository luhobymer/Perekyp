// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Отримуємо конфігурацію за замовчуванням
const config = getDefaultConfig(__dirname);

// Додаємо додаткові розширення файлів
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Налаштовуємо порядок пошуку модулів
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Встановлюємо шляхи до поліфілів
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Використовуємо заглушку для ws
  ws: path.resolve(__dirname, 'src/ws-stub.js'),
  // Вимикаємо непотрібні модулі
  net: false,
  tls: false,
  dns: false,
  child_process: false,
  fs: false,
  // Вказуємо поліфіли для Node.js модулів
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  http: require.resolve('@tradle/react-native-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  zlib: require.resolve('browserify-zlib'),
  events: require.resolve('events'),
  // Використовуємо заглушку для url
  url: path.resolve(__dirname, 'src/url-stub.js')
};

// Вимикаємо кешування
config.resetCache = true;

module.exports = config;

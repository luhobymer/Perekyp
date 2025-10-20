const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Додаємо додаткові налаштування
  config.resolver.extraNodeModules.require = require.resolve('node-libs-browser');
  
  // Вимикаємо проблемні модулі
  config.resolver.extraNodeModules.ws = false;
  config.resolver.extraNodeModules.net = false;
  config.resolver.extraNodeModules.tls = false;
  
  // Додаємо додаткові розширення
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];
  
  return config;
})();

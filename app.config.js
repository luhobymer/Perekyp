// app.config.js
module.exports = {
  name: 'PerekypApp',
  slug: 'PerekypApp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.perekyp.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.perekyp.app'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  // Налаштування для заміни проблемних модулів
  plugins: [],
  extra: {
    // Тут можна додати додаткові змінні оточення
  }
};

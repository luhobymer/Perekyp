module.exports = function(api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    plugins: [
      // Плагіни для вирішення проблеми з _interopRequireDefault
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-runtime',
      // Плагіни для expo-router інтегровані в babel-preset-expo
      'react-native-reanimated/plugin',
    ],
  };
};

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native', 'import'],
  rules: {
    // Заборона використання any
    '@typescript-eslint/no-explicit-any': 'warn',
    // Заборона невикористаних змінних
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // Правила для React
    'react/prop-types': 'off', // Вимикаємо, оскільки використовуємо TypeScript
    'react/react-in-jsx-scope': 'off', // Не потрібно в React 17+
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Правила для React Native
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off', // Вимикаємо, бо може конфліктувати з i18n
    // Правила для імпортів
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin', // Вбудовані модулі Node.js
          'external', // Зовнішні пакети npm
          'internal', // Внутрішні модулі (абсолютні шляхи)
          'parent', // Імпорти з батьківських директорій
          'sibling', // Імпорти з тієї ж директорії
          'index', // Імпорти з індексних файлів
          'object', // Імпорти об'єктів
          'type' // Імпорти типів
        ],
        'pathGroups': [
          {
            'pattern': 'react+(|-native)',
            'group': 'builtin',
            'position': 'before'
          },
          {
            'pattern': '@/**',
            'group': 'internal'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
    'import/no-duplicates': 'warn'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    'react-native/react-native': true,
  },
  ignorePatterns: ['node_modules/', 'babel.config.js', 'metro.config.js'],
};

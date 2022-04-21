module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'plugin:@next/next/recommended',
  ],
  plugins: ['react'],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  globals: {
    Sentry: true, // Sentry
    _trm: true, // WTS
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    'no-console': 'warn',
    '@next/next/no-img-element': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'no-empty-pattern': 'off',
  },
};

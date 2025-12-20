module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    //'eslint:recommended', // no p Reglas básicas de errores
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '_app.js',
    '_document.js',
    'jsconfig.json',
  ],
  plugins: ['prefer-arrow', 'prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    //'no-console': 'warn',
    //'no-undef': 'error', //no p
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['ui/**/*.js'],
    },
  ],
};

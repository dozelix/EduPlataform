const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['dist', 'dist-gh', 'release', '**/node_modules/**'] },
  js.configs.recommended,
  {
    files: ['packages/*/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // React no se referencia explícitamente con el JSX transform moderno (Vite),
      // y permitimos variables/argumentos intencionalmente descartados con prefijo "_".
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^(React|_)', argsIgnorePattern: '^_' },
      ],
    },
  },
];

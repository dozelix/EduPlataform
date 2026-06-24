const js = require('@eslint/js');

module.exports = [
  // Esto reemplaza a 'ignorePatterns'
  {
    ignores: ['dist', '.eslintignore'],
  },
  
  // Configuración global para tus archivos
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      // Esto reemplaza a 'env' (browser y node)
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
      },
    },
    // Esto reemplaza a 'extends: ["eslint:recommended"]'
    rules: {
      ...js.configs.recommended.rules,
      // Aquí puedes agregar tus reglas personalizadas si las necesitas más adelante
    },
  },
];
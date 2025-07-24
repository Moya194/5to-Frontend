// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true, // <-- AÑADIDO: Para reconocer variables globales del navegador (ej. window, document)
    'vue/setup-compiler-macros': true // <-- ¡AÑADIDO Y MUY IMPORTANTE! Esto habilita las macros de <script setup>
  },
  extends: [
    'plugin:vue/vue3-essential', // Esto está bien. Para más reglas, podrías considerar 'plugin:vue/vue3-strongly-recommended' en el futuro.
    'eslint:recommended',
  ],
  parserOptions: {
    // Cuando usas 'plugin:vue/vue3-essential', este ya configura 'vue-eslint-parser' como el parser principal
    // para los archivos .vue. 'vue-eslint-parser' luego usa el parser que especifiques aquí (o su default)
    // para el contenido de la etiqueta <script>.
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // Esto está bien si no tienes un babel.config.js separado o no lo necesitas para linting
    ecmaVersion: 'latest', // Es bueno especificar una versión moderna de ECMAScript
    sourceType: 'module',  // Para usar import/export
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Puedes añadir esta regla si usas componentes con un solo nombre (ej. Home.vue en lugar de HomeView.vue)
    // y no quieres que ESLint te advierta. Si no, puedes quitarla.
    'vue/multi-word-component-names': 'off',
  },
};
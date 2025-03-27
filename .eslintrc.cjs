/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping.
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // or 'warn',
    "vue/multi-word-component-names": "off",
  },
};

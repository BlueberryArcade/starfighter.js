import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import { includeIgnoreFile } from './.eslint-gitignore.js';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        allowImportExportEverywhere: true
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-underscore-dangle': 0,
      'no-console': 0,
      'no-unused-vars': 'warn',
      'no-shadow': 'warn',
      'no-param-reassign': ['warn', { props: true }],
      complexity: ['warn', 15],
      'max-lines': ['error', 1000],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'class-methods-use-this': 'off',
      'no-use-before-define': 'off',
      'func-names': 'off',
      eqeqeq: 'off',
      'no-plusplus': 'off',
      'no-bitwise': 'off',
      'no-return-await': 'off',
      'spaced-comment': ['error', 'always'],
      'no-await-in-loop': 0,
      'no-restricted-syntax': 0
    }
  },
  includeIgnoreFile()
];

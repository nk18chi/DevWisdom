import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import * as airbnbBestPracticesConfig from 'eslint-config-airbnb-base/rules/best-practices';
import * as airbnbErrorsConfig from 'eslint-config-airbnb-base/rules/errors';
import * as airbnbES6Config from 'eslint-config-airbnb-base/rules/es6';
import * as airbnbNodeConfig from 'eslint-config-airbnb-base/rules/node';
import * as airbnbStyleConfig from 'eslint-config-airbnb-base/rules/style';
import * as airbnbVariablesConfig from 'eslint-config-airbnb-base/rules/variables';
// import * as airbnbImportConfig from 'eslint-config-airbnb-base/rules/imports';

export default [
  // Base configurations
  eslint.configs.recommended,

  // TypeScript configurations
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...airbnbBestPracticesConfig.default.rules,
      ...airbnbErrorsConfig.default.rules,
      ...airbnbES6Config.default.rules,
      ...airbnbNodeConfig.default.rules,
      ...airbnbStyleConfig.default.rules,
      ...airbnbVariablesConfig.default.rules,
      // ...airbnbImportConfig.default.rules,
      ...prettier.rules,
      'no-underscore-dangle': 'off',
      'max-len': ['error', { code: 120 }],
      'object-curly-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Prettier config should be last to override other formatting rules
  prettier,

  // Ignore patterns (converted from .eslintignore)
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'src/graphql/types.ts'],
  },
];

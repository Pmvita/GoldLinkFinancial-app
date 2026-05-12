// Flat ESLint v9 config for the GoldLink-Bank monorepo.
//
// Initial scope: apps/web/src, packages/core/src, and root-level *.config.{ts,js,mjs}.
// A parallel worker is concurrently editing apps/web/src/app/components and
// apps/mobile/, so we ignore apps/mobile entirely and may narrow the web scope
// later (see TODO below) if the JSON-wiring worker introduces transient errors.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'apps/mobile/**',
      'db/**',
      'pnpm-lock.yaml',
      '.github/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: [
      'apps/web/src/**/*.{ts,tsx}',
      'packages/core/src/**/*.{ts,tsx}',
      '*.config.{ts,js,mjs}',
      'apps/*/*.config.{ts,js,mjs}',
      'packages/*/*.config.{ts,js,mjs}',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: '18.3' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'off',
    },
  },

  // Vitest test files: relax a couple of rules.
  {
    files: ['packages/core/src/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  prettier,
];

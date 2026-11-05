import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.karma-tmp', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['tests/jasmine/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.jasmine },
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['karma.conf.cjs', 'tools/run-karma.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])

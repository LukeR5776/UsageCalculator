// ESLint configuration for code quality and style enforcement
// ESLint helps catch bugs and maintain consistent code style across the project

// Import ESLint's recommended JavaScript rules
import js from '@eslint/js'
// Import global variable definitions for different environments
import globals from 'globals'
// Import React Hooks linting rules to catch common React mistakes
import reactHooks from 'eslint-plugin-react-hooks'
// Import React Refresh plugin for development hot reloading
import reactRefresh from 'eslint-plugin-react-refresh'
// Import TypeScript ESLint configuration
import tseslint from 'typescript-eslint'
// Import global ignore patterns
import { globalIgnores } from 'eslint/config'

// Export the ESLint configuration using TypeScript ESLint's config helper
export default tseslint.config([
  // Ignore the build output directory from linting
  globalIgnores(['dist']),

  // Configuration for TypeScript and TypeScript React files
  {
    // Apply these rules to all TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],

    // Extend multiple configuration presets
    extends: [
      js.configs.recommended,                    // Basic JavaScript best practices
      tseslint.configs.recommended,              // TypeScript-specific rules
      reactHooks.configs['recommended-latest'],  // React Hooks rules (prevent common mistakes)
      reactRefresh.configs.vite,                // React Refresh rules for Vite development
    ],

    // Language and environment configuration
    languageOptions: {
      ecmaVersion: 2020,        // Use ES2020 syntax features
      globals: globals.browser, // Enable browser global variables (window, document, etc.)
    },
  },
])

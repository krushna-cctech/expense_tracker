import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

/**
 * Root Vitest config. All test source lives under test/unit/ per AGENTS.md.
 *
 * - extensionAlias lets Vite resolve NodeNext-style ".js" import specifiers
 *   to the ".ts" source files, so tests run against source with no build step.
 * - The shared package is aliased to its source for the same reason.
 */
export default defineConfig({
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
    alias: {
      '@expense-tracker/shared': resolve(rootDir, 'src/shared/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['test/unit/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});

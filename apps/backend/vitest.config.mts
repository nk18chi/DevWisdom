import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    clearMocks: true,
    globals: true,
    coverage: {
      exclude: ['html/assets/**', 'src/index.ts', 'src/models/**', '**/*.seed.ts', '**/types.ts', '**/*.entity.ts'],
      enabled: true,
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});

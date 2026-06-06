import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**', 'tests/e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html', 'lcov'],
        reportsDirectory: './coverage',
        // Couverture unitaire ciblée sur la logique réutilisable.
        // Les vues et le shell sont couverts par les tests e2e (Playwright).
        include: ['src/components/ui/**', 'src/stores/**', 'src/services/**', 'src/data/**'],
        exclude: ['src/**/*.d.ts', '**/__tests__/**'],
        thresholds: {
          statements: 60,
          branches: 60,
          functions: 60,
          lines: 60,
        },
      },
    },
  }),
)

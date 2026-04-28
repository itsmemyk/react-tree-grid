import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
})

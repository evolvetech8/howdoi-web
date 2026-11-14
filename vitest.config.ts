import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/engine/**/*.{test,spec}.{ts,tsx}',
      'tests/ui/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', '.next', '.agents', 'tests/e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

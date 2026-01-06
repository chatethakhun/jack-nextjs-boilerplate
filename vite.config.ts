import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- Import the 'path' module

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
  // Add this 'resolve' section
  resolve: {
    alias: {
      // This maps the '@' alias to your 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});

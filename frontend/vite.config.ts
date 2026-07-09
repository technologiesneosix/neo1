import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react() as any],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Deduplicate vite to prevent plugin type conflicts when multiple vite
    // installations exist (e.g. root node_modules vs frontend node_modules)
    dedupe: ['vite'],
  },
  server: {
    port: 5173,
  },
});

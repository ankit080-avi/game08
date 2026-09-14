import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE || '/game08/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/temp_*/**', '**/*.png', '**/*.jpg', '**/*.log']
    }
  },
});

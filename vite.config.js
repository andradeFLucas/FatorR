import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['jspdf', 'jspdf-autotable'],
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
});

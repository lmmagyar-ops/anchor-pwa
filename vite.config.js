import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build for production
    minify: 'esbuild',
    sourcemap: false, // Disable source maps for smaller bundle
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react']
        }
      }
    },
    // Increase chunk size warning limit (for larger apps)
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})

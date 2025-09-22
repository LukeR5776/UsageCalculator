// Import Vite's configuration function and React plugin
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration file
// Vite is a fast build tool and development server for modern web applications
// Documentation: https://vite.dev/config/
export default defineConfig({
  // Enable React plugin for JSX support and hot module replacement during development
  plugins: [react()],

  // Set base path for assets - './' ensures relative paths work for deployment
  base: './',

  // Build configuration for production
  build: {
    // Rollup is the bundler Vite uses for production builds
    rollupOptions: {
      output: {
        // Manual chunks help optimize loading by separating vendor libraries
        manualChunks: {
          // Separate React libraries into their own chunk for better caching
          // When React updates, only this chunk needs to be re-downloaded
          vendor: ['react', 'react-dom']
        },
      },
    },
    // Increase the warning limit for chunk sizes (default is 500kb)
    // This prevents warnings for slightly larger chunks
    chunkSizeWarningLimit: 1000,
  },
})

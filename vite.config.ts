import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      '@tanstack/react-query',
      'wagmi',
      'wagmi/chains',
      'wagmi/connectors',
      'viem',
      'viem/chains',
      'connectkit',
      'framer-motion',
      'lucide-react',
      'sonner',
      'clsx',
      'tailwind-merge',
    ],
  },
  build: {
    // Keep the production build informative while allowing intentional
    // Web3 vendor chunks to remain above Vite's default warning threshold.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'web3-core': ['wagmi', 'viem', 'connectkit'],
          'query-ui': ['@tanstack/react-query', 'sonner'],
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    cors: true,
  },
})

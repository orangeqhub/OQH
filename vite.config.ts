import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The three.js studio is a single lazy chunk (~270 kB gzip) fetched after
    // first paint; the warning threshold is raised for that chunk only.
    chunkSizeWarningLimit: 1100,
  },
})

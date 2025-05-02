import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['7d78-2804-d46-3b0e-6500-13d-ee9e-7c72-6e4f.ngrok-free.app']
  }
})

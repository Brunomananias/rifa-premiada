import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '7c1c-2804-d46-3b0e-6500-c8c5-48f-4388-e167.ngrok-free.app'
    ]
  }
})

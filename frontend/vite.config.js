import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Permite el Host que presenta un tunel de Cloudflare (trycloudflare.com)
    // cuando alguien fuera de la red local prueba el sistema. Solo para
    // pruebas de desarrollo, nunca en un despliegue real.
    allowedHosts: [".trycloudflare.com"],
  },
})

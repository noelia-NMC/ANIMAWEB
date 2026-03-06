// ARCHIVO PARA AÑADIR/MODIFICAR: frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- AÑADIR ESTA SECCIÓN ---
  // Esta es la configuración clave del proxy.
  server: {
    proxy: {
      // Cualquier petición que empiece con '/api'
      '/api': {
        // será redirigida a tu servidor backend
        target: 'http://localhost:4000', // Asegúrate de que este sea el puerto de tu backend
        // Necesario para que el backend acepte la petición
        changeOrigin: true,
      },
    },
  },
})